-- =====================================================================
-- SEPARI — Limpeza para Simulação (versão segura)
--
-- Apaga TODOS os dados transacionais (máquinas, cotações, usuários
-- não-admin). MANTÉM seu admin + catálogo.
--
-- ⚠️ ESTA OPERAÇÃO É IRREVERSÍVEL. Execute no SQL Editor do Supabase.
-- =====================================================================

-- 1. Apagar cotações e itens
delete from public.quote_items;
delete from public.quote_requests;

-- 2. Apagar conjuntos selecionados pelos clientes nas máquinas
delete from public.user_machine_assemblies;

-- 3. Apagar máquinas dos clientes
delete from public.user_machines;

-- 4. Apagar usuários não-admin de AMBOS: auth.users E profiles
--    Apagar de auth.users primeiro faz o profile cair em cascata.
--    Se você não tem permissão pra mexer em auth.users via SQL,
--    veja o modo alternativo no final deste arquivo.
delete from auth.users
where id in (
  select id from public.profiles where role != 'admin'
);

-- Caso algum profile fique órfão (cenário raro), limpa também
delete from public.profiles where role != 'admin';

-- =====================================================================
-- ✅ Pronto. Seu admin continua. Catálogo (peças, modelos, conjuntos,
-- aplicações) continua. Pode logar como admin e fazer nova simulação.
-- =====================================================================

-- =====================================================================
-- OPCIONAL: descomente abaixo para também apagar:
-- =====================================================================

-- Apagar TODAS as peças do catálogo (precisará recadastrar):
-- delete from public.part_machine_compatibility;
-- delete from public.parts;

-- Apagar TODOS os modelos de máquina:
-- delete from public.machine_models;

-- Resetar conjuntos e aplicações para o seed do v36:
-- delete from public.mechanical_assemblies;
-- delete from public.applications;
-- -- depois re-rode o seed do v36-conjuntos-aplicacoes.sql

-- =====================================================================
-- MODO ALTERNATIVO (se sua role não puder mexer em auth.users via SQL):
-- =====================================================================
-- 1. Comente o "delete from auth.users" acima
-- 2. Rode este arquivo
-- 3. Vá em Supabase → Authentication → Users
-- 4. Selecione manualmente os usuários não-admin e apague
--
-- Se você JÁ rodou a versão antiga (que só apagava profiles e quebrou
-- a FK ao cadastrar máquina), use o arquivo `fix-orphan-profiles.sql`
-- pra recuperar os profiles antes.

-- =====================================================================
-- Arquivos no Storage (fotos / manuais): limpe manualmente no painel
-- Supabase → Storage → bucket → selecionar tudo → Delete
-- =====================================================================
