-- =====================================================================
-- SEPARI — FIX GRANTS v2 (corrigido o nome da coluna na verificação)
-- =====================================================================
-- Cole TUDO no SQL Editor → Run.
-- =====================================================================

-- 1. GRANT em todas as tabelas existentes do schema public
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select                          on all tables in schema public to anon;

-- 2. GRANT em todas as sequences
grant usage, select on all sequences in schema public to anon, authenticated;

-- 3. GRANT em todas as functions
grant execute on all functions in schema public to anon, authenticated;

-- 4. DEFAULT PRIVILEGES — vale pras próximas tabelas/views/funções criadas
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
alter default privileges in schema public
  grant execute on functions to anon, authenticated;

-- 5. GRANTs explícitos nas VIEWS (algumas vezes "ALL TABLES" não pega views)
grant select on public.user_visible_parts to anon, authenticated;
grant select on public.user_visible_kits  to anon, authenticated;
grant select on public.kits_with_pricing  to anon, authenticated;

-- 6. anon precisa inserir em contact_messages (formulário público)
grant insert on public.contact_messages to anon;

-- 7. VERIFICAÇÃO — nome correto das colunas é `table_schema` e `table_name`
select
  table_schema,
  table_name,
  string_agg(distinct grantee, ', ') filter (where grantee in ('anon', 'authenticated')) as roles_com_acesso,
  string_agg(distinct privilege_type, ', ') as permissoes
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
group by table_schema, table_name
order by table_name;
