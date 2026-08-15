import { useEffect, useMemo, useState } from 'react'
import {
  Plus, Edit, Trash2, Save, X, Package, Upload, Image as ImageIcon,
  Star, Eye, EyeOff, ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { uploadFile } from '../../lib/supabase'
import {
  fetchStockMachines, saveStockMachine, deleteStockMachine,
  MACHINE_TYPES, CONDITIONS, STATUSES, SEGMENT_OPTIONS, BRAND_SUGGESTIONS,
  buildSlug, conditionLabel, statusLabel, segmentLabel, machineTitle
} from '../../lib/stock'

/* ============================================================================
   /admin/estoque — CADASTRO DAS MÁQUINAS DO ESTOQUE

   O que é cadastrado aqui aparece em /estoque (catálogo público) e em
   /estoque/:slug (página de detalhe do produto).

   Segue o mesmo padrão visual dos outros CRUDs do painel (AdminModels,
   AdminParts): formulário embutido no topo + tabela embaixo.
   ========================================================================== */

const EMPTY = {
  id: null,
  slug: '',
  brand: '',
  model: '',
  machine_type: 'Separadora de discos',
  condition: 'recondicionada',
  segments: [],
  year: '',
  serial_number: '',
  capacity: '',
  power: '',
  rpm: '',
  weight: '',
  material: '',
  location: 'Indaiatuba, SP',
  headline: '',
  description: '',
  usage_conditions: '',
  included: '',
  warranty: '',
  highlights: [],
  specs: [],
  price: '',
  price_visible: false,
  status: 'available',
  published: true,
  featured: false,
  sort_order: 0,
  image_url: '',
  gallery: []
}

export default function AdminStock() {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [missingTable, setMissingTable] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filtro, setFiltro] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data, missingTable } = await fetchStockMachines({ includeUnpublished: true })
    setMachines(data)
    setMissingTable(missingTable)
    setLoading(false)
  }

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const openNew = () => { setForm(EMPTY); setFormOpen(true) }

  const openEdit = (m) => {
    setForm({
      ...EMPTY,
      ...m,
      year: m.year ?? '',
      price: m.price ?? '',
      segments: m.segments || [],
      highlights: m.highlights || [],
      gallery: m.gallery || [],
      specs: Array.isArray(m.specs) ? m.specs : []
    })
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }

  /* ── segmentos (multi) ── */
  const toggleSegment = (slug) => {
    const atual = form.segments || []
    set({ segments: atual.includes(slug) ? atual.filter((s) => s !== slug) : [...atual, slug] })
  }

  /* ── especificações extras ── */
  const addSpec = () => set({ specs: [...(form.specs || []), { label: '', value: '' }] })
  const setSpec = (i, patch) => {
    const next = [...(form.specs || [])]
    next[i] = { ...next[i], ...patch }
    set({ specs: next })
  }
  const removeSpec = (i) => set({ specs: (form.specs || []).filter((_, k) => k !== i) })

  /* ── upload de imagem ── */
  const handleUpload = async (file, alvo) => {
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadFile('stock-images', file, 'estoque/')
      if (alvo === 'main') set({ image_url: url })
      else set({ gallery: [...(form.gallery || []), url] })
      toast.success('Imagem enviada!')
    } catch (e) {
      toast.error(e.message || 'Falha no upload')
    }
    setUploading(false)
  }

  const removeGalleryItem = (url) =>
    set({ gallery: (form.gallery || []).filter((g) => g !== url) })

  /* ── salvar ── */
  const save = async () => {
    if (!form.brand.trim() || !form.model.trim()) {
      return toast.error('Marca e modelo são obrigatórios')
    }

    const slug = (form.slug || '').trim() || buildSlug(form.brand, form.model, form.condition)

    // slug único: se já existir em outra máquina, acrescenta um sufixo
    const conflito = machines.find((m) => m.slug === slug && m.id !== form.id)
    const slugFinal = conflito ? `${slug}-${Date.now().toString(36).slice(-4)}` : slug

    const payload = {
      ...(form.id ? { id: form.id } : {}),
      slug: slugFinal,
      brand: form.brand.trim(),
      model: form.model.trim(),
      machine_type: form.machine_type,
      condition: form.condition,
      segments: form.segments || [],
      year: form.year === '' ? null : Number(form.year),
      serial_number: form.serial_number?.trim() || null,
      capacity: form.capacity?.trim() || null,
      power: form.power?.trim() || null,
      rpm: form.rpm?.trim() || null,
      weight: form.weight?.trim() || null,
      material: form.material?.trim() || null,
      location: form.location?.trim() || null,
      headline: form.headline?.trim() || null,
      description: form.description?.trim() || null,
      usage_conditions: form.usage_conditions?.trim() || null,
      included: form.included?.trim() || null,
      warranty: form.warranty?.trim() || null,
      highlights: (form.highlights || []).filter(Boolean),
      specs: (form.specs || []).filter((s) => s.label?.trim() && s.value?.trim()),
      price: form.price === '' ? null : Number(form.price),
      price_visible: !!form.price_visible,
      status: form.status,
      published: !!form.published,
      featured: !!form.featured,
      sort_order: Number(form.sort_order) || 0,
      image_url: form.image_url?.trim() || null,
      gallery: (form.gallery || []).filter(Boolean)
    }

    setSaving(true)
    const { error } = await saveStockMachine(payload)
    setSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(form.id ? 'Máquina atualizada!' : 'Máquina cadastrada!')
    closeForm()
    load()
  }

  const remove = async (m) => {
    if (!confirm(`Excluir ${machineTitle(m)} do estoque? Esta ação não pode ser desfeita.`)) return
    const { error } = await deleteStockMachine(m.id)
    if (error) toast.error('Erro ao excluir: ' + error.message)
    else { toast.success('Máquina excluída'); load() }
  }

  const togglePublished = async (m) => {
    const { error } = await saveStockMachine({ id: m.id, published: !m.published })
    if (error) toast.error(error.message)
    else load()
  }

  const lista = useMemo(() => {
    const q = filtro.trim().toLowerCase()
    if (!q) return machines
    return machines.filter((m) =>
      `${m.brand} ${m.model} ${m.machine_type}`.toLowerCase().includes(q)
    )
  }, [machines, filtro])

  /* ── tabela ainda não existe ── */
  if (missingTable) {
    return (
      <div className="notice-card" style={{ marginTop: 20 }}>
        <div className="notice-card-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
          <Package size={30} />
        </div>
        <h2>Tabela do estoque não encontrada</h2>
        <p>
          O módulo de estoque precisa da tabela <code>stock_machines</code>. Abra o Supabase,
          vá em <strong>SQL Editor → New query</strong>, cole o conteúdo do arquivo{' '}
          <code>supabase/v49-estoque-maquinas.sql</code> que veio no projeto e clique em Run.
          Depois recarregue esta página.
        </p>
        <button className="btn btn-primary" onClick={load} style={{ marginTop: 16 }}>
          Verificar de novo
        </button>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <p style={{ color: 'var(--text-light)', margin: 0 }}>
          {machines.length} máquina{machines.length !== 1 && 's'} no estoque
          {' · '}
          <Link to="/estoque" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
            ver página pública <ExternalLink size={12} style={{ verticalAlign: -1 }} />
          </Link>
        </p>
        {!formOpen && (
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={16} /> Nova Máquina
          </button>
        )}
      </div>

      {/* ───────────────────── FORMULÁRIO ───────────────────── */}
      {formOpen && (
        <div className="inline-form-card">
          <div className="inline-form-card-head">
            <h3>{form.id ? 'Editar Máquina' : 'Nova Máquina do Estoque'}</h3>
            <button onClick={closeForm} disabled={saving} className="btn btn-ghost btn-xs" style={{ padding: 6 }} title="Cancelar">
              <X size={18} />
            </button>
          </div>

          {/* IDENTIFICAÇÃO */}
          <h4 style={secTitle}>Identificação</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Marca <span className="required">*</span></label>
              <input
                className="form-input" list="marcas-sugeridas" value={form.brand}
                onChange={(e) => set({ brand: e.target.value })} placeholder="Ex: Alfa Laval"
              />
              <datalist id="marcas-sugeridas">
                {BRAND_SUGGESTIONS.map((b) => <option key={b} value={b} />)}
              </datalist>
            </div>
            <div className="form-group">
              <label>Modelo <span className="required">*</span></label>
              <input
                className="form-input" value={form.model}
                onChange={(e) => set({ model: e.target.value })} placeholder="Ex: MOPX 207"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de máquina</label>
              <select className="form-input" value={form.machine_type} onChange={(e) => set({ machine_type: e.target.value })}>
                {MACHINE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Condição</label>
              <select className="form-input" value={form.condition} onChange={(e) => set({ condition: e.target.value })}>
                {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Segmentos atendidos</label>
            <div style={chipsWrap}>
              {SEGMENT_OPTIONS.map((s) => {
                const on = (form.segments || []).includes(s.slug)
                return (
                  <button
                    key={s.slug} type="button" onClick={() => toggleSegment(s.slug)}
                    className={`btn btn-xs ${on ? 'btn-primary' : 'btn-outline'}`}
                    style={{ borderRadius: 999 }}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
            <small style={hint}>Usado no filtro "Segmento" da página de estoque e na página de cada setor.</small>
          </div>

          {/* FICHA TÉCNICA */}
          <h4 style={secTitle}>Ficha técnica</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Ano</label>
              <input className="form-input" type="number" value={form.year} onChange={(e) => set({ year: e.target.value })} placeholder="2018" />
            </div>
            <div className="form-group">
              <label>Capacidade</label>
              <input className="form-input" value={form.capacity} onChange={(e) => set({ capacity: e.target.value })} placeholder="10.000 L/h" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Rotação</label>
              <input className="form-input" value={form.rpm} onChange={(e) => set({ rpm: e.target.value })} placeholder="7.200 rpm" />
            </div>
            <div className="form-group">
              <label>Potência</label>
              <input className="form-input" value={form.power} onChange={(e) => set({ power: e.target.value })} placeholder="15 kW / 380V" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Peso</label>
              <input className="form-input" value={form.weight} onChange={(e) => set({ weight: e.target.value })} placeholder="1.450 kg" />
            </div>
            <div className="form-group">
              <label>Material</label>
              <input className="form-input" value={form.material} onChange={(e) => set({ material: e.target.value })} placeholder="AISI 316L" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nº de série</label>
              <input className="form-input" value={form.serial_number} onChange={(e) => set({ serial_number: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Localização</label>
              <input className="form-input" value={form.location} onChange={(e) => set({ location: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Garantia</label>
            <input className="form-input" value={form.warranty} onChange={(e) => set({ warranty: e.target.value })} placeholder="12 meses" />
          </div>

          {/* ESPECIFICAÇÕES EXTRAS */}
          <div className="form-group">
            <label>Especificações extras</label>
            {(form.specs || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  className="form-input" style={{ flex: 1 }} value={s.label || ''}
                  onChange={(e) => setSpec(i, { label: e.target.value })} placeholder="Rótulo (ex: Descarga)"
                />
                <input
                  className="form-input" style={{ flex: 2 }} value={s.value || ''}
                  onChange={(e) => setSpec(i, { value: e.target.value })} placeholder="Valor (ex: Autolimpante)"
                />
                <button type="button" className="btn btn-ghost btn-xs" onClick={() => removeSpec(i)} style={{ color: 'var(--danger)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-xs" onClick={addSpec}>
              <Plus size={14} /> Adicionar especificação
            </button>
            <small style={hint}>Aparecem na tabela "Ficha técnica" da página de detalhe.</small>
          </div>

          {/* TEXTOS */}
          <h4 style={secTitle}>Textos</h4>
          <div className="form-group">
            <label>Descrição curta (aparece no card)</label>
            <textarea
              className="form-textarea" rows={2} value={form.headline}
              onChange={(e) => set({ headline: e.target.value })}
              placeholder="Uma linha objetiva com o principal diferencial da máquina."
            />
          </div>
          <div className="form-group">
            <label>Descrição completa</label>
            <textarea
              className="form-textarea" rows={5} value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="O que foi feito na máquina, para que serve, estado geral…"
            />
          </div>
          <div className="form-group">
            <label>Condições de uso</label>
            <textarea
              className="form-textarea" rows={4} value={form.usage_conditions}
              onChange={(e) => set({ usage_conditions: e.target.value })}
              placeholder="Temperatura de operação, exigências de instalação, intervalo de revisão…"
            />
          </div>
          <div className="form-group">
            <label>O que acompanha</label>
            <textarea
              className="form-textarea" rows={3} value={form.included}
              onChange={(e) => set({ included: e.target.value })}
              placeholder="Bowl, painel, ferramentas, relatório técnico…"
            />
          </div>
          <div className="form-group">
            <label>Diferenciais (um por linha)</label>
            <textarea
              className="form-textarea" rows={4}
              value={(form.highlights || []).join('\n')}
              onChange={(e) => set({ highlights: e.target.value.split('\n') })}
              placeholder={'Bowl balanceado dinamicamente\n10 horas de teste contínuo\nGarantia de 12 meses'}
            />
          </div>

          {/* IMAGENS */}
          <h4 style={secTitle}>Imagens</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Foto principal (URL)</label>
              <input
                className="form-input" value={form.image_url}
                onChange={(e) => set({ image_url: e.target.value })}
                placeholder="/media/estoque/minha-maquina.jpg ou https://…"
              />
              <label className="btn btn-outline btn-xs" style={{ marginTop: 8, cursor: 'pointer', display: 'inline-flex' }}>
                <Upload size={14} /> {uploading ? 'Enviando…' : 'Enviar arquivo'}
                <input
                  type="file" accept="image/*" hidden disabled={uploading}
                  onChange={(e) => handleUpload(e.target.files?.[0], 'main')}
                />
              </label>
            </div>
            <div className="form-group">
              <label>Pré-visualização</label>
              <div style={preview}>
                {form.image_url
                  ? <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ImageIcon size={26} color="#9aa5a0" />}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Galeria (fotos adicionais)</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
              {(form.gallery || []).map((g) => (
                <div key={g} style={{ ...preview, width: 96, height: 72, position: 'relative' }}>
                  <img src={g} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button" onClick={() => removeGalleryItem(g)}
                    style={removeBtn} title="Remover"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <label className="btn btn-outline btn-xs" style={{ cursor: 'pointer', display: 'inline-flex' }}>
              <Upload size={14} /> {uploading ? 'Enviando…' : 'Adicionar foto à galeria'}
              <input
                type="file" accept="image/*" hidden disabled={uploading}
                onChange={(e) => handleUpload(e.target.files?.[0], 'gallery')}
              />
            </label>
          </div>

          {/* COMERCIAL */}
          <h4 style={secTitle}>Comercial e publicação</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Preço (R$)</label>
              <input
                className="form-input" type="number" step="0.01" value={form.price}
                onChange={(e) => set({ price: e.target.value })} placeholder="0,00"
              />
            </div>
            <div className="form-group">
              <label>Situação</label>
              <select className="form-input" value={form.status} onChange={(e) => set({ status: e.target.value })}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ordem de exibição</label>
              <input
                className="form-input" type="number" value={form.sort_order}
                onChange={(e) => set({ sort_order: e.target.value })}
              />
              <small style={hint}>Menor número aparece primeiro.</small>
            </div>
            <div className="form-group">
              <label>Endereço da página (slug)</label>
              <input
                className="form-input" value={form.slug}
                onChange={(e) => set({ slug: e.target.value })}
                placeholder={buildSlug(form.brand, form.model, form.condition) || 'gerado automaticamente'}
              />
              <small style={hint}>Deixe vazio para gerar a partir de marca + modelo.</small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', margin: '4px 0 8px' }}>
            <label style={check}>
              <input type="checkbox" checked={!!form.price_visible} onChange={(e) => set({ price_visible: e.target.checked })} />
              Mostrar preço no site
            </label>
            <label style={check}>
              <input type="checkbox" checked={!!form.published} onChange={(e) => set({ published: e.target.checked })} />
              Publicada (visível no site)
            </label>
            <label style={check}>
              <input type="checkbox" checked={!!form.featured} onChange={(e) => set({ featured: e.target.checked })} />
              Destaque (aparece primeiro)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 18, borderTop: '1px solid var(--gray-200)' }}>
            <button className="btn btn-ghost btn-sm" onClick={closeForm} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? <><span className="loader sm" /> Salvando…</> : <><Save size={16} /> Salvar Máquina</>}
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────── LISTA ───────────────────── */}
      {!formOpen && machines.length > 0 && (
        <div className="form-group" style={{ maxWidth: 380, marginBottom: 14 }}>
          <input
            className="form-input" value={filtro} placeholder="Buscar por marca, modelo ou tipo…"
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : machines.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={48} /></div>
          <h3>Nenhuma máquina no estoque</h3>
          <p>Cadastre a primeira máquina para o catálogo aparecer no site.</p>
          {!formOpen && (
            <button className="btn btn-primary" onClick={openNew} style={{ marginTop: 16 }}>
              <Plus size={16} /> Adicionar Máquina
            </button>
          )}
        </div>
      ) : (
        <div className="panel">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Foto</th>
                  <th>Máquina</th>
                  <th>Tipo</th>
                  <th>Condição</th>
                  <th>Segmentos</th>
                  <th>Situação</th>
                  <th style={{ width: 150 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((m) => (
                  <tr key={m.id} style={{ opacity: m.published ? 1 : 0.55 }}>
                    <td>
                      <div style={thumb}>
                        {m.image_url
                          ? <img src={m.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <ImageIcon size={16} color="#9aa5a0" />}
                      </div>
                    </td>
                    <td>
                      <strong>{m.brand}</strong> {m.model}
                      {m.featured && <Star size={13} style={{ marginLeft: 6, verticalAlign: -2, color: '#f59e0b' }} />}
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/estoque/{m.slug}</div>
                    </td>
                    <td style={{ color: 'var(--text-light)' }}>{m.machine_type}</td>
                    <td style={{ color: 'var(--text-light)' }}>{conditionLabel(m.condition)}</td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                      {(m.segments || []).map(segmentLabel).join(', ') || '-'}
                    </td>
                    <td>
                      <span className={`badge ${m.status === 'available' ? 'badge-success' : 'badge-neutral'}`}>
                        {statusLabel(m.status)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => togglePublished(m)} title={m.published ? 'Despublicar' : 'Publicar'}>
                          {m.published ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => openEdit(m)} title="Editar">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => remove(m)} title="Excluir" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

/* ── estilos locais, no mesmo espírito dos outros CRUDs do painel ── */
const secTitle = {
  fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'var(--text-muted)', margin: '26px 0 12px', paddingTop: 18,
  borderTop: '1px solid var(--gray-200)'
}
const hint = { display: 'block', marginTop: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }
const chipsWrap = { display: 'flex', flexWrap: 'wrap', gap: 8 }
const check = { display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', cursor: 'pointer' }
const preview = {
  width: 140, height: 100, borderRadius: 10, overflow: 'hidden', background: 'var(--gray-100, #f3f4f6)',
  border: '1px solid var(--gray-200, #e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const thumb = {
  width: 46, height: 36, borderRadius: 7, overflow: 'hidden', background: 'var(--gray-100, #f3f4f6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const removeBtn = {
  position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%',
  border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
}
