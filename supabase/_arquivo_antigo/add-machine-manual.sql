-- =====================================================================
-- SEPARI — Migration: adicionar PDF do manual da máquina
-- Execute este script no SQL Editor do Supabase
-- =====================================================================

-- 1. Coluna manual_url na tabela user_machines
alter table public.user_machines
  add column if not exists manual_url text;

-- 2. Bucket de storage para PDFs de manuais (público para leitura)
insert into storage.buckets (id, name, public)
values ('machine-manuals', 'machine-manuals', true)
on conflict (id) do nothing;

-- 3. Policies: cliente autenticado pode dar upload, todos podem ler
drop policy if exists "auth_upload_machine_manuals" on storage.objects;
create policy "auth_upload_machine_manuals" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'machine-manuals');

drop policy if exists "public_read_machine_manuals" on storage.objects;
create policy "public_read_machine_manuals" on storage.objects
  for select using (bucket_id = 'machine-manuals');

-- 4. Permitir que o dono apague seu próprio upload (caso queira refazer)
drop policy if exists "owner_delete_machine_manuals" on storage.objects;
create policy "owner_delete_machine_manuals" on storage.objects
  for delete to authenticated
  using (bucket_id = 'machine-manuals' and (auth.uid() = owner));

-- =====================================================================
-- Pronto. O front já está preparado pra usar.
-- =====================================================================
