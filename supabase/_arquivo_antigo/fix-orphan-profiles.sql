-- =====================================================================
-- SEPARI — Recuperar perfis órfãos
--
-- Use este script SE você rodou o cleanup-for-simulation.sql e agora
-- está com erro "user_machines_user_id_fkey" ao cadastrar máquina.
--
-- O cleanup apagou seus profiles mas os usuários no auth.users
-- continuaram existindo. Este script recria os profiles para todos
-- os usuários do auth que estão sem perfil correspondente.
--
-- Execute no SQL Editor do Supabase.
-- =====================================================================

insert into public.profiles (id, email, full_name, company_name, phone, role)
select
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'full_name', ''),
  coalesce(au.raw_user_meta_data->>'company_name', ''),
  coalesce(au.raw_user_meta_data->>'phone', ''),
  'customer'   -- todos viram cliente; mude o seu admin manualmente depois
from auth.users au
where not exists (
  select 1 from public.profiles p where p.id = au.id
);

-- =====================================================================
-- Verificar quantos perfis foram recriados:
-- =====================================================================
-- select count(*) from public.profiles;

-- =====================================================================
-- Se o SEU usuário admin foi recriado como 'customer', promova de volta:
-- (substitua pelo seu email)
-- =====================================================================
-- update public.profiles set role = 'admin'
-- where email = 'seu-email-admin@exemplo.com';
