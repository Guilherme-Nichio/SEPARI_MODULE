-- =====================================================================
-- SEPARI v3.10 / Migration v40 — Serviços + Múltiplas fotos
-- Execute este script INTEIRO no SQL Editor do Supabase
-- É 100% idempotente — pode rodar de novo sem quebrar nada.
-- =====================================================================

-- =====================================================================
-- 1. SERVICES — catálogo de serviços do administrador
-- =====================================================================

create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  description text,
  category text,                          -- categoria livre: "Manutenção", "Balanceamento", etc.
  duration_hours numeric(6,2) default 0,  -- horas estimadas (informativo)
  price numeric(12,2) default 0 check (price >= 0),
  price_visible boolean default true,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_services_code on public.services(code);
create index if not exists idx_services_active on public.services(is_active);

comment on table public.services is 'Serviços oferecidos (manutenção, balanceamento, instalação, etc) que podem ser vendidos avulsos ou dentro de um kit.';

-- =====================================================================
-- 2. KIT_SERVICES — serviços inclusos em cada kit
-- =====================================================================

create table if not exists public.kit_services (
  id uuid primary key default uuid_generate_v4(),
  kit_id uuid not null references public.kits(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique (kit_id, service_id)
);

create index if not exists idx_kit_services_kit on public.kit_services(kit_id);
create index if not exists idx_kit_services_service on public.kit_services(service_id);


-- =====================================================================
-- 3. PART_IMAGES — múltiplas fotos por peça
-- =====================================================================

create table if not exists public.part_images (
  id uuid primary key default uuid_generate_v4(),
  part_id uuid not null references public.parts(id) on delete cascade,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_part_images_part on public.part_images(part_id);


-- =====================================================================
-- 4. USER_MACHINE_PHOTOS — múltiplas fotos da máquina do cliente
-- =====================================================================

create table if not exists public.user_machine_photos (
  id uuid primary key default uuid_generate_v4(),
  user_machine_id uuid not null references public.user_machines(id) on delete cascade,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_user_machine_photos_machine on public.user_machine_photos(user_machine_id);


-- =====================================================================
-- 5. ATUALIZA view kits_with_pricing → soma também serviços
-- =====================================================================

drop view if exists public.user_visible_kits cascade;
drop view if exists public.kits_with_pricing cascade;

create view public.kits_with_pricing as
with parts_sum as (
  select
    ki.kit_id,
    coalesce(sum(p.price * ki.quantity), 0) as parts_subtotal,
    count(*) as part_count
  from public.kit_items ki
  join public.parts p on p.id = ki.part_id
  group by ki.kit_id
),
services_sum as (
  select
    ks.kit_id,
    coalesce(sum(s.price * ks.quantity), 0) as services_subtotal,
    count(*) as service_count
  from public.kit_services ks
  join public.services s on s.id = ks.service_id
  group by ks.kit_id
)
select
  k.*,
  coalesce(ps.parts_subtotal, 0) as parts_subtotal,
  coalesce(ss.services_subtotal, 0) as services_subtotal,
  coalesce(ps.parts_subtotal, 0) + coalesce(ss.services_subtotal, 0) as base_price,
  coalesce(ps.part_count, 0) as item_count,
  coalesce(ss.service_count, 0) as service_count,
  case
    when k.price_adjustment_type = 'percent' then
      round((coalesce(ps.parts_subtotal, 0) + coalesce(ss.services_subtotal, 0)) * (1 + k.price_adjustment_value / 100.0), 2)
    else
      coalesce(ps.parts_subtotal, 0) + coalesce(ss.services_subtotal, 0) + k.price_adjustment_value
  end as final_price,
  mm.brand as machine_brand,
  mm.model as machine_model,
  ma.name as assembly_name
from public.kits k
left join parts_sum ps on ps.kit_id = k.id
left join services_sum ss on ss.kit_id = k.id
left join public.machine_models mm on mm.id = k.machine_model_id
left join public.mechanical_assemblies ma on ma.id = k.assembly_id;

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
-- 6. RLS — Services + relacionados
-- =====================================================================

alter table public.services enable row level security;
alter table public.kit_services enable row level security;
alter table public.part_images enable row level security;
alter table public.user_machine_photos enable row level security;

-- SERVICES: autenticado lê ativos, admin escreve tudo
drop policy if exists "services_read_active" on public.services;
create policy "services_read_active" on public.services
  for select to authenticated
  using (is_active = true or public.is_admin());

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- KIT_SERVICES
drop policy if exists "kit_services_read" on public.kit_services;
create policy "kit_services_read" on public.kit_services
  for select to authenticated
  using (
    exists (
      select 1 from public.kits k
      where k.id = kit_services.kit_id
        and (k.is_active = true or public.is_admin())
    )
  );

drop policy if exists "kit_services_admin_write" on public.kit_services;
create policy "kit_services_admin_write" on public.kit_services
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- PART_IMAGES: leitura aberta para autenticados, escrita admin
drop policy if exists "part_images_read" on public.part_images;
create policy "part_images_read" on public.part_images
  for select to authenticated
  using (true);

drop policy if exists "part_images_admin_write" on public.part_images;
create policy "part_images_admin_write" on public.part_images
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- USER_MACHINE_PHOTOS: dono lê/escreve, admin lê tudo
drop policy if exists "ump_owner_read" on public.user_machine_photos;
create policy "ump_owner_read" on public.user_machine_photos
  for select to authenticated
  using (
    exists (
      select 1 from public.user_machines um
      where um.id = user_machine_photos.user_machine_id
        and (um.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "ump_owner_write" on public.user_machine_photos;
create policy "ump_owner_write" on public.user_machine_photos
  for insert to authenticated
  with check (
    exists (
      select 1 from public.user_machines um
      where um.id = user_machine_photos.user_machine_id
        and um.user_id = auth.uid()
    )
  );

drop policy if exists "ump_owner_delete" on public.user_machine_photos;
create policy "ump_owner_delete" on public.user_machine_photos
  for delete to authenticated
  using (
    exists (
      select 1 from public.user_machines um
      where um.id = user_machine_photos.user_machine_id
        and (um.user_id = auth.uid() or public.is_admin())
    )
  );


-- =====================================================================
-- 7. UPDATED_AT trigger
-- =====================================================================

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
  before update on public.services
  for each row execute procedure public.set_updated_at();


-- =====================================================================
-- 8. QUOTE_ITEMS — suportar serviços avulsos também
-- =====================================================================

alter table public.quote_items
  add column if not exists service_id uuid references public.services(id) on delete restrict;

create index if not exists idx_qi_service on public.quote_items(service_id);

-- Atualiza constraint XOR: agora é peça OU kit OU serviço
alter table public.quote_items
  drop constraint if exists quote_items_part_xor_kit;

alter table public.quote_items
  drop constraint if exists quote_items_kind_xor;

alter table public.quote_items
  add constraint quote_items_kind_xor check (
    (part_id is not null and kit_id is null and service_id is null) or
    (part_id is null and kit_id is not null and service_id is null) or
    (part_id is null and kit_id is null and service_id is not null)
  );


-- =====================================================================
-- 9. SEED DEMONSTRATIVO (opcional) — alguns serviços iniciais
-- =====================================================================

insert into public.services (code, name, description, category, duration_hours, price, price_visible)
values
  ('SRV-MNT-PRV', 'Manutenção Preventiva', 'Inspeção completa, troca de vedações, lubrificação e teste operacional.', 'Manutenção', 8, 0, true),
  ('SRV-BAL-DIN', 'Balanceamento Dinâmico', 'Balanceamento de bowl e eixo em bancada dinâmica.', 'Balanceamento', 6, 0, true),
  ('SRV-INST', 'Instalação e Comissionamento', 'Montagem em campo, alinhamento e startup assistido.', 'Instalação', 12, 0, true),
  ('SRV-EMG-24H', 'Atendimento Emergencial 24h', 'Equipe técnica em campo em até 24h para falhas críticas.', 'Emergência', 24, 0, false)
on conflict (code) do nothing;


-- =====================================================================
-- PRONTO. Próximos passos:
--   1. Cadastre serviços no /admin/servicos
--   2. Vincule serviços aos kits no /admin/kits
-- =====================================================================
