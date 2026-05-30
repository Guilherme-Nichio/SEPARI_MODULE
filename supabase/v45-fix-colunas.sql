-- =====================================================================
-- SEPARI — FIX COLUNAS FALTANTES no schema
-- =====================================================================
-- O frontend (AdminParts.jsx, AdminServices.jsx, Perfil.jsx) envia
-- colunas que não estavam no schema do v42-reset-completo.sql:
--   - parts.stock
--   - parts.updated_at
--   - services.updated_at
--
-- Este script adiciona essas colunas + cria os triggers de updated_at
-- automático. Pode rodar quantas vezes quiser (idempotente).
--
-- Cole no SQL Editor → Run.
-- =====================================================================

-- 1. Coluna `stock` em parts (quantidade em estoque)
alter table public.parts
  add column if not exists stock int not null default 0;

-- 2. Coluna `updated_at` em parts
alter table public.parts
  add column if not exists updated_at timestamptz not null default now();

-- 3. Coluna `updated_at` em services
alter table public.services
  add column if not exists updated_at timestamptz not null default now();

-- 4. Coluna `updated_at` em kits (preventivo, caso vá precisar)
alter table public.kits
  add column if not exists updated_at timestamptz not null default now();

-- 5. Triggers de updated_at automático (a função set_updated_at já existe
--    no schema do v42, criada na PARTE 4)
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

-- 6. PostgREST cache reload — o Supabase mantém um cache do schema.
--    Quando você adiciona coluna nova, o cache pode demorar pra atualizar.
--    Este NOTIFY força recarga imediata.
notify pgrst, 'reload schema';

-- 7. Verificação
select
  table_name,
  column_name,
  data_type,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('parts', 'services', 'kits')
  and column_name in ('stock', 'updated_at')
order by table_name, column_name;
