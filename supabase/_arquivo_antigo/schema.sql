-- =====================================================================
-- SEPARI PLATFORM — Schema Supabase Completo
-- Execute este arquivo INTEIRO no SQL Editor do Supabase (apenas 1 vez)
-- =====================================================================

-- Habilitar extensões
create extension if not exists "uuid-ossp";

-- =====================================================================
-- 1. PROFILES (estende auth.users)
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  company_name text,
  cnpj text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger para criar profile automaticamente quando user é criado
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
-- 2. MACHINE_MODELS (catálogo de modelos — admin cadastra)
-- =====================================================================
create table if not exists public.machine_models (
  id uuid primary key default uuid_generate_v4(),
  brand text not null,
  model text not null,
  category text,
  description text,
  created_at timestamptz default now(),
  unique(brand, model)
);

-- Seed inicial com modelos comuns no setor
insert into public.machine_models (brand, model, category) values
  ('Alfa Laval', 'MRPX 418', 'Separadora'),
  ('Alfa Laval', 'MRPX 518', 'Separadora'),
  ('Alfa Laval', 'MRPX 718', 'Separadora'),
  ('GEA Westfalia', 'MSE 200', 'Separadora'),
  ('GEA Westfalia', 'MSE 300', 'Separadora'),
  ('Tetra Pak', 'Tetra Centri H214', 'Separadora'),
  ('Seital', 'SE 60', 'Separadora')
on conflict (brand, model) do nothing;

-- =====================================================================
-- 3. USER_MACHINES (máquinas que o cliente possui — precisa aprovação)
-- =====================================================================
create table if not exists public.user_machines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  machine_model_id uuid not null references public.machine_models(id),
  serial_number text not null,
  photo_url text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_user_machines_user on public.user_machines(user_id);
create index if not exists idx_user_machines_status on public.user_machines(status);

