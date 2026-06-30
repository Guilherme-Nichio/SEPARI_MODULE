-- =====================================================================
-- SEPARI v3.9 / Migration v38 — Preços nas peças + Kits (Revisão Preventiva)
-- Execute este script INTEIRO no SQL Editor do Supabase
-- É 100% idempotente — pode rodar de novo sem quebrar nada.
-- =====================================================================

-- =====================================================================
-- 1. PEÇAS — adicionar preço e flag de visibilidade
-- =====================================================================

alter table public.parts
  add column if not exists price numeric(12,2) default 0 check (price >= 0),
  add column if not exists price_visible boolean default true;

comment on column public.parts.price is 'Preço unitário em R$ (sempre não-negativo).';
comment on column public.parts.price_visible is 'Quando true, o cliente vê o preço da peça. Default true. Admin sempre vê.';


-- =====================================================================
-- 2. KITS — cabeçalho do kit (código mãe, tipo, ajuste de preço)
-- =====================================================================

create table if not exists public.kits (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,                           -- código mãe do kit (ex: KIT-COMPLETO-MRPX418)
  name text not null,                                  -- nome amigável
  description text,
  image_url text,

  -- Tipo do kit (atrelado à feature de Revisão Preventiva)
  -- 'preventive_complete'     → KIT COMPLETO (revisão preventiva)
  -- 'preventive_intermediate' → KIT INTERMEDIÁRIO (revisão preventiva)
  -- 'custom'                  → kit genérico criado pelo admin (não é revisão preventiva)
  kit_type text not null default 'custom'
    check (kit_type in ('preventive_complete', 'preventive_intermediate', 'custom')),

  -- A qual modelo de máquina este kit se aplica (obrigatório para o cliente conseguir filtrar)
  machine_model_id uuid not null references public.machine_models(id) on delete restrict,

  -- Conjunto mecânico (opcional — ex: kit só de tambor)
  assembly_id uuid references public.mechanical_assemblies(id) on delete set null,

  -- Ajuste de preço sobre a soma dos itens
  -- type='percent' & value=-10  → 10% de desconto
  -- type='percent' & value=+5   → 5% de acréscimo
  -- type='absolute' & value=-200 → R$ 200 de desconto
  -- type='absolute' & value=0   → sem ajuste (default)
  price_adjustment_type text not null default 'absolute'
    check (price_adjustment_type in ('percent', 'absolute')),
  price_adjustment_value numeric(12,2) not null default 0,

  -- Visibilidade pro cliente
  is_active boolean default true,
  price_visible boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_kits_machine_model on public.kits(machine_model_id);
create index if not exists idx_kits_assembly on public.kits(assembly_id);
create index if not exists idx_kits_type on public.kits(kit_type);
create index if not exists idx_kits_active on public.kits(is_active);

comment on table public.kits is 'Kits = conjunto pré-definido de peças com código próprio e preço calculado da soma + ajuste.';
comment on column public.kits.price_adjustment_value is 'Valor positivo = acréscimo. Valor negativo = desconto.';

-- Garantir kit_type único de revisão preventiva POR modelo (não faz sentido ter 2 kits "Completo" da mesma máquina)
create unique index if not exists uniq_preventive_kit_per_model
  on public.kits(machine_model_id, kit_type)
  where kit_type in ('preventive_complete', 'preventive_intermediate');


-- =====================================================================
-- 3. KIT_ITEMS — peças dentro de cada kit
-- =====================================================================

create table if not exists public.kit_items (
  id uuid primary key default uuid_generate_v4(),
  kit_id uuid not null references public.kits(id) on delete cascade,
  part_id uuid not null references public.parts(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique (kit_id, part_id)
);

create index if not exists idx_kit_items_kit on public.kit_items(kit_id);
create index if not exists idx_kit_items_part on public.kit_items(part_id);


-- =====================================================================
-- 4. VIEW: kits com preço base e preço final calculados
-- =====================================================================

drop view if exists public.kits_with_pricing cascade;
create view public.kits_with_pricing as
with sums as (
  select
    ki.kit_id,
    coalesce(sum(p.price * ki.quantity), 0) as base_price,
    count(*) as item_count
  from public.kit_items ki
  join public.parts p on p.id = ki.part_id
  group by ki.kit_id
)
select
  k.*,
  coalesce(s.base_price, 0) as base_price,
  coalesce(s.item_count, 0) as item_count,
  case
    when k.price_adjustment_type = 'percent' then
      round(coalesce(s.base_price, 0) * (1 + k.price_adjustment_value / 100.0), 2)
    else
      coalesce(s.base_price, 0) + k.price_adjustment_value
  end as final_price,
  mm.brand as machine_brand,
  mm.model as machine_model,
  ma.name as assembly_name
from public.kits k
left join sums s on s.kit_id = k.id
left join public.machine_models mm on mm.id = k.machine_model_id
left join public.mechanical_assemblies ma on ma.id = k.assembly_id;

comment on view public.kits_with_pricing is 'Kits com base_price (soma das peças × quantidade) e final_price (com ajuste aplicado).';


-- =====================================================================
-- 5. VIEW: kits visíveis ao cliente (filtrados por máquinas aprovadas)
-- =====================================================================

drop view if exists public.user_visible_kits cascade;
create view public.user_visible_kits as
select kwp.*
from public.kits_with_pricing kwp
where kwp.is_active = true
  and exists (
    select 1 from public.user_machines um
    where um.user_id = auth.uid()
      and um.status = 'approved'
      and um.machine_model_id = kwp.machine_model_id
  );

grant select on public.kits_with_pricing to authenticated;
grant select on public.user_visible_kits to authenticated;


-- =====================================================================
-- 6. QUOTE_ITEMS — agora suporta peça OU kit
-- =====================================================================

-- part_id passa a ser opcional (porque pode ser um kit no lugar)
alter table public.quote_items
  alter column part_id drop not null;

-- kit_id novo
alter table public.quote_items
  add column if not exists kit_id uuid references public.kits(id) on delete restrict;

create index if not exists idx_qi_kit on public.quote_items(kit_id);

-- Garantia: cada item é OU peça OU kit (nunca os dois nem nenhum)
alter table public.quote_items
  drop constraint if exists quote_items_part_xor_kit;

alter table public.quote_items
  add constraint quote_items_part_xor_kit check (
    (part_id is not null and kit_id is null) or
    (part_id is null and kit_id is not null)
  );


-- =====================================================================
-- 7. RLS — Kits
-- =====================================================================

alter table public.kits enable row level security;
alter table public.kit_items enable row level security;

-- KITS: qualquer autenticado lê ativos, admin lê/escreve tudo
drop policy if exists "kits_read_active" on public.kits;
create policy "kits_read_active" on public.kits
  for select to authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "kits_admin_write" on public.kits;
create policy "kits_admin_write" on public.kits
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- KIT_ITEMS: qualquer autenticado lê (se o kit pai está visível), admin escreve
drop policy if exists "kit_items_read" on public.kit_items;
create policy "kit_items_read" on public.kit_items
  for select to authenticated
  using (
    exists (
      select 1 from public.kits k
      where k.id = kit_items.kit_id
        and (k.is_active = true or public.is_admin())
    )
  );

drop policy if exists "kit_items_admin_write" on public.kit_items;
create policy "kit_items_admin_write" on public.kit_items
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- =====================================================================
-- 8. UPDATED_AT trigger pra kits
-- =====================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_kits_updated_at on public.kits;
create trigger trg_kits_updated_at
  before update on public.kits
  for each row execute procedure public.set_updated_at();


-- =====================================================================
-- 9. (Opcional) Atualiza a view user_visible_parts pra incluir price
--    A view já fazia `p.*`, então o novo campo `price` e `price_visible`
--    serão pegos automaticamente. Não precisa recriar.
--    Deixo este DROP/CREATE comentado caso queira forçar recriação:
-- =====================================================================
-- drop view if exists public.user_visible_parts;
-- (recria igual à v3.6 — p.* já pega os novos campos)


-- =====================================================================
-- PRONTO. Próximos passos:
--   1. (Opcional) Cadastre preços nas peças existentes no /admin/pecas
--   2. Crie kits em /admin/kits (rota que entregaremos na Fase 2)
-- =====================================================================
