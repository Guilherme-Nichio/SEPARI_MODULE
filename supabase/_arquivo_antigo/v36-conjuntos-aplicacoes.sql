-- =====================================================================
-- SEPARI v3.6 — Conjuntos Mecânicos, Aplicações e perfil estendido
-- Execute este script no SQL Editor do Supabase
-- =====================================================================

-- =====================================================================
-- 1. NOVAS TABELAS
-- =====================================================================

-- Aplicações / Segmentos da máquina (Leite, Soro, Óleo, etc.)
create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Conjuntos mecânicos da máquina (Carcaça, Motor, Tambor, etc.)
create table if not exists public.mechanical_assemblies (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  is_active boolean default true,
  allows_custom boolean default false,   -- se true, cliente pode digitar nome próprio (OUTROS A DEFINIR)
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Junction: máquina do cliente <-> conjuntos selecionados
create table if not exists public.user_machine_assemblies (
  id uuid primary key default uuid_generate_v4(),
  user_machine_id uuid not null references public.user_machines(id) on delete cascade,
  assembly_id uuid not null references public.mechanical_assemblies(id) on delete cascade,
  custom_name text,    -- preenchido só quando assembly.allows_custom = true
  created_at timestamptz default now(),
  unique (user_machine_id, assembly_id, custom_name)
);

create index if not exists idx_uma_machine on public.user_machine_assemblies(user_machine_id);
create index if not exists idx_uma_assembly on public.user_machine_assemblies(assembly_id);

-- =====================================================================
-- 2. ALTERAÇÕES EM TABELAS EXISTENTES
-- =====================================================================

-- user_machines: aplicação
alter table public.user_machines
  add column if not exists application_id uuid references public.applications(id),
  add column if not exists application_custom text;

-- parts: agora cada peça pertence a um conjunto mecânico
alter table public.parts
  add column if not exists assembly_id uuid references public.mechanical_assemblies(id);

create index if not exists idx_parts_assembly on public.parts(assembly_id);

-- profiles: campos adicionais
alter table public.profiles
  add column if not exists position text,           -- cargo (ex: Engenheiro de Manutenção)
  add column if not exists segment text,            -- segmento (ex: Laticínios)
  add column if not exists address text,            -- rua, número, complemento
  add column if not exists neighborhood text,       -- bairro
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists postal_code text,        -- CEP
  add column if not exists secondary_phone text,
  add column if not exists notes text;              -- observações

-- =====================================================================
-- 3. RLS — qualquer autenticado lê, só admin escreve
-- =====================================================================

alter table public.applications enable row level security;
alter table public.mechanical_assemblies enable row level security;
alter table public.user_machine_assemblies enable row level security;

-- applications
drop policy if exists "applications_read" on public.applications;
create policy "applications_read" on public.applications
  for select to authenticated using (true);

drop policy if exists "applications_admin_write" on public.applications;
create policy "applications_admin_write" on public.applications
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- mechanical_assemblies
drop policy if exists "assemblies_read" on public.mechanical_assemblies;
create policy "assemblies_read" on public.mechanical_assemblies
  for select to authenticated using (true);

drop policy if exists "assemblies_admin_write" on public.mechanical_assemblies;
create policy "assemblies_admin_write" on public.mechanical_assemblies
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- user_machine_assemblies — cliente lê o próprio, admin lê tudo
drop policy if exists "uma_select_own" on public.user_machine_assemblies;
create policy "uma_select_own" on public.user_machine_assemblies
  for select to authenticated
  using (
    exists (
      select 1 from public.user_machines um
      where um.id = user_machine_id and (um.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "uma_insert_own" on public.user_machine_assemblies;
create policy "uma_insert_own" on public.user_machine_assemblies
  for insert to authenticated
  with check (
    exists (
      select 1 from public.user_machines um
      where um.id = user_machine_id and um.user_id = auth.uid()
    )
  );

drop policy if exists "uma_delete_own_or_admin" on public.user_machine_assemblies;
create policy "uma_delete_own_or_admin" on public.user_machine_assemblies
  for delete to authenticated
  using (
    exists (
      select 1 from public.user_machines um
      where um.id = user_machine_id and (um.user_id = auth.uid() or public.is_admin())
    )
  );

-- =====================================================================
-- 4. SEED DATA — Conjuntos mecânicos solicitados
-- =====================================================================

insert into public.mechanical_assemblies (name, allows_custom, sort_order) values
  ('CARCAÇA COMPLETA', false, 10),
  ('MOTOR ELÉTRICO', false, 20),
  ('TRANSMISSÃO VERTICAL', false, 30),
  ('COLETOR COMPLETO', false, 40),
  ('CAPUZ COMPLETO', false, 50),
  ('TAMBOR COMPLETO', false, 60),
  ('JOGO DE RODETES', false, 70),
  ('ABLAYTER', false, 80),
  ('TUBULAÇÃO', false, 90),
  ('ÁGUA DE COMANDO', false, 100),
  ('PAINEL ELÉTRICO', false, 110),
  ('PERIFÉRICOS', false, 120),
  ('KIT COMPLETO MANUTENÇÃO PREVENTIVA', false, 130),
  ('KIT INTERMEDIÁRIO MANUTENÇÃO PREVENTIVA', false, 140),
  ('OUTROS A DEFINIR', true, 999)
on conflict (name) do nothing;

-- Aplicações iniciais (admin pode adicionar/remover mais depois)
insert into public.applications (name, sort_order) values
  ('Leite', 10),
  ('Soro', 20),
  ('Creme', 30),
  ('Sumo / Suco', 40),
  ('Vinho', 50),
  ('Cerveja', 60),
  ('Óleo', 70),
  ('Biodiesel', 80),
  ('Sangue', 90),
  ('Fluidos Industriais', 100),
  ('Outros', 999)
on conflict (name) do nothing;

-- =====================================================================
-- 5. ATUALIZA A VIEW user_visible_parts (se existir) para incluir assembly_id
-- =====================================================================
-- Drop e recria para garantir as novas colunas
drop view if exists public.user_visible_parts;

create or replace view public.user_visible_parts as
select
  p.*,
  ma.name as assembly_name,
  (
    select array_agg(distinct mm.brand || ' ' || mm.model)
    from public.part_machine_compatibility pmc
    join public.machine_models mm on mm.id = pmc.machine_model_id
    where pmc.part_id = p.id
  ) as compatible_with
from public.parts p
left join public.mechanical_assemblies ma on ma.id = p.assembly_id
where p.is_active = true
  and exists (
    -- Cliente vê peça se TEM máquina aprovada compatível
    select 1 from public.user_machines um
    join public.part_machine_compatibility pmc on pmc.machine_model_id = um.machine_model_id
    where um.user_id = auth.uid()
      and um.status = 'approved'
      and pmc.part_id = p.id
  );

-- Admin precisa ler tudo
drop policy if exists "parts_admin_read_all" on public.parts;
create policy "parts_admin_read_all" on public.parts
  for select to authenticated using (public.is_admin());

-- =====================================================================
-- Pronto. Front já está preparado pra usar.
-- =====================================================================
