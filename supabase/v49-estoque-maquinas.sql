-- =====================================================================
-- SEPARI v3.14 — ESTOQUE DE MÁQUINAS
-- =====================================================================
-- Cria a tabela que alimenta:
--   • a página pública  /estoque          (catálogo de máquinas)
--   • a página pública  /estoque/:slug    (detalhes do produto)
--   • o painel do admin /admin/estoque    (cadastro/edição)
--
-- Como rodar:
--   Supabase → SQL Editor → New query → cole TUDO → Run
--
-- O script é idempotente: pode rodar várias vezes sem erro.
-- Não apaga nada do que já existe.
-- =====================================================================


-- =====================================================================
-- 1. TABELA
-- =====================================================================
create table if not exists public.stock_machines (
  id                uuid primary key default uuid_generate_v4(),

  -- identificação
  slug              text unique not null,          -- usado na URL /estoque/:slug
  brand             text not null,                 -- Alfa Laval, GEA Westfalia...
  model             text not null,                 -- MOPX 207, OSC 60...
  machine_type      text not null default 'Separadora de discos',
  condition         text not null default 'recondicionada',
  segments          text[] not null default '{}',  -- slugs: laticinios, cervejarias...

  -- ficha técnica rápida (aparece como chips no card e na tabela do detalhe)
  year              int,
  serial_number     text,
  capacity          text,        -- ex: "10.000 L/h"
  power             text,        -- ex: "15 kW / 380V"
  rpm               text,        -- ex: "7.200 rpm"
  weight            text,        -- ex: "1.450 kg"
  material          text,        -- ex: "AISI 316L"
  location          text,        -- ex: "Indaiatuba, SP"

  -- textos
  headline          text,        -- descrição curta que vai embaixo do card
  description       text,        -- descrição longa (página de detalhe)
  usage_conditions  text,        -- condições de uso / operação
  included          text,        -- o que acompanha a máquina
  warranty          text,        -- ex: "12 meses"

  -- listas
  highlights        text[] default '{}',            -- diferenciais em bullets
  specs             jsonb  default '[]'::jsonb,     -- [{"label":"...","value":"..."}]

  -- comercial
  price             numeric(12,2),
  price_visible     boolean default false,
  status            text default 'available'
                    check (status in ('available','reserved','sold')),

  -- publicação
  published         boolean default true,
  featured          boolean default false,
  sort_order        int default 0,

  -- mídia
  image_url         text,
  gallery           text[] default '{}',

  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Colunas novas em bases que já tinham a tabela (idempotente)
alter table public.stock_machines add column if not exists material text;
alter table public.stock_machines add column if not exists warranty text;
alter table public.stock_machines add column if not exists sort_order int default 0;


-- =====================================================================
-- 2. ÍNDICES
-- =====================================================================
create index if not exists idx_stock_brand      on public.stock_machines (brand);
create index if not exists idx_stock_type       on public.stock_machines (machine_type);
create index if not exists idx_stock_published  on public.stock_machines (published);
create index if not exists idx_stock_segments   on public.stock_machines using gin (segments);


-- =====================================================================
-- 3. TRIGGER updated_at
-- =====================================================================
-- A função set_updated_at() já existe desde a v42. Se por algum motivo não
-- existir (base parcial), o bloco abaixo cria.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_stock_machines_updated_at on public.stock_machines;
create trigger trg_stock_machines_updated_at
  before update on public.stock_machines
  for each row execute procedure public.set_updated_at();


-- =====================================================================
-- 4. RLS
-- =====================================================================
-- Leitura pública (site aberto, sem login) só do que está publicado.
-- Escrita: apenas admin, via a função public.is_admin() criada na v42.
alter table public.stock_machines enable row level security;

drop policy if exists "stock_public_read"  on public.stock_machines;
drop policy if exists "stock_admin_read"   on public.stock_machines;
drop policy if exists "stock_admin_write"  on public.stock_machines;

create policy "stock_public_read" on public.stock_machines
  for select using (published = true);

create policy "stock_admin_read" on public.stock_machines
  for select using (public.is_admin());

create policy "stock_admin_write" on public.stock_machines
  for all using (public.is_admin()) with check (public.is_admin());

grant select on public.stock_machines to anon, authenticated;
grant all    on public.stock_machines to authenticated;


-- =====================================================================
-- 5. STORAGE — bucket das fotos do estoque
-- =====================================================================
insert into storage.buckets (id, name, public) values
  ('stock-images', 'stock-images', true)
on conflict (id) do nothing;

drop policy if exists "si_admin_upload" on storage.objects;
drop policy if exists "si_admin_update" on storage.objects;
drop policy if exists "si_admin_delete" on storage.objects;
drop policy if exists "si_public_read"  on storage.objects;

create policy "si_admin_upload" on storage.objects
  for insert with check (bucket_id = 'stock-images' and public.is_admin());
create policy "si_admin_update" on storage.objects
  for update using (bucket_id = 'stock-images' and public.is_admin());
create policy "si_admin_delete" on storage.objects
  for delete using (bucket_id = 'stock-images' and public.is_admin());
create policy "si_public_read" on storage.objects
  for select using (bucket_id = 'stock-images');


-- =====================================================================
-- 6. SEED — 4 máquinas de exemplo
-- =====================================================================
-- Servem para você ver a página funcionando no primeiro acesso.
-- Pode apagar todas pelo painel (/admin/estoque) quando cadastrar as reais.
insert into public.stock_machines
  (slug, brand, model, machine_type, condition, segments, year, capacity, power, rpm,
   location, headline, description, usage_conditions, included, warranty,
   highlights, specs, status, featured, sort_order)
values
(
  'alfa-laval-mopx-207-recondicionada',
  'Alfa Laval', 'MOPX 207', 'Purificador', 'recondicionada',
  '{marinha-e-naval,geracao-de-energia,oleos}', 2016,
  '2.700 L/h', '5,5 kW / 380V', '7.400 rpm', 'Indaiatuba, SP',
  'Purificador de óleo lubrificante e combustível recondicionado, com bowl balanceado e 10 horas de teste contínuo.',
  'Purificador Alfa Laval MOPX 207 recondicionado integralmente na nossa oficina em Indaiatuba. Passou por desmontagem total, inspeção dimensional do bowl, troca de todas as peças críticas de desgaste, balanceamento dinâmico computadorizado e dez horas de teste contínuo em bancada antes da liberação. Equipamento pronto para entrar em operação, indicado para tratamento de óleo lubrificante e combustível em embarcações, geradores e grupos motor-geradores.',
  'Operação contínua com temperatura de alimentação entre 80 °C e 98 °C. Requer água de operação tratada, alimentação estabilizada e rede elétrica trifásica 380V. Intervalo de revisão recomendado: 8.000 horas ou 12 meses, o que ocorrer primeiro.',
  'Máquina completa com bowl, conjunto de discos, motor, painel de comando revisado, jogo de ferramentas de serviço e relatório técnico do recondicionamento.',
  '12 meses',
  '{"Bowl balanceado dinamicamente","10 horas de teste contínuo em bancada","Relatório técnico completo","Peças críticas novas"}',
  '[{"label":"Arquitetura","value":"Separadora de discos"},{"label":"Descarga","value":"Manual"},{"label":"Fases","value":"Duas fases (líquido-líquido)"},{"label":"Conexões","value":"DIN sanitária"},{"label":"Material do bowl","value":"Aço inox duplex"}]'::jsonb,
  'available', true, 10
),
(
  'gea-westfalia-osc-60-seminova',
  'GEA Westfalia', 'OSC 60', 'Clarificador', 'seminova',
  '{cervejarias,sumos-e-bebidas,laticinios}', 2019,
  '12.000 L/h', '18,5 kW / 380V', '6.800 rpm', 'Indaiatuba, SP',
  'Clarificador autolimpante hermético para cervejaria, baixíssima captação de oxigênio e descarga automática.',
  'Clarificador GEA Westfalia OSC 60 seminovo, com poucas horas de operação, ideal para clarificação de cerveja verde, mosto e recuperação de levedura. Projeto hermético com barreira de gás, que mantém a captação de oxigênio em níveis mínimos e preserva aroma e estabilidade do produto. Revisado e testado pela nossa engenharia antes da disponibilização.',
  'Operação em fluxo contínuo com temperatura entre 0 °C e 10 °C para cerveja. Exige CIP após cada campanha de produção e água de operação dentro da especificação do fabricante. Descarga automática programável por ciclos.',
  'Máquina completa com bowl hermético, unidade de água de operação, painel de comando e manual técnico.',
  '6 meses',
  '{"Vedação hermética com barreira de gás","Descarga automática programável","Baixa captação de O₂","Pronta entrega"}',
  '[{"label":"Arquitetura","value":"Separadora de discos"},{"label":"Descarga","value":"Autolimpante"},{"label":"Fases","value":"Clarificação (sólido-líquido)"},{"label":"Controle","value":"Painel PLC"},{"label":"Acabamento","value":"Sanitário AISI 316L"}]'::jsonb,
  'available', true, 20
),
(
  'alfa-laval-mrpx-418-desnatadeira',
  'Alfa Laval', 'MRPX 418 TGV', 'Separadora de discos', 'recondicionada',
  '{laticinios}', 2014,
  '20.000 L/h', '30 kW / 380V', '5.900 rpm', 'Indaiatuba, SP',
  'Desnatadeira autolimpante para laticínios, com padronização de gordura e bowl dentro de tolerância de fábrica.',
  'Desnatadeira Alfa Laval MRPX 418 TGV recondicionada para linha de laticínios. Faz desnate e padronização de gordura com clarificação simultânea. Todos os discos foram inspecionados por trinca e deformação, o lock ring e o distribuidor conferidos dentro da tolerância de fábrica, e o conjunto rotativo balanceado dinamicamente.',
  'Desnate a quente entre 50 °C e 60 °C. Limpeza CIP obrigatória ao fim de cada produção. Alimentação estabilizada e água de operação tratada. Abertura de bowl para inspeção conforme intervalo do fabricante.',
  'Máquina completa com bowl, conjunto de discos inspecionado, transmissão revisada, painel e relatório dimensional.',
  '12 meses',
  '{"Discos inspecionados um a um","Balanceamento dinâmico computadorizado","Padronização de gordura","Projeto sanitário"}',
  '[{"label":"Arquitetura","value":"Separadora de discos"},{"label":"Descarga","value":"Autolimpante"},{"label":"Fases","value":"Três fases (creme, leite, sólidos)"},{"label":"Aplicação","value":"Desnate e padronização"},{"label":"Acabamento","value":"Sanitário AISI 316L"}]'::jsonb,
  'available', false, 30
),
(
  'flottweg-z4e-decanter',
  'Flottweg', 'Z4E', 'Decanter', 'usada',
  '{mineracao,fluidos-industriais,oleo-e-gas}', 2012,
  '15 m³/h', '45 kW / 440V', '3.500 rpm', 'Indaiatuba, SP',
  'Decanter horizontal de duas fases para desidratação de lamas e efluentes com alta carga de sólidos.',
  'Centrífuga decanter Flottweg Z4E, tambor horizontal com rosca transportadora, para desidratação contínua de polpas, lamas minerais e efluentes industriais. Máquina usada, disponível no estado ou com recondicionamento sob orçamento. A rosca e as superfícies de desgaste podem ser recuperadas com revestimento em carbeto de tungstênio conforme a sua aplicação.',
  'Indicada para cargas de até 50% de sólidos em volume. Necessita base nivelada com amortecimento, alimentação por bomba de deslocamento positivo e sistema de polímero quando aplicável. Recomendada inspeção de rosca a cada 4.000 horas em serviço abrasivo.',
  'Máquina no estado, com rosca transportadora, tambor e conjunto de transmissão. Recondicionamento e revestimento antiabrasivo sob orçamento.',
  'Sob consulta',
  '{"Tambor horizontal com rosca","Duas fases sólido-líquido","Opção de revestimento antiabrasivo","Disponível para inspeção na oficina"}',
  '[{"label":"Arquitetura","value":"Decanter (solid bowl)"},{"label":"Descarga","value":"Contínua"},{"label":"Fases","value":"Duas fases"},{"label":"Diferencial","value":"Caixa cicloidal"},{"label":"Teor de sólidos","value":"Até ~50% em volume"}]'::jsonb,
  'available', false, 40
)
on conflict (slug) do nothing;


-- =====================================================================
-- FIM
-- =====================================================================
-- Confira: select slug, brand, model, status from public.stock_machines;
