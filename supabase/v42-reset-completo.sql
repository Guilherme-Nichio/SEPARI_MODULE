-- =====================================================================
-- SEPARI v3.13 — RESET COMPLETO + SCHEMA UNIFICADO
-- =====================================================================
-- ⚠️  ATENÇÃO ⚠️
-- Este script APAGA todas as tabelas, views, funções e triggers do schema
-- public e recria do zero. Use SOMENTE em ambiente novo ou de teste.
--
-- Como rodar:
--   1. No Supabase: SQL Editor → New query → cole TUDO → Run
--   2. Depois, crie os usuários no Authentication → Add user:
--      • adm@separi.com.br      senha: 123456
--      • cliente@teste.com      senha: 123456
--   3. Volte ao SQL Editor e rode o BLOCO FINAL deste arquivo para
--      promover o adm@separi.com.br a admin.
--
-- O script é idempotente — pode ser rodado várias vezes sem erro.
-- =====================================================================

-- =====================================================================
-- PARTE 1 — LIMPEZA: derruba tudo do schema public
-- =====================================================================

-- Remove triggers das tabelas auth (criados em sessões anteriores)
drop trigger if exists on_auth_user_created on auth.users;

-- Remove TUDO do schema public (CASCADE limpa as dependências)
drop schema if exists public cascade;
create schema public;
grant usage on schema public to anon, authenticated, service_role;
grant all on schema public to postgres, service_role;

-- Limpa políticas e buckets de storage previamente criados
do $$
declare
  pol record;
  bk  record;
begin
  -- Drop todas as policies em storage.objects e storage.buckets
  for pol in (select policyname, tablename from pg_policies where schemaname = 'storage' and tablename in ('objects','buckets')) loop
    execute format('drop policy if exists %I on storage.%I', pol.policyname, pol.tablename);
  end loop;
  -- NOTA: o Supabase moderno bloqueia DELETE direto em storage.objects via
  -- trigger protect_delete(). Por isso NÃO tentamos limpar arquivos antigos
  -- aqui. Os buckets são reaproveitados via `on conflict do nothing` no
  -- INSERT mais abaixo (parte 7). Arquivos antigos que sobrarem nos buckets
  -- ficam "órfãos" mas não atrapalham o funcionamento da aplicação. Se
  -- quiser limpar arquivos órfãos, faça pelo painel:
  --   Storage → cada bucket → selecionar tudo → Delete
  -- ou pela API: supabase.storage.from('bucket').remove([...paths])
  null;
end$$;


-- =====================================================================
-- PARTE 2 — EXTENSÕES
-- =====================================================================
create extension if not exists "uuid-ossp";


-- =====================================================================
-- PARTE 3 — TABELAS
-- =====================================================================

