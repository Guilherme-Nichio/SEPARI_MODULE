-- =====================================================================
-- SEPARI — DIAGNÓSTICO + PROMOVER ADMIN (versão robusta)
-- =====================================================================
-- Use este script SE o bloco da PARTE 9 do v42-reset-completo não funcionou.
--
-- Cole tudo no SQL Editor do Supabase e rode (Run).
-- O resultado vai aparecer na aba "Messages" abaixo, com NOTICES claros
-- dizendo exatamente o que foi feito.
--
-- Pré-requisito: você precisa ter criado os usuários em
-- Authentication → Users → Add user antes de rodar este script.
-- =====================================================================

do $$
declare
  v_admin_user_id   uuid;
  v_client_user_id  uuid;
  v_admin_email     text := 'adm@separi.com.br';
  v_client_email    text := 'cliente@teste.com';
  v_admin_metadata  jsonb;
  v_client_metadata jsonb;
  v_profile_count   int;
begin
  -- ───────────────────────────────────────────────────────────────────
  -- 1. ADMIN
  -- ───────────────────────────────────────────────────────────────────
  raise notice '═══════════════════════════════════════════════════';
  raise notice '  PROMOVENDO ADMIN: %', v_admin_email;
  raise notice '═══════════════════════════════════════════════════';

  -- 1.1 Buscar user em auth.users
  select id, raw_user_meta_data
    into v_admin_user_id, v_admin_metadata
    from auth.users
   where email = v_admin_email
   limit 1;

  if v_admin_user_id is null then
    raise notice 'X  Usuario % NAO EXISTE em auth.users.', v_admin_email;
    raise notice '   Crie em Authentication > Users > Add user antes de rodar este script.';
  else
    raise notice 'OK Usuario encontrado em auth.users (id: %)', v_admin_user_id;

    -- 1.2 Garantir profile (cria se não existir)
    select count(*) into v_profile_count from public.profiles where id = v_admin_user_id;

    if v_profile_count = 0 then
      raise notice '   Profile nao existia, criando...';
      insert into public.profiles (id, email, full_name, company_name, role)
      values (
        v_admin_user_id,
        v_admin_email,
        'Administrador Separi',
        'Separi',
        'admin'
      );
      raise notice 'OK Profile criado como admin';
    else
      -- 1.3 Promover a admin
      update public.profiles
         set role = 'admin',
             full_name = coalesce(nullif(full_name, ''), 'Administrador Separi'),
             company_name = coalesce(nullif(company_name, ''), 'Separi'),
             updated_at = now()
       where id = v_admin_user_id;
      raise notice 'OK Profile atualizado: role = admin';
    end if;
  end if;

  raise notice ' ';

  -- ───────────────────────────────────────────────────────────────────
  -- 2. CLIENTE TESTE
  -- ───────────────────────────────────────────────────────────────────
  raise notice '═══════════════════════════════════════════════════';
  raise notice '  CONFIGURANDO CLIENTE TESTE: %', v_client_email;
  raise notice '═══════════════════════════════════════════════════';

  select id, raw_user_meta_data
    into v_client_user_id, v_client_metadata
    from auth.users
   where email = v_client_email
   limit 1;

  if v_client_user_id is null then
    raise notice '!  Usuario % nao existe em auth.users (opcional).', v_client_email;
    raise notice '   Crie em Authentication > Users > Add user se quiser uma conta de teste.';
  else
    raise notice 'OK Usuario encontrado em auth.users (id: %)', v_client_user_id;

    select count(*) into v_profile_count from public.profiles where id = v_client_user_id;

    if v_profile_count = 0 then
      insert into public.profiles (id, email, full_name, company_name, cnpj, phone, role)
      values (
        v_client_user_id,
        v_client_email,
        'Cliente Teste',
        'Empresa Teste LTDA',
        '00.000.000/0001-00',
        '(19) 99999-9999',
        'customer'
      );
      raise notice 'OK Profile do cliente criado';
    else
      update public.profiles
         set full_name = coalesce(nullif(full_name, ''), 'Cliente Teste'),
             company_name = coalesce(nullif(company_name, ''), 'Empresa Teste LTDA'),
             cnpj = coalesce(nullif(cnpj, ''), '00.000.000/0001-00'),
             phone = coalesce(nullif(phone, ''), '(19) 99999-9999'),
             role = 'customer',
             updated_at = now()
       where id = v_client_user_id;
      raise notice 'OK Profile do cliente atualizado';
    end if;
  end if;

  raise notice ' ';
  raise notice '═══════════════════════════════════════════════════';
  raise notice '  RESUMO FINAL';
  raise notice '═══════════════════════════════════════════════════';
end$$;

-- Verificação visual ao final
select
  p.email,
  p.full_name,
  p.company_name,
  p.role,
  p.created_at
from public.profiles p
where p.email in ('adm@separi.com.br', 'cliente@teste.com')
order by p.role desc, p.email;
