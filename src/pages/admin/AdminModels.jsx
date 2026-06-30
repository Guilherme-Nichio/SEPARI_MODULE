import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Layers, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const EMPTY = { id: null, brand: '', model: '', category: '', description: '' }

export default function AdminModels() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('machine_models')
      .select('*')
      .order('brand', { ascending: true })
    if (!error) setModels(data || [])
    setLoading(false)
  }

  const openNew = () => {
    setForm(EMPTY)
    setFormOpen(true)
  }
  const openEdit = (m) => {
    setForm(m)
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 200, behavior: 'smooth' }), 100)
  }
  const closeForm = () => {
    setFormOpen(false)
    setForm(EMPTY)
  }

  const save = async () => {
    if (!form.brand.trim() || !form.model.trim()) return toast.error('Marca e modelo são obrigatórios')
    setSaving(true)
    const payload = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      category: form.category?.trim() || null,
      description: form.description?.trim() || null
    }
    const { error } = form.id
      ? await supabase.from('machine_models').update(payload).eq('id', form.id)
      : await supabase.from('machine_models').insert(payload)
    setSaving(false)
    if (error) toast.error(error.message)
    else {
      toast.success(form.id ? 'Modelo atualizado!' : 'Modelo criado!')
      closeForm()
      load()
    }
  }

  const remove = async (id) => {
    if (!confirm('Excluir este modelo? Pode afetar peças e máquinas cadastradas.')) return
    const { error } = await supabase.from('machine_models').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir')
    else { toast.success('Modelo excluído'); load() }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <p style={{ color: 'var(--text-light)', margin: 0 }}>
          {models.length} modelo{models.length !== 1 && 's'} cadastrado{models.length !== 1 && 's'}
        </p>
        {!formOpen && (
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={16} /> Novo Modelo
          </button>
        )}
      </div>

      {formOpen && (
        <div className="inline-form-card">
          <div className="inline-form-card-head">
            <h3>{form.id ? 'Editar Modelo' : 'Novo Modelo'}</h3>
            <button
              onClick={closeForm}
              disabled={saving}
              className="btn btn-ghost btn-xs"
              style={{ padding: 6 }}
              title="Cancelar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marca <span className="required">*</span></label>
              <input
                className="form-input"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="Ex: Alfa Laval"
              />
            </div>
            <div className="form-group">
              <label>Modelo <span className="required">*</span></label>
              <input
                className="form-input"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Ex: MRPX 418"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <input
              className="form-input"
              value={form.category || ''}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Ex: Separadora"
            />
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

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 8,
            paddingTop: 18,
            borderTop: '1px solid var(--gray-200)'
          }}>
            <button className="btn btn-ghost btn-sm" onClick={closeForm} disabled={saving}>
              Cancelar
            </button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? <><span className="loader sm" /> Salvando...</> : <><Save size={16} /> Salvar Modelo</>}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : models.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Layers size={48} /></div>
          <h3>Nenhum modelo cadastrado</h3>
          {!formOpen && (
            <button className="btn btn-primary" onClick={openNew} style={{ marginTop: 16 }}>
              <Plus size={16} /> Adicionar Modelo
            </button>
          )}
        </div>
      ) : (
        <div className="panel">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th style={{ width: 120 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {models.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.brand}</strong></td>
                    <td>{m.model}</td>
                    <td style={{ color: 'var(--text-light)' }}>{m.category || '-'}</td>
                    <td style={{ color: 'var(--text-light)' }}>{m.description || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => openEdit(m)} title="Editar">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => remove(m.id)} title="Excluir" style={{ color: 'var(--danger)' }}>
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