-- 3.1 PROFILES — estende auth.users
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique not null,
  full_name    text,
  company_name text,
  cnpj         text,
  phone        text,
  role         text not null default 'customer' check (role in ('customer','admin')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_cnpj on public.profiles(cnpj);
create index idx_profiles_company on public.profiles(company_name);


-- 3.2 MACHINE_MODELS — catálogo de modelos
create table public.machine_models (
  id          uuid primary key default uuid_generate_v4(),
  brand       text not null,
  model       text not null,
  category    text,
  description text,
  created_at  timestamptz not null default now(),
  unique(brand, model)
);


-- 3.3 APPLICATIONS — segmentos / produtos processados
create table public.applications (
  id          uuid primary key default uuid_generate_v4(),
  name        text unique not null,
  description text,
  sort_order  int default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);


-- 3.4 MECHANICAL_ASSEMBLIES — conjuntos mecânicos
create table public.mechanical_assemblies (
  id            uuid primary key default uuid_generate_v4(),
  name          text unique not null,
  description   text,
  sort_order    int default 0,
  allows_custom boolean not null default false,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);


-- 3.5 USER_MACHINES — máquinas dos clientes
create table public.user_machines (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  machine_model_id  uuid not null references public.machine_models(id),
  application_id    uuid references public.applications(id),
  serial_number     text not null,
  photo_url         text not null,
  manual_url        text,
  status            text not null default 'pending' check (status in ('pending','approved','rejected')),
  rejection_reason  text,
  approved_by       uuid references public.profiles(id),
  approved_at       timestamptz,
  created_at        timestamptz not null default now()
);
create index idx_user_machines_user on public.user_machines(user_id);
create index idx_user_machines_status on public.user_machines(status);


-- 3.6 USER_MACHINE_ASSEMBLIES — conjuntos associados a uma máquina (opcional)
create table public.user_machine_assemblies (
  id              uuid primary key default uuid_generate_v4(),
  user_machine_id uuid not null references public.user_machines(id) on delete cascade,
  assembly_id     uuid not null references public.mechanical_assemblies(id),
  custom_name     text,
  created_at      timestamptz not null default now()
);
create index idx_uma_machine on public.user_machine_assemblies(user_machine_id);
create index idx_uma_assembly on public.user_machine_assemblies(assembly_id);


-- 3.7 USER_MACHINE_PHOTOS — fotos extras de uma máquina
create table public.user_machine_photos (
  id              uuid primary key default uuid_generate_v4(),
  user_machine_id uuid not null references public.user_machines(id) on delete cascade,
  image_url       text not null,
  sort_order      int default 0,
  created_at      timestamptz not null default now()
);
create index idx_user_machine_photos_machine on public.user_machine_photos(user_machine_id);


-- 3.8 PARTS — catálogo de peças
create table public.parts (
  id              uuid primary key default uuid_generate_v4(),
  code            text unique not null,
  name            text not null,
  description     text,
  category        text,
  image_url       text,
  assembly_id     uuid references public.mechanical_assemblies(id),
  stock           int not null default 0,
  price           numeric(10,2),
  price_visible   boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_parts_assembly on public.parts(assembly_id);
create index idx_parts_active on public.parts(is_active);


-- 3.9 PART_IMAGES — fotos extras de uma peça
create table public.part_images (
  id         uuid primary key default uuid_generate_v4(),
  part_id    uuid not null references public.parts(id) on delete cascade,
  image_url  text not null,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
create index idx_part_images_part on public.part_images(part_id);


-- 3.10 PART_MACHINE_COMPATIBILITY — quais peças servem em quais modelos
create table public.part_machine_compatibility (
  part_id          uuid not null references public.parts(id) on delete cascade,
  machine_model_id uuid not null references public.machine_models(id) on delete cascade,
  primary key (part_id, machine_model_id)
);


-- 3.11 SERVICES — catálogo de serviços (manutenção, balanceamento, etc)
create table public.services (
  id              uuid primary key default uuid_generate_v4(),
  code            text unique not null,
  name            text not null,
  description     text,
  category        text,
  image_url       text,
  duration_hours  numeric(10,2),
  price           numeric(10,2),
  price_visible   boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_services_code on public.services(code);
create index idx_services_active on public.services(is_active);


-- 3.12 KITS — kits de manutenção (peças + serviços agrupados)
create table public.kits (
  id                uuid primary key default uuid_generate_v4(),
  code              text unique not null,
  name              text not null,
  description       text,
  image_url         text,
  machine_model_id  uuid references public.machine_models(id),
  assembly_id       uuid references public.mechanical_assemblies(id),
  kit_type          text not null default 'custom' check (kit_type in ('preventive_complete','preventive_intermediate','custom')),
  price_adjustment_pct numeric(5,2),
  price_adjustment_abs numeric(10,2),
  price_visible     boolean not null default false,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index idx_kits_machine_model on public.kits(machine_model_id);
create index idx_kits_assembly on public.kits(assembly_id);
create index idx_kits_type on public.kits(kit_type);
create index idx_kits_active on public.kits(is_active);


-- 3.13 KIT_ITEMS — peças dentro de um kit
create table public.kit_items (
  id        uuid primary key default uuid_generate_v4(),
  kit_id    uuid not null references public.kits(id) on delete cascade,
  part_id   uuid not null references public.parts(id) on delete cascade,
  quantity  int not null default 1,
  unique (kit_id, part_id)
);
create index idx_kit_items_kit on public.kit_items(kit_id);
create index idx_kit_items_part on public.kit_items(part_id);


-- 3.14 KIT_SERVICES — serviços dentro de um kit
create table public.kit_services (
  id         uuid primary key default uuid_generate_v4(),
  kit_id     uuid not null references public.kits(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  quantity   int not null default 1,
  unique (kit_id, service_id)
);
create index idx_kit_services_kit on public.kit_services(kit_id);
create index idx_kit_services_service on public.kit_services(service_id);


-- 3.15 QUOTE_REQUESTS — pedidos de cotação do cliente
create table public.quote_requests (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  status          text not null default 'open' check (status in ('open','in_progress','answered','closed')),
  notes           text,
  admin_response  text,
  responded_by    uuid references public.profiles(id),
  responded_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_quote_requests_user on public.quote_requests(user_id);
create index idx_quote_requests_status on public.quote_requests(status);


-- 3.16 QUOTE_ITEMS — peças/kits/serviços dentro de uma cotação
create table public.quote_items (
  id              uuid primary key default uuid_generate_v4(),
  quote_id        uuid not null references public.quote_requests(id) on delete cascade,
  part_id         uuid references public.parts(id),
  kit_id          uuid references public.kits(id),
  service_id      uuid references public.services(id),
  user_machine_id uuid references public.user_machines(id),
  quantity        int not null default 1,
  created_at      timestamptz not null default now(),
  -- Garante que cada item refere-se a APENAS um dos três (part, kit OU service)
  check (
    (case when part_id is not null then 1 else 0 end +
     case when kit_id is not null then 1 else 0 end +
     case when service_id is not null then 1 else 0 end) = 1
  )
);
create index idx_quote_items_quote on public.quote_items(quote_id);
create index idx_quote_items_part on public.quote_items(part_id);
create index idx_quote_items_kit on public.quote_items(kit_id);
create index idx_quote_items_service on public.quote_items(service_id);


-- 3.17 CONTACT_MESSAGES — mensagens públicas de contato (opcional)
create table public.contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  status     text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);
create index idx_contact_status on public.contact_messages(status);
create index idx_contact_created on public.contact_messages(created_at desc);


-- =====================================================================
-- PARTE 4 — FUNÇÕES E TRIGGERS
-- =====================================================================

-- 4.1 Função: cria profile automaticamente quando user nasce em auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company_name, cnpj, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'cnpj', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 4.2 Função: atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger trg_quote_requests_updated_at
  before update on public.quote_requests
  for each row execute procedure public.set_updated_at();

create trigger trg_parts_updated_at
  before update on public.parts
  for each row execute procedure public.set_updated_at();

create trigger trg_services_updated_at
  before update on public.services
  for each row execute procedure public.set_updated_at();

create trigger trg_kits_updated_at
  before update on public.kits
  for each row execute procedure public.set_updated_at();


-- 4.3 Função: testa se o user atual é admin (usado em RLS)
create or replace function public.is_admin()
returns boolean
language sql
stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- =====================================================================
-- PARTE 5 — VIEWS
-- =====================================================================

-- 5.1 user_visible_parts — peças que o usuário corrente pode ver
-- Mostra peças ativas COMPATÍVEIS com algum modelo de máquina APROVADA
-- que o usuário corrente possui. Usa EXISTS pra garantir filtragem
-- correta + retorna `compatible_with` (array de labels "Marca Modelo")
-- que o frontend usa pra filtrar por máquina específica.
create or replace view public.user_visible_parts
with (security_invoker = true) as
select
  p.id,
  p.code,
  p.name,
  p.description,
  p.category,
  p.image_url,
  p.assembly_id,
  p.price,
  p.price_visible,
  p.is_active,
  p.stock,
  ma.name as assembly_name,
  (
    select array_agg(distinct mm.brand || ' ' || mm.model)
    from public.part_machine_compatibility pmc
    join public.machine_models mm on mm.id = pmc.machine_model_id
    join public.user_machines um
      on um.machine_model_id = pmc.machine_model_id
     and um.user_id = auth.uid()
     and um.status = 'approved'
    where pmc.part_id = p.id
  ) as compatible_with
from public.parts p
left join public.mechanical_assemblies ma on ma.id = p.assembly_id
where p.is_active = true
  and exists (
    select 1
    from public.part_machine_compatibility pmc
    join public.user_machines um
      on um.machine_model_id = pmc.machine_model_id
     and um.user_id = auth.uid()
     and um.status = 'approved'
    where pmc.part_id = p.id
  );


-- 5.2 kits_with_pricing — kits com preço calculado (soma de peças + serviços)
create or replace view public.kits_with_pricing
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
  -- preço final = (peças + serviços) +/- ajuste
  (
    coalesce((select sum(p.price * ki.quantity) from public.kit_items ki join public.parts p on p.id = ki.part_id where ki.kit_id = k.id), 0)
    + coalesce((select sum(s.price * ks.quantity) from public.kit_services ks join public.services s on s.id = ks.service_id where ks.kit_id = k.id), 0)
  ) * (1 + coalesce(k.price_adjustment_pct, 0) / 100.0) + coalesce(k.price_adjustment_abs, 0)
  as final_price
from public.kits k;


-- 5.3 user_visible_kits — kits que o user corrente pode ver
create or replace view public.user_visible_kits
with (security_invoker = true) as
select distinct k.*
from public.kits_with_pricing k
join public.user_machines um on um.machine_model_id = k.machine_model_id
where k.is_active = true
  and um.user_id = auth.uid()
  and um.status = 'approved';


-- =====================================================================
-- PARTE 6 — ROW LEVEL SECURITY
-- =====================================================================

-- Ativa RLS em todas as tabelas
alter table public.profiles                  enable row level security;
alter table public.machine_models            enable row level security;
alter table public.applications              enable row level security;
alter table public.mechanical_assemblies     enable row level security;
alter table public.user_machines             enable row level security;
alter table public.user_machine_assemblies   enable row level security;
alter table public.user_machine_photos       enable row level security;
alter table public.parts                     enable row level security;
alter table public.part_images               enable row level security;
alter table public.part_machine_compatibility enable row level security;
alter table public.services                  enable row level security;
alter table public.kits                      enable row level security;
alter table public.kit_items                 enable row level security;
alter table public.kit_services              enable row level security;
alter table public.quote_requests            enable row level security;
alter table public.quote_items               enable row level security;
alter table public.contact_messages          enable row level security;


-- 6.1 PROFILES
create policy "profiles_user_view_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_admin_view_all" on public.profiles
  for select using (public.is_admin());
create policy "profiles_user_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_user_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_admin_update_all" on public.profiles
  for update using (public.is_admin());
create policy "profiles_admin_delete" on public.profiles
  for delete using (public.is_admin());


-- 6.2 MACHINE_MODELS / APPLICATIONS / ASSEMBLIES — todos autenticados leem,
-- só admin escreve
create policy "models_read_authenticated" on public.machine_models
  for select using (auth.uid() is not null);
create policy "models_admin_write" on public.machine_models
  for all using (public.is_admin()) with check (public.is_admin());

create policy "apps_read_authenticated" on public.applications
  for select using (auth.uid() is not null);
create policy "apps_admin_write" on public.applications
  for all using (public.is_admin()) with check (public.is_admin());

create policy "assemblies_read_authenticated" on public.mechanical_assemblies
  for select using (auth.uid() is not null);
create policy "assemblies_admin_write" on public.mechanical_assemblies
  for all using (public.is_admin()) with check (public.is_admin());


-- 6.3 USER_MACHINES
create policy "user_machines_user_view_own" on public.user_machines
  for select using (auth.uid() = user_id);
create policy "user_machines_admin_view_all" on public.user_machines
  for select using (public.is_admin());
create policy "user_machines_user_create_own" on public.user_machines
  for insert with check (auth.uid() = user_id);
create policy "user_machines_user_update_own" on public.user_machines
  for update using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id);
create policy "user_machines_admin_update_all" on public.user_machines
  for update using (public.is_admin());
create policy "user_machines_user_delete_pending" on public.user_machines
  for delete using (auth.uid() = user_id and status = 'pending');
create policy "user_machines_admin_delete" on public.user_machines
  for delete using (public.is_admin());


-- 6.4 USER_MACHINE_ASSEMBLIES / PHOTOS
create policy "uma_user_select_own" on public.user_machine_assemblies
  for select using (exists (
    select 1 from public.user_machines um
    where um.id = user_machine_id and um.user_id = auth.uid()
  ));
create policy "uma_admin_select_all" on public.user_machine_assemblies
  for select using (public.is_admin());
create policy "uma_user_insert_own" on public.user_machine_assemblies
  for insert with check (exists (
    select 1 from public.user_machines um
    where um.id = user_machine_id and um.user_id = auth.uid()
  ));
create policy "uma_user_delete_own" on public.user_machine_assemblies
  for delete using (exists (
    select 1 from public.user_machines um
    where um.id = user_machine_id and um.user_id = auth.uid()
  ) or public.is_admin());

create policy "ump_user_select_own" on public.user_machine_photos
  for select using (exists (
    select 1 from public.user_machines um
    where um.id = user_machine_id and um.user_id = auth.uid()
  ));
create policy "ump_admin_select_all" on public.user_machine_photos
  for select using (public.is_admin());
create policy "ump_user_insert_own" on public.user_machine_photos
  for insert with check (exists (
    select 1 from public.user_machines um
    where um.id = user_machine_id and um.user_id = auth.uid()
  ));
create policy "ump_user_delete_own" on public.user_machine_photos
  for delete using (exists (
    select 1 from public.user_machines um
    where um.id = user_machine_id and um.user_id = auth.uid()
  ) or public.is_admin());


-- 6.5 PARTS / PART_IMAGES / COMPATIBILITY
create policy "parts_read_active" on public.parts
  for select using (is_active = true or public.is_admin());
create policy "parts_admin_write" on public.parts
  for all using (public.is_admin()) with check (public.is_admin());

create policy "part_images_read" on public.part_images
  for select using (auth.uid() is not null);
create policy "part_images_admin_write" on public.part_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy "compat_read" on public.part_machine_compatibility
  for select using (auth.uid() is not null);
create policy "compat_admin_write" on public.part_machine_compatibility
  for all using (public.is_admin()) with check (public.is_admin());


-- 6.6 SERVICES / KITS / KIT_ITEMS / KIT_SERVICES
create policy "services_read_active" on public.services
  for select using (is_active = true or public.is_admin());
create policy "services_admin_write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "kits_read_active" on public.kits
  for select using (is_active = true or public.is_admin());
create policy "kits_admin_write" on public.kits
  for all using (public.is_admin()) with check (public.is_admin());

create policy "kit_items_read" on public.kit_items
  for select using (auth.uid() is not null);
create policy "kit_items_admin_write" on public.kit_items
  for all using (public.is_admin()) with check (public.is_admin());

create policy "kit_services_read" on public.kit_services
  for select using (auth.uid() is not null);
create policy "kit_services_admin_write" on public.kit_services
  for all using (public.is_admin()) with check (public.is_admin());


-- 6.7 QUOTE_REQUESTS / QUOTE_ITEMS
create policy "quotes_user_view_own" on public.quote_requests
  for select using (auth.uid() = user_id);
create policy "quotes_admin_view_all" on public.quote_requests
  for select using (public.is_admin());
create policy "quotes_user_create_own" on public.quote_requests
  for insert with check (auth.uid() = user_id);
create policy "quotes_admin_update_all" on public.quote_requests
  for update using (public.is_admin());

create policy "quote_items_user_view_own" on public.quote_items
  for select using (exists (
    select 1 from public.quote_requests qr
    where qr.id = quote_id and qr.user_id = auth.uid()
  ));
create policy "quote_items_admin_view_all" on public.quote_items
  for select using (public.is_admin());
create policy "quote_items_user_create_own" on public.quote_items
  for insert with check (exists (
    select 1 from public.quote_requests qr
    where qr.id = quote_id and qr.user_id = auth.uid()
  ));


-- 6.8 CONTACT_MESSAGES
create policy "contact_anyone_create" on public.contact_messages
  for insert with check (true);
create policy "contact_admin_read" on public.contact_messages
  for select using (public.is_admin());
create policy "contact_admin_update" on public.contact_messages
  for update using (public.is_admin());


-- =====================================================================
-- PARTE 6B — GRANTS (sem isso, "permission denied" antes da RLS rodar)
-- =====================================================================
-- Quando `drop schema public cascade` é executado, perdem-se os GRANTs
-- automáticos do Supabase. RLS só roda DEPOIS de o user passar pelos
-- GRANTs — se faltar GRANT, dá "permission denied" mesmo com RLS aberta.

-- Tabelas: authenticated faz tudo (RLS filtra), anon só lê
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select                          on all tables in schema public to anon;

-- Sequences
grant usage, select on all sequences in schema public to anon, authenticated;

-- Functions
grant execute on all functions in schema public to anon, authenticated;

-- Views (algumas versões não pegam via "ALL TABLES")
grant select on public.user_visible_parts to anon, authenticated;
grant select on public.user_visible_kits  to anon, authenticated;
grant select on public.kits_with_pricing  to anon, authenticated;

-- Default privileges pras próximas tabelas/views/funções criadas
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated;
alter default privileges in schema public grant execute on functions to anon, authenticated;

-- contact_messages: anon precisa inserir (formulário público)
grant insert on public.contact_messages to anon;


-- =====================================================================
-- PARTE 7 — STORAGE BUCKETS + POLÍTICAS
-- =====================================================================

insert into storage.buckets (id, name, public) values
  ('machine-photos',  'machine-photos',  true),
  ('machine-manuals', 'machine-manuals', true),
  ('part-images',     'part-images',     true)
on conflict (id) do nothing;

-- Drop policies de storage se já existirem (caso o script rode de novo)
drop policy if exists "mp_auth_upload"  on storage.objects;
drop policy if exists "mp_public_read"  on storage.objects;
drop policy if exists "mp_owner_delete" on storage.objects;
drop policy if exists "mm_auth_upload"  on storage.objects;
drop policy if exists "mm_public_read"  on storage.objects;
drop policy if exists "mm_owner_delete" on storage.objects;
drop policy if exists "pi_admin_upload" on storage.objects;
drop policy if exists "pi_admin_update" on storage.objects;
drop policy if exists "pi_admin_delete" on storage.objects;
drop policy if exists "pi_public_read"  on storage.objects;

-- machine-photos: qualquer autenticado pode subir, todo mundo pode ver,
-- só o dono ou admin pode apagar
create policy "mp_auth_upload" on storage.objects
  for insert with check (bucket_id = 'machine-photos' and auth.uid() is not null);
create policy "mp_public_read" on storage.objects
  for select using (bucket_id = 'machine-photos');
create policy "mp_owner_delete" on storage.objects
  for delete using (bucket_id = 'machine-photos' and (owner = auth.uid() or public.is_admin()));

-- machine-manuals: igual ao machine-photos
create policy "mm_auth_upload" on storage.objects
  for insert with check (bucket_id = 'machine-manuals' and auth.uid() is not null);
create policy "mm_public_read" on storage.objects
  for select using (bucket_id = 'machine-manuals');
create policy "mm_owner_delete" on storage.objects
  for delete using (bucket_id = 'machine-manuals' and (owner = auth.uid() or public.is_admin()));

-- part-images: só admin sobe, todo mundo vê
create policy "pi_admin_upload" on storage.objects
  for insert with check (bucket_id = 'part-images' and public.is_admin());
create policy "pi_admin_update" on storage.objects
  for update using (bucket_id = 'part-images' and public.is_admin());
create policy "pi_admin_delete" on storage.objects
  for delete using (bucket_id = 'part-images' and public.is_admin());
create policy "pi_public_read" on storage.objects
  for select using (bucket_id = 'part-images');


-- =====================================================================
-- PARTE 8 — DADOS INICIAIS (SEED)
-- =====================================================================

-- 8.1 MODELOS DE MÁQUINAS — base inicial
insert into public.machine_models (brand, model, category) values
  ('Alfa Laval',    'MRPX 418',          'Separadora'),
  ('Alfa Laval',    'MRPX 518',          'Separadora'),
  ('Alfa Laval',    'MRPX 718',          'Separadora'),
  ('Alfa Laval',    'MOPX 207',          'Separadora'),
  ('Alfa Laval',    'MAPX 207',          'Separadora'),
  ('Alfa Laval',    'LOPX 707',          'Separadora'),
  ('Alfa Laval',    'FOPX 611',          'Separadora'),
  ('GEA Westfalia', 'OSA 7',             'Separadora'),
  ('GEA Westfalia', 'OSC 60',            'Separadora'),
  ('GEA Westfalia', 'MSE 200',           'Separadora'),
  ('GEA Westfalia', 'MSE 300',           'Separadora'),
  ('GEA Westfalia', 'SC 50',             'Decanter'),
  ('Tetra Pak',     'Tetra Centri H214', 'Separadora'),
  ('Tetra Pak',     'Tetra Centri C214', 'Clarificadora'),
  ('Seital',        'SE 60',             'Separadora'),
  ('Seital',        'SE 120',            'Separadora'),
  ('Pieralisi',     'FPC 25',            'Decanter');


-- 8.2 APLICAÇÕES
insert into public.applications (name, description, sort_order) values
  ('Laticínios',          'Leite, creme, queijos, soro',                  10),
  ('Cervejaria',          'Recuperação de leveduras, clarificação',       20),
  ('Sumos e bebidas',     'Sucos naturais, néctares, bebidas',            30),
  ('Marinha / Naval',     'Óleo combustível, lubrificante embarcado',     40),
  ('Óleo e gás',          'Refino, derivados, óleo de turbina',           50),
  ('Biocombustíveis',     'Biodiesel, óleos vegetais',                    60),
  ('Farmacêutica',        'BPF/GMP, biopharma',                           70),
  ('Mineração',           'Polpas minerais, efluentes',                   80),
  ('Geração de energia',  'Termelétricas, biomassa, cogeração',           90),
  ('Outra',               'Aplicação diferente / consultar engenharia',  999);


-- 8.3 CONJUNTOS MECÂNICOS
insert into public.mechanical_assemblies (name, description, sort_order, allows_custom) values
  ('Bowl / Rotor',           'Discos, lock ring, distribuidor',     10, false),
  ('Sistema de transmissão', 'Engrenagens, eixos, motor, polias',   20, false),
  ('Mancal e rolamentos',    'Rolamentos superior e inferior',      30, false),
  ('Vedações e gaxetas',     'O-rings, gaxetas, juntas',            40, false),
  ('Sistema de descarga',    'Válvulas, pistões, slide bowl',       50, false),
  ('Painel elétrico',        'Comando, sensores, automação',        60, false),
  ('Outro',                  'Especificar nome customizado',       999, true);


-- =====================================================================
-- PARTE 9 — BLOCO FINAL: PROMOVER admin@separi.com.br A ADMIN
-- =====================================================================
-- Após criar os usuários no Authentication → Add user, rode este bloco
-- separadamente para promover o adm@separi.com.br a admin.
--
-- Cole isso ABAIXO em uma nova query (ou rode em conjunto se o admin já existir):
-- =====================================================================

do $$
begin
  update public.profiles
     set role = 'admin',
         full_name = coalesce(nullif(full_name, ''), 'Administrador Separi'),
         company_name = coalesce(nullif(company_name, ''), 'Separi')
   where email = 'adm@separi.com.br';

  if not found then
    raise notice 'Usuario adm@separi.com.br ainda nao existe. Crie em Authentication > Add user e rode este bloco novamente.';
  else
    raise notice 'Usuario adm@separi.com.br promovido a admin.';
  end if;

  -- Pré-popula o nome do cliente de teste se existir
  update public.profiles
     set full_name = coalesce(nullif(full_name, ''), 'Cliente Teste'),
         company_name = coalesce(nullif(company_name, ''), 'Empresa Teste LTDA'),
         cnpj = coalesce(nullif(cnpj, ''), '00.000.000/0001-00'),
         phone = coalesce(nullif(phone, ''), '(19) 99999-9999')
   where email = 'cliente@teste.com';
end$$;


-- =====================================================================
-- FIM DO SCRIPT
-- =====================================================================
-- Próximos passos:
--   1. Vá em Authentication → Add user (no painel do Supabase)
--   2. Crie:
--        adm@separi.com.br      senha 123456
--        cliente@teste.com      senha 123456
--      Marque "Auto Confirm User" para pular confirmação por email.
--   3. Rode novamente o bloco da PARTE 9 (do "do $$" até o "end$$;").
--   4. Faça login no site com adm@separi.com.br / 123456 — você verá
--      o menu "Painel Administrativo".
-- =====================================================================
