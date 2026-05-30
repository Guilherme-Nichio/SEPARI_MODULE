import { useEffect, useMemo, useState } from 'react'
import {
  Plus, Edit, Trash2, Layers, Search, Camera, X, Save, Eye, EyeOff,
  Package, Minus, Percent, DollarSign, Sparkles, Wrench, Info, Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase, uploadFile } from '../../lib/supabase'

const KIT_TYPE_LABEL = {
  preventive_complete: 'Revisão Preventiva, Kit Completo',
  preventive_intermediate: 'Revisão Preventiva, Kit Intermediário',
  custom: 'Kit personalizado'
}

const EMPTY = {
  id: null,
  code: '',
  name: '',
  description: '',
  image_url: '',
  imageFile: null,
  imagePreview: '',
  kit_type: 'custom',
  machine_model_id: '',
  assembly_id: '',
  price_adjustment_type: 'absolute',
  price_adjustment_value: 0,
  is_active: true,
  price_visible: true,
  items: [],            // peças: [{ part_id, name, code, price, quantity }]
  services: []          // serviços: [{ service_id, name, code, price, quantity }]
}

const fmtMoney = (v) => v == null ? ',' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function AdminKits() {
  const [kits, setKits] = useState([])
  const [models, setModels] = useState([])
  const [assemblies, setAssemblies] = useState([])
  const [parts, setParts] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [partSearch, setPartSearch] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')
  const [contentsTab, setContentsTab] = useState('parts') // 'parts' | 'services'

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const [
      kitsRes,
      modelsRes,
      asmRes,
      partsRes,
      servicesRes
    ] = await Promise.all([
      supabase.from('kits_with_pricing').select('*').order('code'),
      supabase.from('machine_models').select('*').order('brand'),
      supabase.from('mechanical_assemblies').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('parts').select('id, code, name, price, assembly_id, image_url, is_active, part_machine_compatibility(machine_model_id)').eq('is_active', true).order('code'),
      supabase.from('services').select('id, code, name, price, category, image_url, is_active').eq('is_active', true).order('code')
    ])
    setKits(kitsRes.data || [])
    setModels(modelsRes.data || [])
    setAssemblies(asmRes.data || [])
    setParts(partsRes.data || [])
    setServices(servicesRes.data || []) // se tabela não existe ainda, fica vazio sem quebrar
    setLoading(false)
  }

  const filtered = useMemo(() => {
    return kits.filter(k => {
      if (filterType !== 'all' && k.kit_type !== filterType) return false
      if (search && !`${k.code} ${k.name}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [kits, search, filterType])

  const openNew = () => {
    setForm(EMPTY)
    setPartSearch('')
    setServiceSearch('')
    setContentsTab('parts')
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 150, behavior: 'smooth' }), 100)
  }

  const openEdit = async (k) => {
    // Carrega itens (peças) + serviços (serviços é v40, opcional)
    const itemsRes = await supabase
      .from('kit_items')
      .select('part_id, quantity, part:parts(id, code, name, price)')
      .eq('kit_id', k.id)
    const itemsData = itemsRes.data

    let srvData = []
    const srvRes = await supabase
      .from('kit_services')
      .select('service_id, quantity, service:services(id, code, name, price)')
      .eq('kit_id', k.id)
    if (!srvRes.error) srvData = srvRes.data || []


    setForm({
      id: k.id,
      code: k.code,
      name: k.name,
      description: k.description || '',
      image_url: k.image_url || '',
      imageFile: null,
      imagePreview: k.image_url || '',
      kit_type: k.kit_type,
      machine_model_id: k.machine_model_id,
      assembly_id: k.assembly_id || '',
      price_adjustment_type: k.price_adjustment_type,
      price_adjustment_value: k.price_adjustment_value,
      is_active: k.is_active,
      price_visible: k.price_visible,
      items: (itemsData || []).map(it => ({
        part_id: it.part_id,
        name: it.part?.name,
        code: it.part?.code,
        price: Number(it.part?.price || 0),
        quantity: it.quantity
      })),
      services: (srvData || []).map(it => ({
        service_id: it.service_id,
        name: it.service?.name,
        code: it.service?.code,
        price: Number(it.service?.price || 0),
        quantity: it.quantity
      }))
    })
    setPartSearch('')
    setServiceSearch('')
    setContentsTab('parts')
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 150, behavior: 'smooth' }), 100)
  }

  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }

  const onImage = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) return toast.error('Máximo 5MB')
    const r = new FileReader()
    r.onload = () => setForm({ ...form, imageFile: f, imagePreview: r.result })
    r.readAsDataURL(f)
  }

  // ─── Peças do kit ───
  const addPart = (part) => {
    if (form.items.some(it => it.part_id === part.id)) {
      toast.error('Esta peça já está no kit')
      return
    }
    setForm(f => ({
      ...f,
      items: [...f.items, { part_id: part.id, name: part.name, code: part.code, price: Number(part.price || 0), quantity: 1 }]
    }))
  }
  const updateItemQty = (part_id, qty) => {
    if (qty < 1) return
    setForm(f => ({ ...f, items: f.items.map(it => it.part_id === part_id ? { ...it, quantity: qty } : it) }))
  }
  const removeItem = (part_id) => {
    setForm(f => ({ ...f, items: f.items.filter(it => it.part_id !== part_id) }))
  }

  // ─── Serviços do kit ───
  const addService = (srv) => {
    if (form.services.some(it => it.service_id === srv.id)) {
      toast.error('Este serviço já está no kit')
      return
    }
    setForm(f => ({
      ...f,
      services: [...f.services, { service_id: srv.id, name: srv.name, code: srv.code, price: Number(srv.price || 0), quantity: 1 }]
    }))
  }
  const updateSrvQty = (service_id, qty) => {
    if (qty < 1) return
    setForm(f => ({ ...f, services: f.services.map(it => it.service_id === service_id ? { ...it, quantity: qty } : it) }))
  }
  const removeService = (service_id) => {
    setForm(f => ({ ...f, services: f.services.filter(it => it.service_id !== service_id) }))
  }

  // Clonar peças do conjunto compatíveis com o modelo
  const cloneFromAssembly = async () => {
    if (!form.assembly_id) return toast.error('Selecione o conjunto mecânico primeiro')
    if (!form.machine_model_id) return toast.error('Selecione o modelo de máquina primeiro')

    const { data: compatibleParts } = await supabase
      .from('parts')
      .select('id, code, name, price, part_machine_compatibility!inner(machine_model_id)')
      .eq('assembly_id', form.assembly_id)
      .eq('is_active', true)
      .eq('part_machine_compatibility.machine_model_id', form.machine_model_id)

    if (!compatibleParts || compatibleParts.length === 0) {
      return toast.error('Nenhuma peça desse conjunto é compatível com esse modelo')
    }

    setForm(f => {
      const existing = new Set(f.items.map(it => it.part_id))
      const newItems = compatibleParts
        .filter(p => !existing.has(p.id))
        .map(p => ({ part_id: p.id, name: p.name, code: p.code, price: Number(p.price || 0), quantity: 1 }))
      return { ...f, items: [...f.items, ...newItems] }
    })

    toast.success(`${compatibleParts.length} peça${compatibleParts.length !== 1 ? 's' : ''} adicionada${compatibleParts.length !== 1 ? 's' : ''}`)
  }

  // ─── Cálculo de preço ───
  const partsSubtotal = useMemo(
    () => form.items.reduce((s, it) => s + (it.price * it.quantity), 0),
    [form.items]
  )
  const servicesSubtotal = useMemo(
    () => form.services.reduce((s, it) => s + (it.price * it.quantity), 0),
    [form.services]
  )
  const basePrice = partsSubtotal + servicesSubtotal

  const finalPrice = useMemo(() => {
    const adj = Number(form.price_adjustment_value || 0)
    if (form.price_adjustment_type === 'percent') return basePrice * (1 + adj / 100)
    return basePrice + adj
  }, [basePrice, form.price_adjustment_type, form.price_adjustment_value])

  // ─── Filtragens ───
  const partsToShow = useMemo(() => {
    let list = parts

    // 1. Se um modelo de máquina foi selecionado, mostra só peças compatíveis
    if (form.machine_model_id) {
      list = list.filter(p => {
        const compats = p.part_machine_compatibility || []
        return compats.some(c => c.machine_model_id === form.machine_model_id)
      })
    }

    // 2. Se um conjunto mecânico foi escolhido no kit, restringe a ele
    if (form.assembly_id) {
      list = list.filter(p => p.assembly_id === form.assembly_id)
    }

    // 3. Busca textual por código ou nome
    if (partSearch) {
      const s = partSearch.toLowerCase()
      list = list.filter(p => `${p.code} ${p.name}`.toLowerCase().includes(s))
    }

    return list.slice(0, 50)
  }, [parts, partSearch, form.assembly_id, form.machine_model_id])

  const servicesToShow = useMemo(() => {
    let list = services
    if (serviceSearch) {
      const s = serviceSearch.toLowerCase()
      list = list.filter(p => `${p.code} ${p.name} ${p.category || ''}`.toLowerCase().includes(s))
    }
    return list.slice(0, 50)
  }, [services, serviceSearch])

  const save = async () => {
    if (!form.code.trim()) return toast.error('Informe o código do kit')
    if (!form.name.trim()) return toast.error('Informe o nome do kit')
    if (!form.machine_model_id) return toast.error('Selecione o modelo de máquina')
    if (form.items.length === 0 && form.services.length === 0) {
      return toast.error('Adicione ao menos uma peça ou serviço ao kit')
    }

    setSaving(true)
    try {
      let image_url = form.image_url
      if (form.imageFile) {
        const { url } = await uploadFile('part-images', form.imageFile, 'kits/')
        image_url = url
      }

      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description?.trim() || null,
        image_url: image_url || null,
        kit_type: form.kit_type,
        machine_model_id: form.machine_model_id,
        assembly_id: form.assembly_id || null,
        price_adjustment_type: form.price_adjustment_type,
        price_adjustment_value: Number(form.price_adjustment_value) || 0,
        is_active: !!form.is_active,
        price_visible: !!form.price_visible
      }

      let kitId = form.id
      if (kitId) {
        const { error } = await supabase.from('kits').update(payload).eq('id', kitId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('kits').insert(payload).select().single()
        if (error) throw error
        kitId = data.id
      }

      // Substitui peças
      const { error: delErr } = await supabase.from('kit_items').delete().eq('kit_id', kitId)
      if (delErr) throw delErr
      if (form.items.length > 0) {
        const rows = form.items.map(it => ({ kit_id: kitId, part_id: it.part_id, quantity: it.quantity }))
        const { error: insErr } = await supabase.from('kit_items').insert(rows)
        if (insErr) throw insErr
      }

      // Substitui serviços (silenciosamente pula se tabela não existe, v40 não rodado)
      const { error: delSrvErr } = await supabase.from('kit_services').delete().eq('kit_id', kitId)
      const servicesTableMissing = delSrvErr && /schema cache|does not exist/i.test(delSrvErr.message)
      if (delSrvErr && !servicesTableMissing) throw delSrvErr
      if (form.services.length > 0 && !servicesTableMissing) {
        const srvRows = form.services.map(it => ({ kit_id: kitId, service_id: it.service_id, quantity: it.quantity }))
        const { error: insSrvErr } = await supabase.from('kit_services').insert(srvRows)
        if (insSrvErr) throw insSrvErr
      } else if (form.services.length > 0 && servicesTableMissing) {
        toast('Serviços do kit exigem rodar a migração v40 no Supabase.', { icon: 'ℹ️', duration: 4000 })
      }

      toast.success(form.id ? 'Kit atualizado!' : 'Kit criado!')
      closeForm()
      load()
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar kit')
    }
    setSaving(false)
  }

  const remove = async (id) => {
    if (!confirm('Excluir este kit? As peças e serviços vinculados não serão afetados.')) return
    const { error } = await supabase.from('kits').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir: ' + error.message)
    else { toast.success('Kit excluído'); load() }
  }

  return (
    <>
      {/* Banner explicativo */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,169,157,0.06), rgba(0,169,157,0.02))',
        border: '1px solid rgba(0,169,157,0.18)',
        borderRadius: 'var(--r-md)',
        padding: '14px 18px',
        marginBottom: 16,
        display: 'flex', gap: 12, alignItems: 'flex-start'
      }}>
        <Info size={18} style={{ color: 'var(--teal-dark)', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--text-light)' }}>
          <strong style={{ color: 'var(--text)' }}>O que é um Kit?</strong> Um kit empacota
          <strong> peças + serviços</strong> com um código único, vinculado a um modelo de máquina específico.
          O preço final é a soma dos itens com um ajuste em R$ ou %. Use os tipos
          <em> "Revisão Preventiva, Completo / Intermediário"</em> para os kits que aparecem
          em destaque dentro da página da máquina do cliente.
        </div>
      </div>

      <div className="panel-header" style={{
        background: 'var(--white)',
        padding: '16px 20px',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--gray-200)',
        marginBottom: 16,
        gap: 12
      }}>
        <div className="search-bar" style={{ margin: 0, flex: 1, maxWidth: 320 }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por código ou nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ maxWidth: 320, padding: '10px 14px' }}
        >
          <option value="all">Todos os tipos</option>
          <option value="preventive_complete">Revisão Preventiva, Completo</option>
          <option value="preventive_intermediate">Revisão Preventiva, Intermediário</option>
          <option value="custom">Personalizado</option>
        </select>
        {!formOpen && (
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={16} /> Novo Kit
          </button>
        )}
      </div>

      {formOpen && (
        <div className="inline-form-card">
          <div className="inline-form-card-head">
            <h3>{form.id ? 'Editar Kit' : 'Novo Kit'}</h3>
            <button onClick={closeForm} disabled={saving} className="btn btn-ghost btn-xs" style={{ padding: 6 }}>
              <X size={18} />
            </button>
          </div>

          {/* ─── DADOS BÁSICOS ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }} className="admin-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                Imagem do kit
              </label>
              {form.imagePreview ? (
                <div className="file-upload-preview" style={{ height: 180 }}>
                  <img src={form.imagePreview} alt="Preview" style={{ height: 180, width: '100%', objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
                  <button
                    type="button"
                    className="file-upload-remove"
                    onClick={() => setForm({ ...form, imageFile: null, imagePreview: '', image_url: '' })}
                  ><X size={14} /></button>
                </div>
              ) : (
                <label className="file-upload" style={{ minHeight: 180, height: 180 }}>
                  <Camera size={28} className="file-upload-icon" />
                  <span className="file-upload-text">Enviar imagem</span>
                  <span className="file-upload-hint">JPG/PNG até 5MB</span>
                  <input type="file" accept="image/*" onChange={onImage} />
                </label>
              )}
            </div>

            <div>
              <div className="form-row">
                <div className="form-group">
                  <label>Código mãe <span className="required">*</span></label>
                  <input
                    className="form-input"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="Ex: KIT-COMPLETO-MRPX418"
                  />
                </div>
                <div className="form-group">
                  <label>Tipo <span className="required">*</span></label>
                  <select
                    className="form-select"
                    value={form.kit_type}
                    onChange={(e) => setForm({ ...form, kit_type: e.target.value })}
                  >
                    <option value="custom">Personalizado</option>
                    <option value="preventive_complete">Revisão Preventiva, Completo</option>
                    <option value="preventive_intermediate">Revisão Preventiva, Intermediário</option>
                  </select>
                  <span className="form-help">Tipos preventivos têm 1 kit único por modelo.</span>
                </div>
              </div>

              <div className="form-group">
                <label>Nome <span className="required">*</span></label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Kit Completo de Revisão Preventiva, MRPX 418"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Máquina alvo <span className="required">*</span></label>
                  <select
                    className="form-select"
                    value={form.machine_model_id}
                    onChange={(e) => setForm({ ...form, machine_model_id: e.target.value })}
                  >
                    <option value="">Selecione um modelo...</option>
                    {models.map(m => (
                      <option key={m.id} value={m.id}>{m.brand} {m.model}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Conjunto (opcional)</label>
                  <select
                    className="form-select"
                    value={form.assembly_id || ''}
                    onChange={(e) => setForm({ ...form, assembly_id: e.target.value })}
                  >
                    <option value="">, Sem conjunto específico ,</option>
                    {assemblies.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <span className="form-help">Útil pra clonar peças do conjunto.</span>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  className="form-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrição que aparece pro cliente"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={form.is_active ? '1' : '0'}
                    onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}
                  >
                    <option value="1">Ativo (visível)</option>
                    <option value="0">Inativo</option>
                  </select>
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
            </div>
          </div>

          {/* ─── CONTEÚDO: PEÇAS + SERVIÇOS COM ABAS ─── */}
          <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: 22, paddingTop: 22 }}>
            <h4 style={{ margin: '0 0 12px' }}>Conteúdo do kit</h4>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: 4,
              borderBottom: '1px solid var(--gray-200)',
              marginBottom: 14
            }}>
              <button
                type="button"
                onClick={() => setContentsTab('parts')}
                className={`tab ${contentsTab === 'parts' ? 'active' : ''}`}
                style={{ marginBottom: -1 }}
              >
                <Package size={14} /> Peças
                <span className="tab-count">{form.items.length}</span>
              </button>
              <button
                type="button"
                onClick={() => setContentsTab('services')}
                className={`tab ${contentsTab === 'services' ? 'active' : ''}`}
                style={{ marginBottom: -1 }}
              >
                <Wrench size={14} /> Serviços
                <span className="tab-count">{form.services.length}</span>
              </button>
            </div>

            {contentsTab === 'parts' ? (
              <>
                {form.assembly_id && form.machine_model_id && (
                  <div style={{ marginBottom: 12, textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={cloneFromAssembly}
                      title="Adiciona todas as peças do conjunto compatíveis com a máquina"
                    >
                      <Sparkles size={14} /> Clonar peças do conjunto
                    </button>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="admin-form-grid">
                  {/* Catálogo */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                      Catálogo de peças
                    </label>
                    <div className="search-bar" style={{ margin: '0 0 10px' }}>
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder={form.assembly_id ? 'Buscar peças deste conjunto...' : 'Buscar peça por código ou nome...'}
                        value={partSearch}
                        onChange={(e) => setPartSearch(e.target.value)}
                      />
                    </div>
                    <div style={{
                      maxHeight: 320, overflowY: 'auto',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--white)'
                    }}>
                      {partsToShow.length === 0 ? (
                        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          {!form.machine_model_id
                            ? 'Selecione o modelo de máquina acima para ver as peças compatíveis.'
                            : form.assembly_id
                              ? <>Nenhuma peça deste conjunto é compatível com o modelo selecionado.<br /><span style={{ fontSize: '0.78rem' }}>Tente sem filtrar por conjunto, ou cadastre a compatibilidade em Peças.</span></>
                              : <>Nenhuma peça compatível com este modelo.<br /><span style={{ fontSize: '0.78rem' }}>Em "Catálogo de Peças" → editar peça → marque este modelo na compatibilidade.</span></>
                          }
                        </div>
                      ) : partsToShow.map(p => {
                        const added = form.items.some(it => it.part_id === p.id)
                        return (
                          <button
                            type="button"
                            key={p.id}
                            disabled={added}
                            onClick={() => addPart(p)}
                            style={{
                              width: '100%', textAlign: 'left',
                              padding: '10px 14px', border: 'none',
                              borderBottom: '1px solid var(--gray-200)',
                              background: added ? 'var(--bg-subtle)' : 'transparent',
                              cursor: added ? 'not-allowed' : 'pointer',
                              opacity: added ? 0.5 : 1,
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--teal-dark)' }}>{p.code}</div>
                              <div style={{ fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', flexShrink: 0 }}>
                              {p.price > 0 ? fmtMoney(p.price) : ','}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Selecionados */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                      Peças no kit ({form.items.length})
                    </label>
                    <div style={{
                      maxHeight: 372, overflowY: 'auto',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--white)'
                    }}>
                      {form.items.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          Nenhuma peça no kit ainda.
                        </div>
                      ) : form.items.map(it => (
                        <div key={it.part_id} style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid var(--gray-200)',
                          display: 'flex', alignItems: 'center', gap: 10
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--teal-dark)' }}>{it.code}</div>
                            <div style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {it.price > 0 ? `${fmtMoney(it.price)} × ${it.quantity} = ${fmtMoney(it.price * it.quantity)}` : 'Sem preço cadastrado'}
                            </div>
                          </div>
                          <div className="qty-control" style={{ flexShrink: 0 }}>
                            <button onClick={() => updateItemQty(it.part_id, it.quantity - 1)}><Minus size={11} /></button>
                            <span style={{ minWidth: 24, textAlign: 'center', fontSize: '0.85rem' }}>{it.quantity}</span>
                            <button onClick={() => updateItemQty(it.part_id, it.quantity + 1)}><Plus size={11} /></button>
                          </div>
                          <button
                            onClick={() => removeItem(it.part_id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4 }}
                            title="Remover"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  background: 'rgba(8,145,178,0.06)',
                  border: '1px dashed rgba(8,145,178,0.25)',
                  borderRadius: 'var(--r-sm)',
                  padding: 10, fontSize: '0.82rem', color: 'var(--text-light)',
                  marginBottom: 12, display: 'flex', gap: 8, alignItems: 'flex-start'
                }}>
                  <Info size={14} style={{ color: '#0891b2', flexShrink: 0, marginTop: 2 }} />
                  <span>
                    Adicione <strong>serviços</strong> que entram junto com as peças.
                    Ex: 1× Kit Completo = peças + 1× Manutenção Preventiva + 1× Balanceamento Dinâmico.
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="admin-form-grid">
                  {/* Catálogo de serviços */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                      Catálogo de serviços
                    </label>
                    <div className="search-bar" style={{ margin: '0 0 10px' }}>
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Buscar serviço por código, nome ou categoria..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                      />
                    </div>
                    <div style={{
                      maxHeight: 320, overflowY: 'auto',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--white)'
                    }}>
                      {servicesToShow.length === 0 ? (
                        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          {services.length === 0
                            ? 'Nenhum serviço cadastrado ainda. Cadastre em /admin/servicos.'
                            : 'Nenhum serviço encontrado.'}
                        </div>
                      ) : servicesToShow.map(s => {
                        const added = form.services.some(it => it.service_id === s.id)
                        return (
                          <button
                            type="button"
                            key={s.id}
                            disabled={added}
                            onClick={() => addService(s)}
                            style={{
                              width: '100%', textAlign: 'left',
                              padding: '10px 14px', border: 'none',
                              borderBottom: '1px solid var(--gray-200)',
                              background: added ? 'var(--bg-subtle)' : 'transparent',
                              cursor: added ? 'not-allowed' : 'pointer',
                              opacity: added ? 0.5 : 1,
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0891b2' }}>{s.code}</div>
                              <div style={{ fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                              {s.category && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.category}</div>
                              )}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', flexShrink: 0 }}>
                              {s.price > 0 ? fmtMoney(s.price) : ','}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Serviços selecionados */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                      Serviços no kit ({form.services.length})
                    </label>
                    <div style={{
                      maxHeight: 372, overflowY: 'auto',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--white)'
                    }}>
                      {form.services.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          Nenhum serviço no kit ainda.
                        </div>
                      ) : form.services.map(it => (
                        <div key={it.service_id} style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid var(--gray-200)',
                          display: 'flex', alignItems: 'center', gap: 10
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0891b2' }}>{it.code}</div>
                            <div style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {it.price > 0 ? `${fmtMoney(it.price)} × ${it.quantity} = ${fmtMoney(it.price * it.quantity)}` : 'Sem preço cadastrado'}
                            </div>
                          </div>
                          <div className="qty-control" style={{ flexShrink: 0 }}>
                            <button onClick={() => updateSrvQty(it.service_id, it.quantity - 1)}><Minus size={11} /></button>
                            <span style={{ minWidth: 24, textAlign: 'center', fontSize: '0.85rem' }}>{it.quantity}</span>
                            <button onClick={() => updateSrvQty(it.service_id, it.quantity + 1)}><Plus size={11} /></button>
                          </div>
                          <button
                            onClick={() => removeService(it.service_id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4 }}
                            title="Remover"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ─── PREÇO / AJUSTE ─── */}
          <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: 22, paddingTop: 22 }}>
            <h4 style={{ margin: '0 0 14px' }}>Preço do kit</h4>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de ajuste</label>
                <select
                  className="form-select"
                  value={form.price_adjustment_type}
                  onChange={(e) => setForm({ ...form, price_adjustment_type: e.target.value })}
                >
                  <option value="absolute">R$ (valor fixo)</option>
                  <option value="percent">% (percentual)</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Valor do ajuste
                  <span style={{ marginLeft: 6, fontWeight: 400, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    (negativo = desconto)
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step={form.price_adjustment_type === 'percent' ? '0.5' : '0.01'}
                    className="form-input"
                    value={form.price_adjustment_value}
                    onChange={(e) => setForm({ ...form, price_adjustment_value: e.target.value })}
                    placeholder="0"
                    style={{ paddingRight: 36 }}
                  />
                  <div style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', pointerEvents: 'none'
                  }}>
                    {form.price_adjustment_type === 'percent' ? <Percent size={14} /> : <DollarSign size={14} />}
                  </div>
                </div>
                <span className="form-help">
                  Ex: <strong>-10</strong> em % = 10% off · <strong>-200</strong> em R$ = R$ 200 off
                </span>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(0,169,157,0.06), rgba(0,169,157,0.02))',
              border: '1px solid rgba(0,169,157,0.18)',
              borderRadius: 'var(--r-md)',
              padding: 16,
              marginTop: 8
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-light)' }}>
                  <Package size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
                  Peças ({form.items.length})
                </span>
                <strong>{fmtMoney(partsSubtotal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-light)' }}>
                  <Wrench size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
                  Serviços ({form.services.length})
                </span>
                <strong>{fmtMoney(servicesSubtotal)}</strong>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 8, borderTop: '1px dashed rgba(0,169,157,0.18)', marginBottom: 8
              }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-light)' }}>Subtotal</span>
                <strong>{fmtMoney(basePrice)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-light)' }}>
                  Ajuste ({form.price_adjustment_type === 'percent' ? `${form.price_adjustment_value || 0}%` : fmtMoney(form.price_adjustment_value || 0)})
                </span>
                <strong style={{ color: Number(form.price_adjustment_value) < 0 ? 'var(--success)' : 'var(--text-light)' }}>
                  {fmtMoney(finalPrice - basePrice)}
                </strong>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 10, borderTop: '1px solid rgba(0,169,157,0.18)', marginTop: 4
              }}>
                <span style={{ fontWeight: 600 }}>Preço final do kit</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--teal-dark)' }}>
                  {fmtMoney(finalPrice)}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--gray-200)'
          }}>
            <button className="btn btn-ghost btn-sm" onClick={closeForm} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? <><span className="loader sm" /> Salvando...</> : <><Save size={16} /> Salvar Kit</>}
            </button>
          </div>
        </div>
      )}

      {/* ─── LISTA ─── */}
      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Layers size={48} /></div>
          <h3>{search ? 'Nenhum kit encontrado' : 'Nenhum kit cadastrado'}</h3>
          <p>{search ? 'Tente outra busca' : 'Crie kits para Revisão Preventiva ou kits personalizados.'}</p>
          {!search && !formOpen && (
            <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Novo Kit</button>
          )}
        </div>
      ) : (
        <div className="panel">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}></th>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Máquina</th>
                  <th>Peças</th>
                  <th>Serviços</th>
                  <th>Preço base</th>
                  <th>Preço final</th>
                  <th>Status</th>
                  <th style={{ width: 130 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(k => (
                  <tr key={k.id}>
                    <td>
                      <div style={{ width: 44, height: 44, background: 'var(--bg-subtle)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {k.image_url
                          ? <img src={k.image_url} alt={k.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Layers size={18} style={{ color: 'var(--text-muted)' }} />
                        }
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--teal-dark)' }}>{k.code}</td>
                    <td><strong>{k.name}</strong></td>
                    <td style={{ fontSize: '0.84rem' }}>
                      <span style={{
                        background: k.kit_type === 'custom' ? 'var(--bg-subtle)' : 'rgba(0,169,157,0.08)',
                        color: k.kit_type === 'custom' ? 'var(--text-light)' : 'var(--teal-dark)',
                        padding: '3px 8px', borderRadius: 'var(--r-pill)',
                        fontSize: '0.74rem', fontWeight: 600
                      }}>
                        {KIT_TYPE_LABEL[k.kit_type] || k.kit_type}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.86rem' }}>{k.machine_brand} {k.machine_model}</td>
                    <td>{k.item_count}</td>
                    <td>{k.service_count || 0}</td>
                    <td>{fmtMoney(k.base_price)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong>{fmtMoney(k.final_price)}</strong>
                        {!k.price_visible && <span title="Oculto ao cliente"><EyeOff size={13} style={{ color: 'var(--text-muted)' }} /></span>}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${k.is_active ? 'status-approved' : 'status-closed'}`}>
                        {k.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => openEdit(k)} title="Editar"><Edit size={14} /></button>
                        <button className="btn btn-ghost btn-xs" onClick={() => remove(k.id)} title="Excluir" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
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
