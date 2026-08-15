-- =====================================================================
-- SEPARI — FIX: Admin não vê máquinas pendentes
-- Execute este script no SQL Editor do Supabase
-- =====================================================================
-- Problema: a função is_admin() em algumas configurações entra em
-- conflito com as policies dependendo da ordem de avaliação.
-- Solução: separar as policies de "user vê o próprio" e "admin vê tudo"
-- em registros independentes, e tornar is_admin() mais robusta.
-- =====================================================================

-- 1. Recriar a função is_admin() de forma mais robusta
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_role text;
begin
  select role into v_role from public.profiles where id = auth.uid();
  return v_role = 'admin';
exception when others then
  return false;
end;
$$;

-- 2. PROFILES: separar policies por operação
drop policy if exists "users_view_own_profile" on public.profiles;
drop policy if exists "users_update_own_profile" on public.profiles;
drop policy if exists "admin_all_profiles" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_select_admin" on public.profiles
  for select using (public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin());

create policy "profiles_delete_admin" on public.profiles
  for delete using (public.is_admin());

-- 3. USER_MACHINES: o fix principal
drop policy if exists "users_view_own_machines" on public.user_machines;
drop policy if exists "users_create_machines" on public.user_machines;
drop policy if exists "users_delete_pending_machines" on public.user_machines;
drop policy if exists "admin_update_machines" on public.user_machines;

create policy "user_machines_select_own" on public.user_machines
  for select using (auth.uid() = user_id);

create policy "user_machines_select_admin" on public.user_machines
  for select using (public.is_admin());

create policy "user_machines_insert_own" on public.user_machines
  for insert with check (auth.uid() = user_id);

create policy "user_machines_delete_own_pending" on public.user_machines
  for delete using (auth.uid() = user_id and status = 'pending');

create policy "user_machines_delete_admin" on public.user_machines
  for delete using (public.is_admin());

create policy "user_machines_update_admin" on public.user_machines
  for update using (public.is_admin());

-- 4. Garantir que admin lê quote_requests e quote_items
drop policy if exists "users_view_own_quotes" on public.quote_requests;
drop policy if exists "users_create_quotes" on public.quote_requests;
drop policy if exists "admin_update_quotes" on public.quote_requests;

create policy "quote_requests_select_own" on public.quote_requests
  for select using (auth.uid() = user_id);

create policy "quote_requests_select_admin" on public.quote_requests
  for select using (public.is_admin());

create policy "quote_requests_insert_own" on public.quote_requests
  for insert with check (auth.uid() = user_id);

create policy "quote_requests_update_admin" on public.quote_requests
  for update using (public.is_admin());

drop policy if exists "users_view_own_quote_items" on public.quote_items;
drop policy if exists "users_create_quote_items" on public.quote_items;

create policy "quote_items_select_own" on public.quote_items
  for select using (
    exists (
      select 1 from public.quote_requests
      where quote_requests.id = quote_items.quote_request_id
      and quote_requests.user_id = auth.uid()
    )
  );

create policy "quote_items_select_admin" on public.quote_items
  for select using (public.is_admin());

create policy "quote_items_insert_own" on public.quote_items
  for insert with check (
    exists (
      select 1 from public.quote_requests
      where quote_requests.id = quote_items.quote_request_id
      and quote_requests.user_id = auth.uid()
    )
  );

-- 5. Verificação: este SELECT deve retornar suas máquinas pendentes
-- (rode logado como admin via Supabase Auth)
-- select count(*) from public.user_machines where status = 'pending';