-- =====================================================================
-- 4. PARTS (catálogo de peças)
-- =====================================================================
create table if not exists public.parts (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  description text,
  category text,
  image_url text,
  stock integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_parts_code on public.parts(code);
create index if not exists idx_parts_category on public.parts(category);

-- =====================================================================
-- 5. PART_MACHINE_COMPATIBILITY (relação M:N peças <-> modelos)
-- =====================================================================
create table if not exists public.part_machine_compatibility (
  id uuid primary key default uuid_generate_v4(),
  part_id uuid not null references public.parts(id) on delete cascade,
  machine_model_id uuid not null references public.machine_models(id) on delete cascade,
  created_at timestamptz default now(),
  unique(part_id, machine_model_id)
);

create index if not exists idx_pmc_part on public.part_machine_compatibility(part_id);
create index if not exists idx_pmc_machine on public.part_machine_compatibility(machine_model_id);

-- =====================================================================
-- 6. QUOTE_REQUESTS (pedidos de cotação)
-- =====================================================================
create table if not exists public.quote_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text default 'open' check (status in ('open', 'in_progress', 'answered', 'closed')),
  notes text,
  admin_response text,
  responded_by uuid references public.profiles(id),
  responded_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_quote_user on public.quote_requests(user_id);
create index if not exists idx_quote_status on public.quote_requests(status);

-- =====================================================================
-- 7. QUOTE_ITEMS (itens dentro de um pedido de cotação)
-- =====================================================================
create table if not exists public.quote_items (
  id uuid primary key default uuid_generate_v4(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  part_id uuid not null references public.parts(id),
  user_machine_id uuid references public.user_machines(id),
  quantity integer not null default 1 check (quantity > 0),
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_qi_request on public.quote_items(quote_request_id);

-- =====================================================================
-- 8. STORAGE BUCKETS
-- =====================================================================
-- Bucket para fotos de máquinas dos clientes (público para leitura)
insert into storage.buckets (id, name, public)
values ('machine-photos', 'machine-photos', true)
on conflict (id) do nothing;

-- Bucket para fotos das peças (público para leitura)
insert into storage.buckets (id, name, public)
values ('part-images', 'part-images', true)
on conflict (id) do nothing;

-- =====================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.machine_models enable row level security;
alter table public.user_machines enable row level security;
alter table public.parts enable row level security;
alter table public.part_machine_compatibility enable row level security;
alter table public.quote_requests enable row level security;
alter table public.quote_items enable row level security;

-- Helper: função para checar se usuário é admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ===== PROFILES =====
drop policy if exists "users_view_own_profile" on public.profiles;
create policy "users_view_own_profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "users_update_own_profile" on public.profiles;
create policy "users_update_own_profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "admin_all_profiles" on public.profiles;
create policy "admin_all_profiles" on public.profiles
  for all using (public.is_admin());

-- ===== MACHINE_MODELS (todos leem, só admin escreve) =====
drop policy if exists "anyone_view_models" on public.machine_models;
create policy "anyone_view_models" on public.machine_models
  for select using (true);

drop policy if exists "admin_manage_models" on public.machine_models;
create policy "admin_manage_models" on public.machine_models
  for all using (public.is_admin());

-- ===== USER_MACHINES =====
drop policy if exists "users_view_own_machines" on public.user_machines;
create policy "users_view_own_machines" on public.user_machines
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "users_create_machines" on public.user_machines;
create policy "users_create_machines" on public.user_machines
  for insert with check (auth.uid() = user_id);

drop policy if exists "users_delete_pending_machines" on public.user_machines;
create policy "users_delete_pending_machines" on public.user_machines
  for delete using (auth.uid() = user_id and status = 'pending');

drop policy if exists "admin_update_machines" on public.user_machines;
create policy "admin_update_machines" on public.user_machines
  for update using (public.is_admin());

-- ===== PARTS (todos autenticados leem ativas, só admin escreve) =====
drop policy if exists "authenticated_view_active_parts" on public.parts;
create policy "authenticated_view_active_parts" on public.parts
  for select using (auth.uid() is not null and (is_active = true or public.is_admin()));

drop policy if exists "admin_manage_parts" on public.parts;
create policy "admin_manage_parts" on public.parts
  for all using (public.is_admin());

-- ===== COMPATIBILITY (todos autenticados leem, só admin escreve) =====
drop policy if exists "authenticated_view_compat" on public.part_machine_compatibility;
create policy "authenticated_view_compat" on public.part_machine_compatibility
  for select using (auth.uid() is not null);

drop policy if exists "admin_manage_compat" on public.part_machine_compatibility;
create policy "admin_manage_compat" on public.part_machine_compatibility
  for all using (public.is_admin());

-- ===== QUOTE_REQUESTS =====
drop policy if exists "users_view_own_quotes" on public.quote_requests;
create policy "users_view_own_quotes" on public.quote_requests
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "users_create_quotes" on public.quote_requests;
create policy "users_create_quotes" on public.quote_requests
  for insert with check (auth.uid() = user_id);

drop policy if exists "admin_update_quotes" on public.quote_requests;
create policy "admin_update_quotes" on public.quote_requests
  for update using (public.is_admin());

-- ===== QUOTE_ITEMS =====
drop policy if exists "users_view_own_quote_items" on public.quote_items;
create policy "users_view_own_quote_items" on public.quote_items
  for select using (
    exists (
      select 1 from public.quote_requests
      where quote_requests.id = quote_items.quote_request_id
      and (quote_requests.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "users_create_quote_items" on public.quote_items;
create policy "users_create_quote_items" on public.quote_items
  for insert with check (
    exists (
      select 1 from public.quote_requests
      where quote_requests.id = quote_items.quote_request_id
      and quote_requests.user_id = auth.uid()
    )
  );

-- =====================================================================
-- 10. POLICIES PARA STORAGE
-- =====================================================================
-- Machine photos: usuário autenticado faz upload, todos leem
drop policy if exists "auth_upload_machine_photos" on storage.objects;
create policy "auth_upload_machine_photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'machine-photos');

drop policy if exists "public_read_machine_photos" on storage.objects;
create policy "public_read_machine_photos" on storage.objects
  for select using (bucket_id = 'machine-photos');

-- Part images: apenas admin faz upload, todos leem
drop policy if exists "admin_upload_part_images" on storage.objects;
create policy "admin_upload_part_images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'part-images' and public.is_admin());

drop policy if exists "admin_update_part_images" on storage.objects;
create policy "admin_update_part_images" on storage.objects
  for update to authenticated
  using (bucket_id = 'part-images' and public.is_admin());

drop policy if exists "admin_delete_part_images" on storage.objects;
create policy "admin_delete_part_images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'part-images' and public.is_admin());

drop policy if exists "public_read_part_images" on storage.objects;
create policy "public_read_part_images" on storage.objects
  for select using (bucket_id = 'part-images');

-- =====================================================================
-- 11. VIEW: peças visíveis ao usuário (baseado nas máquinas aprovadas)
-- =====================================================================
create or replace view public.user_visible_parts as
select distinct
  p.*,
  array_agg(distinct mm.brand || ' ' || mm.model) as compatible_with
from public.parts p
inner join public.part_machine_compatibility pmc on pmc.part_id = p.id
inner join public.machine_models mm on mm.id = pmc.machine_model_id
inner join public.user_machines um on um.machine_model_id = mm.id
where p.is_active = true
  and um.status = 'approved'
  and um.user_id = auth.uid()
group by p.id;

grant select on public.user_visible_parts to authenticated;

-- =====================================================================
-- PRONTO! Para criar o primeiro admin, depois de cadastrar pelo site:
-- update public.profiles set role = 'admin' where email = 'seu_email@exemplo.com';
-- =====================================================================
