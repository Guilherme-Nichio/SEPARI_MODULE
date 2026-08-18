/* ============================================================================
   src/lib/stock.js — CAMADA DE DADOS DO ESTOQUE DE MÁQUINAS

   Um único lugar que conhece a tabela `stock_machines`. Tudo que fala com o
   estoque (página pública, página de detalhe, painel do admin) passa por aqui.

   Regra de ouro deste arquivo: NUNCA quebrar a tela. Se a migration ainda não
   foi rodada no Supabase, as funções devolvem `{ data: [], missingTable: true }`
   em vez de estourar — as páginas mostram um aviso e o site continua de pé.
   ========================================================================== */
import { supabase } from './supabase'

export const STOCK_TABLE = 'stock_machines'

/* ── Tipos de máquina (filtro "tipo") ─────────────────────────────────────── */
export const MACHINE_TYPES = [
  'Separadora de discos',
  'Purificador',
  'Clarificador',
  'Decanter',
  'Centrífuga tubular',
  'Bowl / rotor',
  'Outro'
]

/* ── Condição do equipamento ──────────────────────────────────────────────── */
export const CONDITIONS = [
  { value: 'nova',           label: 'Nova' },
  { value: 'seminova',       label: 'Seminova' },
  { value: 'recondicionada', label: 'Recondicionada' },
  { value: 'usada',          label: 'Usada' }
]

export const conditionLabel = (v) =>
  CONDITIONS.find((c) => c.value === v)?.label || 'Recondicionada'

/* ── Situação comercial ───────────────────────────────────────────────────── */
export const STATUSES = [
  { value: 'available', label: 'Disponível' },
  { value: 'reserved',  label: 'Reservada' },
  { value: 'sold',      label: 'Vendida' }
]

export const statusLabel = (v) =>
  STATUSES.find((s) => s.value === v)?.label || 'Disponível'

/* ── Segmentos atendidos (filtro "segmento") ──────────────────────────────────
   Os slugs batem com os de src/data/applications.jsx e com as rotas
   /segmentos/:slug. Mantidos aqui em forma simples para o painel do admin não
   precisar carregar o arquivo grande de conteúdo. */
export const SEGMENT_OPTIONS = [
  { slug: 'laticinios',           label: 'Laticínios' },
  { slug: 'cervejarias',          label: 'Cervejaria' },
  { slug: 'sumos-e-bebidas',      label: 'Sumos e bebidas' },
  { slug: 'marinha-e-naval',      label: 'Marinha e naval' },
  { slug: 'oleos',                label: 'Óleos' },
  { slug: 'farmaceutica',         label: 'Farmacêutica' },
  { slug: 'oleo-e-gas',           label: 'Óleo e gás' },
  { slug: 'mineracao',            label: 'Mineração' },
  { slug: 'geracao-de-energia',   label: 'Geração de energia' },
  { slug: 'fluidos-industriais',  label: 'Fluidos industriais' }
]

export const segmentLabel = (slug) =>
  SEGMENT_OPTIONS.find((s) => s.slug === slug)?.label || slug

/* ── Marcas sugeridas no cadastro (o campo é livre) ───────────────────────── */
export const BRAND_SUGGESTIONS = [
  'Alfa Laval', 'GEA Westfalia', 'Tetra Pak', 'Seital / SPX Flow', 'Mitsubishi',
  'Pieralisi', 'Flottweg', 'Andritz', 'REDA', 'Frautech', 'Haus Centrifuges'
]

/* ── Helpers ──────────────────────────────────────────────────────────────── */

export const slugify = (s = '') =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Monta o slug da URL a partir de marca + modelo (+ sufixo, se precisar). */
export const buildSlug = (brand, model, extra = '') =>
  slugify([brand, model, extra].filter(Boolean).join(' '))

export const fmtMoney = (v) =>
  v == null || v === ''
    ? null
    : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * A tabela ainda não existe no banco?
 * O PostgREST devolve PGRST205/PGRST202, e o Postgres cru, 42P01.
 */
export const isMissingTable = (error) => {
  if (!error) return false
  const code = error.code || ''
  if (code === '42P01' || code === 'PGRST205' || code === 'PGRST202') return true
  const msg = (error.message || '').toLowerCase()
  return msg.includes('stock_machines') &&
    (msg.includes('does not exist') || msg.includes('could not find') || msg.includes('schema cache'))
}

/** Título de exibição de uma máquina. */
export const machineTitle = (m) => `${m?.brand || ''} ${m?.model || ''}`.trim()

/** Lista de fotos: principal + galeria, sem vazios e sem repetição. */
export const machinePhotos = (m) => {
  const all = [m?.image_url, ...(m?.gallery || [])].filter(Boolean)
  return Array.from(new Set(all))
}

/**
 * Chips de especificação que aparecem embaixo do card.
 * Só entra o que estiver preenchido — nada de "—" ocupando espaço.
 */
export const specChips = (m) => {
  const chips = []
  if (m.capacity) chips.push({ label: 'Capacidade', value: m.capacity })
  if (m.rpm)      chips.push({ label: 'Rotação',    value: m.rpm })
  if (m.power)    chips.push({ label: 'Potência',   value: m.power })
  if (m.year)     chips.push({ label: 'Ano',        value: String(m.year) })
  return chips
}

/* ── Consultas ────────────────────────────────────────────────────────────── */

/**
 * Lista as máquinas do estoque.
 * @param {{ includeUnpublished?: boolean }} opts
 * @returns {Promise<{ data: any[], error: any, missingTable: boolean }>}
 */
export async function fetchStockMachines({ includeUnpublished = false } = {}) {
  let query = supabase
    .from(STOCK_TABLE)
    .select('*')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (!includeUnpublished) query = query.eq('published', true)

  const { data, error } = await query

  if (error) {
    const missing = isMissingTable(error)
    if (!missing) console.error('[Separi · estoque]', error)
    return { data: [], error, missingTable: missing }
  }
  return { data: data || [], error: null, missingTable: false }
}

/** Busca uma máquina pelo slug da URL. */
export async function fetchStockMachineBySlug(slug) {
  const { data, error } = await supabase
    .from(STOCK_TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    const missing = isMissingTable(error)
    if (!missing) console.error('[Separi · estoque]', error)
    return { data: null, error, missingTable: missing }
  }
  return { data: data || null, error: null, missingTable: false }
}

/** Máquinas relacionadas: mesmo segmento ou mesma marca, exceto a atual. */
export async function fetchRelatedMachines(machine, limit = 3) {
  if (!machine) return []
  const { data } = await fetchStockMachines()
  const segs = machine.segments || []
  return data
    .filter((m) => m.id !== machine.id && m.status !== 'sold')
    .map((m) => {
      let score = 0
      if (m.brand === machine.brand) score += 2
      if ((m.segments || []).some((s) => segs.includes(s))) score += 3
      if (m.machine_type === machine.machine_type) score += 1
      return { m, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.m)
}

/* ── Escrita (admin) ──────────────────────────────────────────────────────── */

export async function saveStockMachine(payload) {
  if (payload.id) {
    const { id, ...rest } = payload
    return supabase.from(STOCK_TABLE).update(rest).eq('id', id).select().maybeSingle()
  }
  return supabase.from(STOCK_TABLE).insert(payload).select().maybeSingle()
}

export async function deleteStockMachine(id) {
  return supabase.from(STOCK_TABLE).delete().eq('id', id)
}
