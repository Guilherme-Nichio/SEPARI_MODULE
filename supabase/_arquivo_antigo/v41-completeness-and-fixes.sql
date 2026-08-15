-- =====================================================================
-- SEPARI v3.11 / Migration v41 — Cadastro completo + correções de pontas soltas
-- Execute este script INTEIRO no SQL Editor do Supabase.
-- Idempotente: pode rodar quantas vezes quiser.
-- Pré-requisitos: schema.sql, v36, v38, v40 já executados.
-- =====================================================================

-- =====================================================================
-- 1. PROFILES — garantir TODAS as colunas que o front-end espera
--    (Perfil.jsx grava esses campos; sem isso, o save silenciosamente falha)
-- =====================================================================

alter table public.profiles
  add column if not exists cnpj              text,
  add column if not exists secondary_phone   text,
  add column if not exists position          text,
  add column if not exists segment           text,
  add column if not exists address           text,
  add column if not exists neighborhood      text,
  add column if not exists city              text,
  add column if not exists state             text,
  add column if not exists postal_code       text,
  add column if not exists notes             text,
  add column if not exists newsletter_opt_in boolean default false;

create index if not exists idx_profiles_cnpj on public.profiles(cnpj);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_company on public.profiles(company_name);

-- =====================================================================
-- 2. TRIGGER handle_new_user — incluir CNPJ que vinha sendo perdido
-- =====================================================================

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
-- 3. Trigger updated_at em profiles (não existia)
-- =====================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- =====================================================================
-- 4. RLS — política de INSERT em profiles
--    O AuthContext faz fallback de inserção quando o trigger não rodou.
--    Sem essa política, RLS bloqueia.
-- =====================================================================

drop policy if exists "users_insert_own_profile" on public.profiles;
create policy "users_insert_own_profile" on public.profiles
  for insert with check (auth.uid() = id);

-- =====================================================================
-- 5. BUCKET de manuais (MaquinaNova.jsx faz upload aqui — não estava no schema)
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('machine-manuals', 'machine-manuals', true)
on conflict (id) do nothing;

drop policy if exists "auth_upload_manuals" on storage.objects;
create policy "auth_upload_manuals" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'machine-manuals');

drop policy if exists "public_read_manuals" on storage.objects;
create policy "public_read_manuals" on storage.objects
  for select using (bucket_id = 'machine-manuals');

-- =====================================================================
-- 6. RLS — Admin pode ver/responder TODAS as cotações
--    + Admin SELECT garantido em todas as tabelas relacionadas a usuários
-- =====================================================================

drop policy if exists "admin_view_all_quotes" on public.quote_requests;
create policy "admin_view_all_quotes" on public.quote_requests
  for select using (public.is_admin());

drop policy if exists "admin_view_all_quote_items" on public.quote_items;
create policy "admin_view_all_quote_items" on public.quote_items
  for select using (public.is_admin());

-- Admin pode ver TODAS as máquinas (necessário para a aba Usuários do admin)
drop policy if exists "admin_view_all_machines" on public.user_machines;
create policy "admin_view_all_machines" on public.user_machines
  for select using (public.is_admin());

-- Admin pode UPDATE máquinas (aprovar/rejeitar)
drop policy if exists "admin_update_all_machines" on public.user_machines;
create policy "admin_update_all_machines" on public.user_machines
  for update using (public.is_admin());

-- Admin pode DELETE perfis (botão excluir usuário)
drop policy if exists "admin_delete_profiles" on public.profiles;
create policy "admin_delete_profiles" on public.profiles
  for delete using (public.is_admin());

-- =====================================================================
-- 7. CONTACT_MESSAGES — formulário de contato público
-- =====================================================================

create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  company text,
  segment text,
  subject text,
  message text not null,
  source text default 'website',
  status text default 'new' check (status in ('new','reading','answered','closed')),
  created_at timestamptz default now()
);

create index if not exists idx_contact_status on public.contact_messages(status);
create index if not exists idx_contact_created on public.contact_messages(created_at desc);

alter table public.contact_messages enable row level security;

drop policy if exists "anyone_can_create_contact" on public.contact_messages;
create policy "anyone_can_create_contact" on public.contact_messages
  for insert with check (true);

drop policy if exists "admin_read_contact" on public.contact_messages;
create policy "admin_read_contact" on public.contact_messages
  for select using (public.is_admin());

drop policy if exists "admin_update_contact" on public.contact_messages;
create policy "admin_update_contact" on public.contact_messages
  for update using (public.is_admin());

-- =====================================================================
-- 8. SEED de aplicações comuns (caso ainda não existam)
-- =====================================================================

insert into public.applications (name, sort_order, is_active)
values
  ('Laticínios — Leite Integral', 10, true),
  ('Laticínios — Soro de Queijo', 11, true),
  ('Laticínios — Creme', 12, true),
  ('Cervejaria — Mosto', 20, true),
  ('Cervejaria — Cerveja Final', 21, true),
  ('Sumos e Bebidas', 30, true),
  ('Marinha — Combustível', 40, true),
  ('Marinha — Óleo Lubrificante', 41, true),
  ('Biodiesel', 50, true),
  ('Farmacêutico', 60, true),
  ('Fluidos Industriais', 70, true),
  ('Óleo & Gás', 80, true)
on conflict (name) do nothing;

-- =====================================================================
-- 9. STORAGE — Reforçar políticas dos buckets de fotos
-- =====================================================================

-- machine-photos: autenticados podem fazer upload, qualquer um pode ler
-- (URLs são "não-listáveis" — só quem tem o link consegue acessar)
insert into storage.buckets (id, name, public)
values ('machine-photos', 'machine-photos', true)
on conflict (id) do nothing;

drop policy if exists "auth_upload_machine_photos" on storage.objects;
create policy "auth_upload_machine_photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'machine-photos');

drop policy if exists "public_read_machine_photos" on storage.objects;
create policy "public_read_machine_photos" on storage.objects
  for select using (bucket_id = 'machine-photos');

-- Usuários podem deletar arquivos próprios
drop policy if exists "users_delete_own_photos" on storage.objects;
create policy "users_delete_own_photos" on storage.objects
  for delete to authenticated
  using (bucket_id in ('machine-photos','machine-manuals') and owner = auth.uid());

-- Admin pode deletar qualquer arquivo
drop policy if exists "admin_delete_any_storage" on storage.objects;
create policy "admin_delete_any_storage" on storage.objects
  for delete to authenticated
  using (bucket_id in ('machine-photos','machine-manuals','part-images') and public.is_admin());

-- =====================================================================
-- 10. SEGURANÇA — Sanidade RLS em tabelas críticas
-- =====================================================================

-- Garante que cada tabela sensível tem RLS habilitado
alter table public.profiles            enable row level security;
alter table public.user_machines       enable row level security;
alter table public.quote_requests      enable row level security;
alter table public.quote_items         enable row level security;

-- Bloqueia leitura pública das profiles (defesa em profundidade —
-- a política users_view_own_profile já filtra, mas é bom garantir)
drop policy if exists "public_no_read_profiles" on public.profiles;
-- Não criamos uma política pública pra public — sem política = bloqueado por default

-- =====================================================================
-- PRONTO. O cadastro agora salva CNPJ e o Perfil grava todos os campos.
-- Para criar um admin:
--   update public.profiles set role = 'admin' where email = 'seu@email.com';
-- =====================================================================
