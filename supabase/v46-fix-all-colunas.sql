-- =====================================================================
-- SEPARI — FIX TODAS AS COLUNAS FALTANTES (fix-all)
-- =====================================================================
-- Adiciona TODAS as colunas que o frontend espera mas que não estavam
-- no schema do v42-reset-completo.sql. Inclui:
--   - profiles: campos extras (endereço, cargo, segmento, etc)
--   - kits: price_adjustment_type / price_adjustment_value
--   - parts: stock + updated_at (caso v45 não tenha rodado)
--   - services/kits: updated_at
--
-- Idempotente — pode rodar várias vezes sem erro.
-- Cole no SQL Editor → Run.
-- =====================================================================

-- ════════════════════════════════════════════════════════════════════
-- 1. PROFILES — campos extras
-- ════════════════════════════════════════════════════════════════════
alter table public.profiles
  add column if not exists secondary_phone text,
  add column if not exists position        text,
  add column if not exists segment         text,
  add column if not exists address         text,
  add column if not exists neighborhood    text,
  add column if not exists city            text,
  add column if not exists state           text,
  add column if not exists postal_code     text,
  add column if not exists notes           text;


-- ════════════════════════════════════════════════════════════════════
-- 2. PARTS — stock + updated_at (caso v45-fix-colunas.sql não tenha rodado)
-- ════════════════════════════════════════════════════════════════════
alter table public.parts
  add column if not exists stock      int         not null default 0,
  add column if not exists updated_at timestamptz not null default now();


-- ════════════════════════════════════════════════════════════════════
-- 3. SERVICES — updated_at
-- ════════════════════════════════════════════════════════════════════
alter table public.services
  add column if not exists updated_at timestamptz not null default now();


-- ════════════════════════════════════════════════════════════════════
-- 4. KITS — price_adjustment_type/value + updated_at
-- ════════════════════════════════════════════════════════════════════
alter table public.kits
  add column if not exists price_adjustment_type  text        not null default 'absolute' check (price_adjustment_type in ('absolute','percent')),
  add column if not exists price_adjustment_value numeric(10,2) not null default 0,
  add column if not exists updated_at             timestamptz not null default now();


-- ════════════════════════════════════════════════════════════════════
-- 5. VIEW kits_with_pricing — recriar usando as colunas novas
-- ════════════════════════════════════════════════════════════════════
-- Antes usava price_adjustment_pct/abs. Agora usa type/value.
drop view if exists public.user_visible_kits;
drop view if exists public.kits_with_pricing;

create view public.kits_with_pricing
with (security_invoker = true) as
select
  k.*,
  coalesce((
    select sum(p.price * ki.quantity)
    from public.kit_items ki
    join public.parts p on p.id = ki.part_id
    where ki.kit_id = k.id
  ), 0) as parts_total,
  coalesce((
    select sum(s.price * ks.quantity)
    from public.kit_services ks
    join public.services s on s.id = ks.service_id
    where ks.kit_id = k.id
  ), 0) as services_total,
  -- preço final = (peças + serviços) com ajuste type/value
  case k.price_adjustment_type
    when 'percent' then
      (
        coalesce((select sum(p.price * ki.quantity) from public.kit_items ki join public.parts p on p.id = ki.part_id where ki.kit_id = k.id), 0)
        + coalesce((select sum(s.price * ks.quantity) from public.kit_services ks join public.services s on s.id = ks.service_id where ks.kit_id = k.id), 0)
      ) * (1 + coalesce(k.price_adjustment_value, 0) / 100.0)
    else
      (
        coalesce((select sum(p.price * ki.quantity) from public.kit_items ki join public.parts p on p.id = ki.part_id where ki.kit_id = k.id), 0)
        + coalesce((select sum(s.price * ks.quantity) from public.kit_services ks join public.services s on s.id = ks.service_id where ks.kit_id = k.id), 0)
      ) + coalesce(k.price_adjustment_value, 0)
  end as final_price
from public.kits k;

create view public.user_visible_kits
with (security_invoker = true) as
select distinct k.*
from public.kits_with_pricing k
join public.user_machines um on um.machine_model_id = k.machine_model_id
where k.is_active = true
  and um.user_id = auth.uid()
  and um.status = 'approved';


-- ════════════════════════════════════════════════════════════════════
-- 6. TRIGGERS de updated_at (idempotente)
-- ════════════════════════════════════════════════════════════════════
drop trigger if exists trg_parts_updated_at on public.parts;
create trigger trg_parts_updated_at
  before update on public.parts
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
  before update on public.services
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_kits_updated_at on public.kits;
create trigger trg_kits_updated_at
  before update on public.kits
  for each row execute procedure public.set_updated_at();


-- ════════════════════════════════════════════════════════════════════
-- 7. GRANTS pras views recriadas
-- ════════════════════════════════════════════════════════════════════
grant select on public.kits_with_pricing  to anon, authenticated;
grant select on public.user_visible_kits  to anon, authenticated;


-- ════════════════════════════════════════════════════════════════════
-- 8. NOTIFY pgrst — força Supabase a recarregar o cache de schema
-- ════════════════════════════════════════════════════════════════════
notify pgrst, 'reload schema';


-- ════════════════════════════════════════════════════════════════════
-- 9. VERIFICAÇÃO — lista todas as colunas das tabelas críticas
-- ════════════════════════════════════════════════════════════════════
select
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('profiles', 'parts', 'services', 'kits')
order by table_name, ordinal_position;
