-- =====================================================================
-- SEPARI — FIX GRANTS (corrige "permission denied for view ...")
-- =====================================================================
-- Quando o schema public foi dropado e recriado, os GRANTs automáticos
-- que o Supabase normalmente concede aos roles `anon` e `authenticated`
-- se perderam. Sem GRANT, o Postgres bloqueia o acesso antes mesmo do
-- RLS ser avaliado, gerando o erro:
--    permission denied for view user_visible_parts
--    permission denied for table xxx
--
-- Este script reconcede tudo. Pode ser rodado quantas vezes quiser sem
-- causar problema.
--
-- Cole no SQL Editor → Run.
-- =====================================================================

-- 1. GRANT em todas as tabelas existentes do schema public
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select                          on all tables in schema public to anon;

-- 2. GRANT em todas as sequences (autoincrement, uuid, etc)
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

-- 5. GRANTs explícitos nas VIEWS (algumas vezes "ALL TABLES" não pega views
-- dependendo da versão do Postgres)
grant select on public.user_visible_parts to anon, authenticated;
grant select on public.user_visible_kits  to anon, authenticated;
grant select on public.kits_with_pricing  to anon, authenticated;

-- 6. Garante GRANT específico em tabelas críticas (idempotente)
grant select, insert, update, delete on public.profiles                  to authenticated;
grant select, insert, update, delete on public.user_machines             to authenticated;
grant select, insert, update, delete on public.user_machine_assemblies   to authenticated;
grant select, insert, update, delete on public.user_machine_photos       to authenticated;
grant select, insert, update, delete on public.quote_requests            to authenticated;
grant select, insert, update, delete on public.quote_items               to authenticated;
grant select, insert, update, delete on public.contact_messages          to authenticated;
grant select on public.parts                       to authenticated;
grant select on public.part_images                 to authenticated;
grant select on public.part_machine_compatibility  to authenticated;
grant select on public.services                    to authenticated;
grant select on public.kits                        to authenticated;
grant select on public.kit_items                   to authenticated;
grant select on public.kit_services                to authenticated;
grant select on public.machine_models              to authenticated;
grant select on public.applications                to authenticated;
grant select on public.mechanical_assemblies       to authenticated;

-- 7. Permissões pro anon (não-autenticado) — só leitura no que é público
grant select on public.contact_messages   to anon;
grant insert on public.contact_messages   to anon;

-- 8. Verificação visual
select
  schemaname,
  tablename,
  array_agg(distinct grantee) filter (where grantee in ('anon', 'authenticated')) as roles_com_acesso
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
group by schemaname, tablename
order by tablename;
