-- =====================================================================
-- SEPARI — v48 SECURITY HARDENING
-- =====================================================================
-- Cole TUDO no SQL Editor do Supabase → Run.
--
-- O QUE ESTE PATCH RESOLVE:
--
-- 1. ESCALONAMENTO DE PRIVILÉGIO (crítico)
--    A policy "profiles_user_update_own" permitia UPDATE no próprio
--    profile SEM `with check`. Como `authenticated` tem GRANT UPDATE em
--    todas as tabelas, um cliente comum podia rodar:
--        update profiles set role = 'admin' where id = auth.uid();
--    e virar admin sozinho. Este patch instala um TRIGGER que impede
--    qualquer não-admin de alterar `role`, `id` ou `email` do próprio
--    perfil — independentemente de RLS ou de grants de coluna.
--
-- 2. Reforça o `with check` na policy de update do usuário.
--
-- Idempotente: pode ser rodado quantas vezes quiser.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Trigger anti-escalonamento em public.profiles
-- ---------------------------------------------------------------------
create or replace function public.guard_profile_protected_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Contexto confiável: SQL Editor / service_role / backend (sem JWT de
  -- usuário, auth.uid() = NULL) ou um admin já existente. Libera.
  -- O ataque que importa é o cliente logado pela API (role 'authenticated',
  -- auth.uid() preenchido), que continua bloqueado abaixo.
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  -- Não-admin: id é imutável
  if new.id is distinct from old.id then
    raise exception 'Alteração de id não permitida';
  end if;

  -- Não-admin: NÃO pode mudar a própria role (anti-escalonamento)
  if new.role is distinct from old.role then
    raise exception 'Alteração de role não permitida';
  end if;

  -- Não-admin: email é gerenciado pelo Supabase Auth, não pela tabela
  if new.email is distinct from old.email then
    raise exception 'Alteração de email deve ser feita pelo fluxo de autenticação';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_profile_columns on public.profiles;
create trigger trg_guard_profile_columns
  before update on public.profiles
  for each row execute procedure public.guard_profile_protected_columns();

-- ---------------------------------------------------------------------
-- 2) Reforça a policy de update do usuário com WITH CHECK
--    (defesa em profundidade — o trigger acima já garante o principal)
-- ---------------------------------------------------------------------
drop policy if exists "profiles_user_update_own" on public.profiles;
create policy "profiles_user_update_own" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------
-- 3) Verificação rápida
-- ---------------------------------------------------------------------
-- Liste os triggers ativos em profiles:
select tgname as trigger_name
from pg_trigger
where tgrelid = 'public.profiles'::regclass
  and not tgisinternal;
