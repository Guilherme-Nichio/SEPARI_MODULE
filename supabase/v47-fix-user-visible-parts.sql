-- =====================================================================
-- SEPARI — FIX user_visible_parts (visibilidade correta + compatible_with)
-- =====================================================================
-- A view antiga tinha dois problemas:
--   1. Filtro via JOIN podia retornar peças do usuário errado em alguns
--      casos
--   2. Não retornava o campo `compatible_with` que o frontend (Pecas.jsx)
--      espera para filtrar por máquina específica
--
-- Esta versão usa EXISTS explícito + subquery para `compatible_with`,
-- garantindo que cada peça só apareça se o user CORRENTE tiver alguma
-- máquina compatível aprovada.
-- =====================================================================

drop view if exists public.user_visible_parts cascade;

create view public.user_visible_parts
with (security_invoker = true) as
select
  p.id,
  p.code,
  p.name,
  p.description,
  p.category,
  p.image_url,
  p.assembly_id,
  p.price,
  p.price_visible,
  p.is_active,
  p.stock,
  ma.name as assembly_name,
  -- Array com labels "Marca Modelo" das máquinas APROVADAS DO USER
  -- que são compatíveis com esta peça. Usado pelo frontend pra filtrar
  -- por máquina específica.
  (
    select array_agg(distinct mm.brand || ' ' || mm.model)
    from public.part_machine_compatibility pmc
    join public.machine_models mm on mm.id = pmc.machine_model_id
    join public.user_machines um
      on um.machine_model_id = pmc.machine_model_id
     and um.user_id = auth.uid()
     and um.status = 'approved'
    where pmc.part_id = p.id
  ) as compatible_with
from public.parts p
left join public.mechanical_assemblies ma on ma.id = p.assembly_id
where p.is_active = true
  and exists (
    -- Filtro principal: só peças com compatibilidade DECLARADA com alguma
    -- máquina APROVADA do user corrente
    select 1
    from public.part_machine_compatibility pmc
    join public.user_machines um
      on um.machine_model_id = pmc.machine_model_id
     and um.user_id = auth.uid()
     and um.status = 'approved'
    where pmc.part_id = p.id
  );

-- GRANT pra view ser acessível pelos roles do PostgREST
grant select on public.user_visible_parts to anon, authenticated;

-- Força reload do cache do PostgREST
notify pgrst, 'reload schema';

-- ════════════════════════════════════════════════════════════════════
-- Verificação rápida — execute as duas queries abaixo (uma por vez) para
-- confirmar que está funcionando.
-- ════════════════════════════════════════════════════════════════════

-- 1. Quantas peças TOTAIS existem no banco (sem filtro)
select 'Total de peças no banco' as info, count(*) as qtd
from public.parts where is_active = true
union all
-- 2. Quantas peças seriam visíveis ao usuário admin/atual
select 'Peças visíveis para auth.uid()' as info, count(*) as qtd
from public.user_visible_parts;

-- 3. Detalhe das peças e seus compatibles para conferência
select
  p.code,
  p.name,
  p.compatible_with,
  p.assembly_name
from public.user_visible_parts p
order by p.code;
