import { useEffect, useMemo, useState } from 'react'
import {
  Plus, Edit, Trash2, Package, Search, Camera, X, Save, Eye, EyeOff, Info,
  Image as ImageIcon, Star
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase, uploadFile } from '../../lib/supabase'

const EMPTY = {
  id: null,
  code: '',
  name: '',
  description: '',
  category: '',
  stock: 0,
  price: 0,
  price_visible: true,
  is_active: true,
  image_url: '',
  imageFile: null,
  imagePreview: '',
  extraImages: [],
  assembly_id: '',
  compatibleIds: []
}

const fmtMoney = (v) => v == null ? ',' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function AdminParts() {
  const [parts, setParts] = useState([])
  const [models, setModels] = useState([])
  const [assemblies, setAssemblies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterAssembly, setFilterAssembly] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)

    // 1) tenta primeiro com part_images (se existir tabela do v40)
    let partsData = null
    let firstAttempt = await supabase
      .from('parts')
      .select('*, compat:part_machine_compatibility(machine_model_id), assembly:assembly_id(id, name), images:part_images(id, image_url, sort_order)')
      .order('created_at', { ascending: false })

    if (firstAttempt.error) {
      // fallback: sem part_images (migração v40 não rodada ainda)
      const fallback = await supabase
        .from('parts')
        .select('*, compat:part_machine_compatibility(machine_model_id), assembly:assembly_id(id, name)')
        .order('created_at', { ascending: false })
      if (fallback.error) {
        toast.error('Erro ao carregar peças: ' + fallback.error.message)
        partsData = []
      } else {
        partsData = (fallback.data || []).map(p => ({ ...p, images: [] }))
      }
    } else {
      partsData = firstAttempt.data || []
    }

    const [{ data: modelsData }, { data: assembliesData }] = await Promise.all([
      supabase.from('machine_models').select('*').order('brand', { ascending: true }),
      supabase.from('mechanical_assemblies').select('*').eq('is_active', true).order('sort_order')
    ])
    setParts(partsData)
    setModels(modelsData || [])
    setAssemblies(assembliesData || [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    return parts.filter(p => {
      if (filterAssembly !== 'all' && p.assembly_id !== filterAssembly) return false
      if (search) {
        const s = search.toLowerCase()
        if (!`${p.code} ${p.name} ${p.category || ''}`.toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [parts, search, filterAssembly])

  const openNew = () => {
    setForm(EMPTY)
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 200, behavior: 'smooth' }), 100)
  }

  const openEdit = (p) => {
    const extras = (p.images || [])
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map(img => ({ id: img.id, image_url: img.image_url, isNew: false, _toDelete: false }))

    setForm({
      ...p,
      price: p.price ?? 0,
      price_visible: p.price_visible ?? true,
      imageFile: null,
      imagePreview: p.image_url || '',
      extraImages: extras,
      compatibleIds: (p.compat || []).map(c => c.machine_model_id)
    })
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 200, behavior: 'smooth' }), 100)
  }

  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }

  const onImage = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) return toast.error('Máximo 5MB por imagem')
    const r = new FileReader()
    r.onload = () => setForm(prev => ({ ...prev, imageFile: f, imagePreview: r.result }))
    r.readAsDataURL(f)
  }

  const onMultiImages = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const accepted = []
    for (const f of files) {
      if (f.size > 5 * 1024 * 1024) { toast.error(`"${f.name}" passou de 5MB.`); continue }
      if (!f.type.startsWith('image/')) { toast.error(`"${f.name}" não é imagem.`); continue }
      accepted.push(f)
    }
    accepted.forEach(f => {
      const reader = new FileReader()
      reader.onload = () => {
        setForm(prev => ({
          ...prev,
          extraImages: [...prev.extraImages, {
            id: null, image_url: '', isNew: true, file: f,
            preview: reader.result, _toDelete: false
          }]
        }))
      }
      reader.readAsDataURL(f)
    })
    e.target.value = ''
  }

  const removeExtra = (idx) => {
    setForm(prev => {
      const next = [...prev.extraImages]
      const img = next[idx]
      if (img.isNew) next.splice(idx, 1)
      else next[idx] = { ...img, _toDelete: true }
      return { ...prev, extraImages: next }
    })
  }

  const makeCover = (idx) => {
    setForm(prev => {
      const img = prev.extraImages[idx]
      if (!img || img._toDelete) return prev
      const newExtras = [...prev.extraImages]
      newExtras.splice(idx, 1)

      // Move atual capa pra galeria, se houver
      if (prev.imagePreview) {
        if (prev.imageFile) {
          newExtras.unshift({
            id: null, image_url: '', isNew: true,
            file: prev.imageFile, preview: prev.imagePreview, _toDelete: false
          })
        } else {
          newExtras.unshift({
            id: null, image_url: prev.imagePreview, isNew: true,
            file: null, preview: prev.imagePreview, _toDelete: false
          })
        }
      }

      return {
        ...prev,
        imageFile: img.file || null,
        imagePreview: img.preview || img.image_url || '',
        image_url: img.isNew ? '' : (img.image_url || ''),
        extraImages: newExtras
      }
    })
  }

  const toggleCompat = (modelId) => {
    setForm(f => ({
      ...f,
      compatibleIds: f.compatibleIds.includes(modelId)
        ? f.compatibleIds.filter(id => id !== modelId)
        : [...f.compatibleIds, modelId]
    }))
  }

  const save = async () => {
    if (!form.code.trim() || !form.name.trim()) return toast.error('Código e nome são obrigatórios')
    if (!form.assembly_id) return toast.error('Selecione o conjunto mecânico ao qual a peça pertence')
    if (form.price < 0) return toast.error('Preço não pode ser negativo')
    setSaving(true)
    try {
      let image_url = form.image_url
      if (form.imageFile) {
        const { url } = await uploadFile('part-images', form.imageFile, 'parts/')
        image_url = url
      } else if (form.imagePreview && !form.image_url) {
        image_url = form.imagePreview
      }

      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description?.trim() || null,
        category: form.category?.trim() || null,
        stock: Number(form.stock) || 0,
        price: Number(form.price) || 0,
        price_visible: !!form.price_visible,
        is_active: !!form.is_active,
        image_url,
        assembly_id: form.assembly_id,
        updated_at: new Date().toISOString()
      }

      let partId = form.id
      if (partId) {
        const { error } = await supabase.from('parts').update(payload).eq('id', partId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('parts').insert(payload).select().single()
        if (error) throw error
        partId = data.id
      }

      await supabase.from('part_machine_compatibility').delete().eq('part_id', partId)
      if (form.compatibleIds.length > 0) {
        const rows = form.compatibleIds.map(machine_model_id => ({ part_id: partId, machine_model_id }))
        const { error: compatErr } = await supabase.from('part_machine_compatibility').insert(rows)
        if (compatErr) throw compatErr
      }

      // Imagens adicionais (silenciosamente ignora se tabela part_images não existe, v40 não rodado)
      try {
        const toDelete = form.extraImages.filter(i => !i.isNew && i._toDelete && i.id)
        if (toDelete.length > 0) {
          const { error: delErr } = await supabase.from('part_images').delete().in('id', toDelete.map(i => i.id))
          if (delErr && !/schema cache|does not exist/i.test(delErr.message)) throw delErr
        }
        const toInsert = form.extraImages.filter(i => i.isNew && !i._toDelete)
        const newRows = []
        let order = form.extraImages.filter(i => !i.isNew && !i._toDelete).length
        for (const img of toInsert) {
          let url = img.image_url
          if (img.file) {
            const { url: newUrl } = await uploadFile('part-images', img.file, 'parts/')
            url = newUrl
          }
          if (url) newRows.push({ part_id: partId, image_url: url, sort_order: order++ })
        }
        if (newRows.length > 0) {
          const { error: imgErr } = await supabase.from('part_images').insert(newRows)
          if (imgErr) {
            if (/schema cache|does not exist/i.test(imgErr.message)) {
              toast('Múltiplas fotos exigem rodar a migração v40 no Supabase.', { icon: 'ℹ️', duration: 4000 })
            } else {
              throw imgErr
            }
          }
        }
      } catch (err) {
        if (!/schema cache|does not exist/i.test(err?.message || '')) throw err
      }

      toast.success(form.id ? 'Peça atualizada!' : 'Peça criada!')
      closeForm()
      load()
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar')
    }
    setSaving(false)
  }

  const remove = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta peça?\n\nAtenção: se ela estiver em algum kit, será necessário remover de lá antes.')) return
    const { error } = await supabase.from('parts').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir: ' + error.message)
    else { toast.success('Peça excluída'); load() }
  }

  const visibleExtras = form.extraImages.filter(i => !i._toDelete)

  return (
    <>
      <div className="panel-header" style={{
        background: 'var(--white)',
        padding: '16px 20px',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--gray-200)',
        marginBottom: 16,
        gap: 12
      }}>
        <div className="search-bar" style={{ margin: 0, flex: 1, maxWidth: 360 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por código, nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          value={filterAssembly}
          onChange={(e) => setFilterAssembly(e.target.value)}
          style={{ maxWidth: 280, padding: '10px 14px' }}
        >
          <option value="all">Todos os conjuntos</option>
          {assemblies.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        {!formOpen && (
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={16} /> Nova Peça
          </button>
        )}
      </div>

      {formOpen && (
        <div className="inline-form-card">
          <div className="inline-form-card-head">
            <h3>{form.id ? 'Editar Peça' : 'Nova Peça'}</h3>
            <button onClick={closeForm} disabled={saving} className="btn btn-ghost btn-xs" style={{ padding: 6 }} title="Cancelar">
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }} className="admin-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                Foto de capa
              </label>
              {form.imagePreview ? (
                <div className="file-upload-preview" style={{ height: 180 }}>
                  <img src={form.imagePreview} alt="Preview" style={{ height: 180, width: '100%', objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
                  <button
                    type="button"
                    className="file-upload-remove"
                    onClick={() => setForm({ ...form, imageFile: null, imagePreview: '', image_url: '' })}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="file-upload" style={{ minHeight: 180, height: 180 }}>
                  <Camera size={28} className="file-upload-icon" />
                  <span className="file-upload-text">Enviar imagem</span>
                  <span className="file-upload-hint">JPG/PNG até 5MB</span>
                  <input type="file" accept="image/*" onChange={onImage} />
                </label>
              )}
              <span className="form-help" style={{ display: 'block', marginTop: 6 }}>
                A capa aparece no card do catálogo.
              </span>
            </div>

            <div>
              <div className="form-row">
                <div className="form-group">
                  <label>Código <span className="required">*</span></label>
                  <input
                    className="form-input"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="Ex: 3225-5345-001"
                  />
                </div>
                <div className="form-group">
                  <label>Conjunto Mecânico <span className="required">*</span></label>
                  <select
                    className="form-select"
                    value={form.assembly_id || ''}
                    onChange={(e) => setForm({ ...form, assembly_id: e.target.value })}
                  >
                    <option value="">Selecione um conjunto...</option>
                    {assemblies.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <span className="form-help">Onde esta peça se encaixa na máquina.</span>
                </div>
              </div>

              <div className="form-group">
                <label>Nome <span className="required">*</span></label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome da peça"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preço unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                  />
                  <span className="form-help">Use ponto para decimais. Default 0 = "Sob consulta".</span>
                </div>
                <div className="form-group">
                  <label>Visibilidade do preço</label>
                  <button
                    type="button"
                    className={`toggle-pill ${form.price_visible ? 'on' : 'off'}`}
                    onClick={() => setForm({ ...form, price_visible: !form.price_visible })}
                  >
                    {form.price_visible
                      ? <><Eye size={14} /> Visível ao cliente</>
                      : <><EyeOff size={14} /> Oculto ao cliente</>
                    }
                  </button>
                  <span className="form-help">Quando oculto, cliente vê "Sob consulta".</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoria (opcional)</label>
                  <input
                    className="form-input"
                    value={form.category || ''}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Ex: Vedação, Rolamento"
                  />
                  <span className="form-help">Subdivisão livre dentro do conjunto.</span>
                </div>
                <div className="form-group">
                  <label>Estoque</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    min={0}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  className="form-textarea"
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrição opcional"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-select"
                  value={form.is_active ? '1' : '0'}
                  onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}
                >
                  <option value="1">Ativa (visível)</option>
                  <option value="0">Inativa</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── GALERIA DE FOTOS EXTRAS (MULTI-UPLOAD) ─── */}
          <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={16} /> Galeria de fotos
                <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  ({visibleExtras.length} foto{visibleExtras.length !== 1 && 's'} extra{visibleExtras.length !== 1 && 's'})
                </span>
              </h4>
              <label className="btn btn-outline btn-xs" style={{ cursor: 'pointer' }}>
                <Plus size={14} /> Adicionar várias fotos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onMultiImages}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div style={{
              background: 'rgba(0,169,157,0.04)',
              border: '1px dashed rgba(0,169,157,0.25)',
              borderRadius: 'var(--r-sm)',
              padding: 10,
              fontSize: '0.82rem',
              color: 'var(--text-light)',
              marginBottom: 12,
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start'
            }}>
              <Info size={14} style={{ color: 'var(--teal-dark)', flexShrink: 0, marginTop: 2 }} />
              <span>
                Selecione <strong>várias imagens</strong> de uma vez. Use a estrela
                para promover qualquer foto a capa.
              </span>
            </div>

            {visibleExtras.length === 0 ? (
              <div style={{
                padding: 24, textAlign: 'center', color: 'var(--text-muted)',
                fontSize: '0.86rem', border: '1px dashed var(--gray-300)',
                borderRadius: 'var(--r-sm)'
              }}>
                Nenhuma foto extra. Mostraremos apenas a capa.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 10
              }}>
                {form.extraImages.map((img, idx) => {
                  if (img._toDelete) return null
                  const src = img.preview || img.image_url
                  return (
                    <div key={idx} style={{
                      position: 'relative', aspectRatio: '1',
                      borderRadius: 'var(--r-sm)', overflow: 'hidden',
                      border: '1px solid var(--gray-200)', background: 'var(--bg-subtle)'
                    }}>
                      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => makeCover(idx)}
                        title="Tornar esta foto a capa"
                        style={{
                          position: 'absolute', top: 6, left: 6,
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--teal-dark)'
                        }}
                      >
                        <Star size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExtra(idx)}
                        title="Remover"
                        style={{
                          position: 'absolute', top: 6, right: 6,
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(239,68,68,0.92)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid var(--gray-200)' }}>
            <label>
              Modelos compatíveis ({form.compatibleIds.length} selecionado{form.compatibleIds.length !== 1 && 's'})
            </label>
            <div className="compat-grid">
              {models.map(m => {
                const selected = form.compatibleIds.includes(m.id)
                return (
                  <label key={m.id} className={selected ? 'is-checked' : ''}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCompat(m.id)}
                    />
                    {m.brand} {m.model}
                  </label>
                )
              })}
            </div>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--gray-200)'
          }}>
            <button className="btn btn-ghost btn-sm" onClick={closeForm} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? <><span className="loader sm" /> Salvando...</> : <><Save size={16} /> Salvar Peça</>}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={48} /></div>
          <h3>{search ? 'Nenhuma peça encontrada' : 'Nenhuma peça cadastrada'}</h3>
          <p>{search ? 'Tente outra busca' : 'Comece adicionando a primeira peça do catálogo.'}</p>
          {!search && !formOpen && (
            <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Adicionar Peça</button>
          )}
        </div>
      ) : (
        <div className="panel">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}></th>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Conjunto</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Fotos</th>
                  <th>Compat.</th>
                  <th>Status</th>
                  <th style={{ width: 130 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const extraCount = (p.images || []).length
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ width: 48, height: 48, background: 'var(--bg-subtle)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <Package size={20} style={{ color: 'var(--text-muted)' }} />
                          }
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--teal-dark)' }}>{p.code}</td>
                      <td><strong>{p.name}</strong></td>
                      <td style={{ fontSize: '0.84rem', color: 'var(--text-light)' }}>
                        {p.assembly?.name || <span style={{ color: 'var(--danger)' }}>, sem conjunto</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong>{p.price > 0 ? fmtMoney(p.price) : <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>,</span>}</strong>
                          {!p.price_visible && (
                            <span title="Oculto ao cliente" style={{ color: 'var(--text-muted)' }}>
                              <EyeOff size={13} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{p.stock}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', color: 'var(--text-light)' }}>
                          <ImageIcon size={12} />
                          {p.image_url ? 1 + extraCount : extraCount}
                        </span>
                      </td>
                      <td>{p.compat?.length || 0}</td>
                      <td>
                        <span className={`status-badge ${p.is_active ? 'status-approved' : 'status-closed'}`}>
                          {p.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-xs" onClick={() => openEdit(p)} title="Editar"><Edit size={14} /></button>
                          <button className="btn btn-ghost btn-xs" onClick={() => remove(p.id)} title="Excluir" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
