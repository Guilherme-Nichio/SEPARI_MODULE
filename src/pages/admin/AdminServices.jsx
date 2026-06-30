import { useEffect, useMemo, useState } from 'react'
import {
  Plus, Edit, Trash2, Wrench, Search, Camera, X, Save, Eye, EyeOff, Clock, Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase, uploadFile } from '../../lib/supabase'

const EMPTY = {
  id: null,
  code: '',
  name: '',
  description: '',
  category: '',
  duration_hours: 0,
  price: 0,
  price_visible: true,
  is_active: true,
  image_url: '',
  imageFile: null,
  imagePreview: ''
}

const fmtMoney = (v) => v == null ? ',' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      if (/schema cache|does not exist/i.test(error.message)) {
        setTableMissing(true)
      } else {
        toast.error('Erro ao carregar serviços: ' + error.message)
      }
    } else {
      setTableMissing(false)
      setServices(data || [])
    }
    setLoading(false)
  }

  const categories = useMemo(() => {
    const set = new Set()
    services.forEach(s => s.category && set.add(s.category))
    return Array.from(set).sort()
  }, [services])

  const filtered = useMemo(() => {
    return services.filter(s => {
      if (filterCategory !== 'all' && s.category !== filterCategory) return false
      if (search) {
        const q = search.toLowerCase()
        if (!`${s.code} ${s.name} ${s.category || ''}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [services, search, filterCategory])

  const openNew = () => {
    setForm(EMPTY)
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 200, behavior: 'smooth' }), 100)
  }

  const openEdit = (s) => {
    setForm({
      ...s,
      price: s.price ?? 0,
      duration_hours: s.duration_hours ?? 0,
      price_visible: s.price_visible ?? true,
      imageFile: null,
      imagePreview: s.image_url || ''
    })
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 200, behavior: 'smooth' }), 100)
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

  const save = async () => {
    if (!form.code.trim() || !form.name.trim()) return toast.error('Código e nome são obrigatórios')
    if (form.price < 0) return toast.error('Preço não pode ser negativo')
    setSaving(true)
    try {
      let image_url = form.image_url
      if (form.imageFile) {
        const { url } = await uploadFile('part-images', form.imageFile, 'services/')
        image_url = url
      }

      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description?.trim() || null,
        category: form.category?.trim() || null,
        duration_hours: Number(form.duration_hours) || 0,
        price: Number(form.price) || 0,
        price_visible: !!form.price_visible,
        is_active: !!form.is_active,
        image_url,
        updated_at: new Date().toISOString()
      }

      if (form.id) {
        const { error } = await supabase.from('services').update(payload).eq('id', form.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('services').insert(payload)
        if (error) throw error
      }

      toast.success(form.id ? 'Serviço atualizado!' : 'Serviço criado!')
      closeForm()
      load()
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar')
    }
    setSaving(false)
  }

  const remove = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?\n\nAtenção: se ele estiver em algum kit, será necessário remover de lá antes.')) return
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir: ' + error.message)
    else { toast.success('Serviço excluído'); load() }
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
          <strong style={{ color: 'var(--text)' }}>O que é um serviço?</strong> Aqui você cadastra tudo aquilo que <em>não é peça</em>, mas o cliente pode contratar:
          manutenção preventiva, balanceamento, instalação, recondicionamento, etc. Cada serviço pode depois
          ser vendido avulso ou colocado dentro de um <strong>Kit</strong> junto com peças.
        </div>
      </div>

      {tableMissing && (
        <div style={{
          background: '#fff8ec',
          border: '1px solid #f5d180',
          borderRadius: 'var(--r-md)',
          padding: '18px 22px',
          marginBottom: 16,
          display: 'flex', gap: 14, alignItems: 'flex-start'
        }}>
          <Info size={22} style={{ color: '#b45309', flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#5b3d11' }}>
            <strong style={{ color: '#7a4a0c', display: 'block', marginBottom: 4 }}>Migração v40 ainda não foi aplicada</strong>
            A tabela <code style={{ background: '#fbe6c1', padding: '1px 6px', borderRadius: 4 }}>services</code> não existe no seu banco.
            Abra o painel do Supabase → SQL Editor e rode o arquivo <strong>supabase/v40-services-and-multi-photos.sql</strong> que veio junto com o projeto.
            Depois recarregue esta página.
          </div>
        </div>
      )}

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
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ maxWidth: 240, padding: '10px 14px' }}
        >
          <option value="all">Todas as categorias</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {!formOpen && (
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={16} /> Novo Serviço
          </button>
        )}
      </div>

      {formOpen && (
        <div className="inline-form-card">
          <div className="inline-form-card-head">
            <h3>{form.id ? 'Editar Serviço' : 'Novo Serviço'}</h3>
            <button onClick={closeForm} disabled={saving} className="btn btn-ghost btn-xs" style={{ padding: 6 }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }} className="admin-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                Imagem do serviço <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.78rem' }}>· opcional</span>
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
            </div>

            <div>
              <div className="form-row">
                <div className="form-group">
                  <label>Código <span className="required">*</span></label>
                  <input
                    className="form-input"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="Ex: SRV-MNT-PRV"
                  />
                  <span className="form-help">Identificador único, usado em relatórios e cotações.</span>
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <input
                    className="form-input"
                    value={form.category || ''}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Ex: Manutenção, Balanceamento"
                    list="srv-categories"
                  />
                  <datalist id="srv-categories">
                    {categories.map(c => <option key={c} value={c} />)}
                  </datalist>
                  <span className="form-help">Agrupa serviços parecidos.</span>
                </div>
              </div>

              <div className="form-group">
                <label>Nome <span className="required">*</span></label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Manutenção Preventiva Completa"
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  className="form-textarea"
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="O que está incluído neste serviço, em quanto tempo é entregue, requisitos, etc."
                />
                <span className="form-help">Esse texto aparece pro cliente.</span>
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
                  <span className="form-help">0 = "Sob consulta".</span>
                </div>
                <div className="form-group">
                  <label>Duração estimada (horas)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className="form-input"
                    value={form.duration_hours}
                    onChange={(e) => setForm({ ...form, duration_hours: e.target.value })}
                    placeholder="Ex: 8"
                  />
                  <span className="form-help">Apenas informativo pro cliente.</span>
                </div>
              </div>

              <div className="form-row">
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
                  <span className="form-help">Oculto = cliente vê "Sob consulta".</span>
                </div>
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
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--gray-200)'
          }}>
            <button className="btn btn-ghost btn-sm" onClick={closeForm} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? <><span className="loader sm" /> Salvando...</> : <><Save size={16} /> Salvar Serviço</>}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Wrench size={48} /></div>
          <h3>{search ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}</h3>
          <p>{search ? 'Tente outra busca' : 'Comece adicionando o primeiro serviço.'}</p>
          {!search && !formOpen && (
            <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Adicionar Serviço</button>
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
                  <th>Categoria</th>
                  <th>Duração</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th style={{ width: 130 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ width: 44, height: 44, background: 'var(--bg-subtle)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {s.image_url
                          ? <img src={s.image_url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Wrench size={18} style={{ color: 'var(--text-muted)' }} />
                        }
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--teal-dark)' }}>{s.code}</td>
                    <td><strong>{s.name}</strong></td>
                    <td style={{ fontSize: '0.86rem', color: 'var(--text-light)' }}>
                      {s.category || <span style={{ color: 'var(--text-muted)' }}>,</span>}
                    </td>
                    <td style={{ fontSize: '0.86rem' }}>
                      {s.duration_hours > 0
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-light)' }}><Clock size={12} /> {s.duration_hours}h</span>
                        : <span style={{ color: 'var(--text-muted)' }}>,</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong>{s.price > 0 ? fmtMoney(s.price) : <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>,</span>}</strong>
                        {!s.price_visible && (
                          <span title="Oculto ao cliente" style={{ color: 'var(--text-muted)' }}>
                            <EyeOff size={13} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${s.is_active ? 'status-approved' : 'status-closed'}`}>
                        {s.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => openEdit(s)} title="Editar"><Edit size={14} /></button>
                        <button className="btn btn-ghost btn-xs" onClick={() => remove(s.id)} title="Excluir" style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
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
