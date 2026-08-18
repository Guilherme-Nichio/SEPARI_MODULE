import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Droplet, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const EMPTY = { id: null, name: '', description: '', sort_order: 0, is_active: true }

export default function AdminApplications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('applications')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    setItems(data || [])
    setLoading(false)
  }

  const openNew = () => { setForm({ ...EMPTY, sort_order: (items.length + 1) * 10 }); setFormOpen(true) }
  const openEdit = (a) => {
    setForm(a)
    setFormOpen(true)
    setTimeout(() => window.scrollTo({ top: 200, behavior: 'smooth' }), 100)
  }
  const closeForm = () => { setFormOpen(false); setForm(EMPTY) }

  const save = async () => {
    if (!form.name.trim()) return toast.error('Nome é obrigatório')
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: !!form.is_active
    }
    const { error } = form.id
      ? await supabase.from('applications').update(payload).eq('id', form.id)
      : await supabase.from('applications').insert(payload)
    setSaving(false)
    if (error) toast.error(error.message)
    else { toast.success(form.id ? 'Aplicação atualizada!' : 'Aplicação criada!'); closeForm(); load() }
  }

  const remove = async (id, name) => {
    if (!confirm(`Excluir a aplicação "${name}"?`)) return
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) toast.error('Erro: ' + error.message)
    else { toast.success('Aplicação excluída'); load() }
  }

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-light)' }}>
            {items.length} aplicação{items.length !== 1 && 'ões'} cadastrada{items.length !== 1 && 's'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Aplicações são os segmentos do produto que a máquina processa (Leite, Soro, Óleo, etc.)
          </p>
        </div>
        {!formOpen && (
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={16} /> Nova Aplicação
          </button>
        )}
      </div>

      {formOpen && (
        <div className="inline-form-card">
          <div className="inline-form-card-head">
            <h3>{form.id ? 'Editar Aplicação' : 'Nova Aplicação'}</h3>
            <button onClick={closeForm} disabled={saving} className="btn btn-ghost btn-xs" style={{ padding: 6 }}>
              <X size={18} />
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nome <span className="required">*</span></label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Leite"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Ordem de exibição</label>
              <input
                type="number"
                className="form-input"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              className="form-textarea"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ minHeight: 60 }}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              className="form-select"
              value={form.is_active ? '1' : '0'}
              onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}
            >
              <option value="1">Ativa</option>
              <option value="0">Inativa</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 8,
            paddingTop: 18,
            borderTop: '1px solid var(--gray-200)'
          }}>
            <button className="btn btn-ghost btn-sm" onClick={closeForm} disabled={saving}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? <><span className="loader sm" /> Salvando...</> : <><Save size={16} /> Salvar</>}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader-wrap"><div className="loader" /></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Droplet size={48} /></div>
          <h3>Nenhuma aplicação cadastrada</h3>
          {!formOpen && (
            <button className="btn btn-primary" onClick={openNew} style={{ marginTop: 16 }}>
              <Plus size={16} /> Adicionar Aplicação
            </button>
          )}
        </div>
      ) : (
        <div className="panel">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Ordem</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map(a => (
                  <tr key={a.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{a.sort_order}</td>
                    <td><strong>{a.name}</strong></td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{a.description || '-'}</td>
                    <td>
                      <span className={`status-badge ${a.is_active ? 'status-approved' : 'status-closed'}`}>
                        {a.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => openEdit(a)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => remove(a.id, a.name)} style={{ color: 'var(--danger)' }}>
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
