import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Wrench, Save, X, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const EMPTY = { id: null, name: '', description: '', sort_order: 0, allows_custom: false, is_active: true }

export default function AdminAssemblies() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('mechanical_assemblies')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    if (!error) setItems(data || [])
    setLoading(false)
  }

  const openNew = () => {
    setForm({ ...EMPTY, sort_order: (items.length + 1) * 10 })
    setFormOpen(true)
  }
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
      name: form.name.trim().toUpperCase(),
      description: form.description?.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      allows_custom: !!form.allows_custom,
      is_active: !!form.is_active
    }
    const { error } = form.id
      ? await supabase.from('mechanical_assemblies').update(payload).eq('id', form.id)
      : await supabase.from('mechanical_assemblies').insert(payload)
    setSaving(false)
    if (error) toast.error(error.message)
    else {
      toast.success(form.id ? 'Conjunto atualizado!' : 'Conjunto criado!')
      closeForm()
      load()
    }
  }

  const remove = async (id, name) => {
    if (!confirm(`Excluir o conjunto "${name}"?\n\nIsto pode afetar peças e máquinas que o referenciam.`)) return
    const { error } = await supabase.from('mechanical_assemblies').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir: ' + error.message)
    else { toast.success('Conjunto excluído'); load() }
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
            {items.length} conjunto{items.length !== 1 && 's'} mecânico{items.length !== 1 && 's'} ·{' '}
            {items.filter(i => i.is_active).length} ativos
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Os conjuntos aparecem para o cliente ao cadastrar uma máquina e para você ao cadastrar uma peça.
          </p>
        </div>
        {!formOpen && (
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={16} /> Novo Conjunto
          </button>
        )}
      </div>

      {formOpen && (
        <div className="inline-form-card">
          <div className="inline-form-card-head">
            <h3>{form.id ? 'Editar Conjunto' : 'Novo Conjunto Mecânico'}</h3>
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
                placeholder="Ex: CARCAÇA COMPLETA"
                autoFocus
              />
              <span className="form-help">Será convertido para MAIÚSCULAS automaticamente.</span>
            </div>
            <div className="form-group">
              <label>Ordem de exibição</label>
              <input
                type="number"
                className="form-input"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                placeholder="0, 10, 20..."
              />
              <span className="form-help">Menor = aparece primeiro.</span>
            </div>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              className="form-textarea"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descrição opcional"
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.allows_custom}
                  onChange={(e) => setForm({ ...form, allows_custom: e.target.checked })}
                />
                Permitir nome personalizado
              </label>
              <span className="form-help">
                Ative para conjuntos como "OUTROS A DEFINIR", o cliente poderá digitar um nome próprio.
              </span>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-select"
                value={form.is_active ? '1' : '0'}
                onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}
              >
                <option value="1">Ativo (visível para clientes)</option>
                <option value="0">Inativo</option>
              </select>
            </div>
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
          <div className="empty-state-icon"><Wrench size={48} /></div>
          <h3>Nenhum conjunto cadastrado</h3>
          <p>Adicione os conjuntos mecânicos que estarão disponíveis para os clientes.</p>
          {!formOpen && (
            <button className="btn btn-primary" onClick={openNew} style={{ marginTop: 16 }}>
              <Plus size={16} /> Adicionar Conjunto
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
                  <th>Personalizado?</th>
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
                      {a.allows_custom ? (
                        <span className="status-badge status-in_progress">Permite custom</span>
                      ) : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${a.is_active ? 'status-approved' : 'status-closed'}`}>
                        {a.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => openEdit(a)} title="Editar">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => remove(a.id, a.name)} title="Excluir" style={{ color: 'var(--danger)' }}>
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
