import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Save, Camera, FileText, X, ArrowLeft, ArrowRight,
  Info, Star, ImagePlus, CheckCircle2, Settings,
  Hash, Layers, Cog, Building2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase, uploadFile } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'

const EMPTY = {
  machine_model_id: '',
  serial_number: '',
  application_id: '',
  photo: null,
  photoPreview: null,
  extraPhotos: [],
  manual: null,
  manualName: '',
  assemblyIds: [],
  customAssemblyName: ''
}

export default function MaquinaNova() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [machineModels, setMachineModels] = useState([])
  const [applications, setApplications] = useState([])
  const [assemblies, setAssemblies] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)

  const [form, setForm] = useState(EMPTY)
  const fileMainRef = useRef(null)
  const fileExtrasRef = useRef(null)
  const fileManualRef = useRef(null)

  useEffect(() => { loadAux() }, [])

  const loadAux = async () => {
    setLoading(true)
    const [
      { data: modelsData },
      { data: appsData },
      { data: asmData }
    ] = await Promise.all([
      supabase.from('machine_models').select('*').order('brand'),
      supabase.from('applications').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('mechanical_assemblies').select('*').eq('is_active', true).order('sort_order')
    ])
    setMachineModels(modelsData || [])
    setApplications(appsData || [])
    setAssemblies(asmData || [])
    setLoading(false)
  }

  // ── Foto principal ──
  const onPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Imagem máx. 5MB')
    if (!file.type.startsWith('image/')) return toast.error('Selecione uma imagem')
    const reader = new FileReader()
    reader.onload = () => setForm(prev => ({ ...prev, photo: file, photoPreview: reader.result }))
    reader.readAsDataURL(file)
  }
  const removePhoto = () => {
    setForm(prev => ({ ...prev, photo: null, photoPreview: null }))
    if (fileMainRef.current) fileMainRef.current.value = ''
  }

  // ── Fotos extras ──
  const onMultiExtras = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const valid = []
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) return toast.error(`${file.name}: máx. 5MB`)
      if (!file.type.startsWith('image/')) return
      valid.push(file)
    })
    if (valid.length === 0) {
      e.target.value = ''
      return
    }
    Promise.all(valid.map(file => new Promise((res) => {
      const r = new FileReader()
      r.onload = () => res({
        id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: r.result
      })
      r.readAsDataURL(file)
    }))).then(results => {
      setForm(prev => ({ ...prev, extraPhotos: [...prev.extraPhotos, ...results] }))
      e.target.value = ''
    })
  }
  const removeExtra = (id) =>
    setForm(prev => ({ ...prev, extraPhotos: prev.extraPhotos.filter(x => x.id !== id) }))
  const promoteExtra = (id) => {
    setForm(prev => {
      const extra = prev.extraPhotos.find(x => x.id === id)
      if (!extra) return prev
      const newExtras = prev.extraPhotos.filter(x => x.id !== id)
      if (prev.photo && prev.photoPreview) {
        newExtras.push({
          id: `tmp-${Date.now()}-prom`,
          file: prev.photo,
          preview: prev.photoPreview
        })
      }
      return {
        ...prev,
        photo: extra.file,
        photoPreview: extra.preview,
        extraPhotos: newExtras
      }
    })
  }

  // ── Manual ──
  const onManual = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 20 * 1024 * 1024) return toast.error('PDF máx. 20MB')
    if (file.type !== 'application/pdf') return toast.error('Selecione um PDF')
    setForm({ ...form, manual: file, manualName: file.name })
  }
  const removeManual = () => {
    setForm(prev => ({ ...prev, manual: null, manualName: '' }))
    if (fileManualRef.current) fileManualRef.current.value = ''
  }

  // ── Conjuntos ──
  const toggleAssembly = (id) => {
    setForm(prev => ({
      ...prev,
      assemblyIds: prev.assemblyIds.includes(id)
        ? prev.assemblyIds.filter(x => x !== id)
        : [...prev.assemblyIds, id]
    }))
  }
  const selectedCustom = form.assemblyIds
    .map(id => assemblies.find(a => a.id === id))
    .find(a => a && a.allows_custom)

  // ── Validação por step ──
  const validateStep = (s) => {
    if (s === 1) {
      if (!form.machine_model_id) return 'Selecione o modelo da máquina'
      if (!form.serial_number.trim()) return 'Informe o número de série'
      if (!form.application_id) return 'Selecione a aplicação'
    }
    if (s === 2) {
      if (!form.photo) return 'A foto da plaqueta é obrigatória'
    }
    // Step 3 é opcional (apenas manual)
    if (s === 3) {
      return null
    }
    return null
  }

  const goNext = () => {
    const err = validateStep(step)
    if (err) return toast.error(err)
    setStep(s => Math.min(4, s + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goPrev = () => {
    setStep(s => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Submit final ──
  const submit = async () => {
    const errStep1 = validateStep(1)
    if (errStep1) { setStep(1); return toast.error(errStep1) }
    const errStep2 = validateStep(2)
    if (errStep2) { setStep(2); return toast.error(errStep2) }
    const errStep3 = validateStep(3)
    if (errStep3) { setStep(3); return toast.error(errStep3) }

    setSaving(true)
    try {
      const { url: photoUrl } = await uploadFile('machine-photos', form.photo, `${user.id}/`)

      let manualUrl = null
      if (form.manual) {
        const { url } = await uploadFile('machine-manuals', form.manual, `${user.id}/`)
        manualUrl = url
      }

      const { data: machine, error } = await supabase.from('user_machines').insert({
        user_id: user.id,
        machine_model_id: form.machine_model_id,
        serial_number: form.serial_number.trim(),
        photo_url: photoUrl,
        manual_url: manualUrl,
        application_id: form.application_id,
        status: 'pending'
      }).select().single()
      if (error) throw error

      if (form.assemblyIds.length > 0) {
        const rows = form.assemblyIds.map(asmId => {
          const asm = assemblies.find(a => a.id === asmId)
          return {
            user_machine_id: machine.id,
            assembly_id: asmId,
            custom_name: asm?.allows_custom ? form.customAssemblyName.trim() : null
          }
        })
        const { error: aErr } = await supabase.from('user_machine_assemblies').insert(rows)
        if (aErr) console.warn('Erro ao salvar conjuntos:', aErr)
      }

      // Fotos extras
      if (form.extraPhotos.length > 0) {
        const extraRows = []
        for (let i = 0; i < form.extraPhotos.length; i++) {
          const extra = form.extraPhotos[i]
          try {
            const { url } = await uploadFile('machine-photos', extra.file, `${user.id}/`)
            extraRows.push({
              user_machine_id: machine.id,
              image_url: url,
              sort_order: i
            })
          } catch (err) {
            console.error('Erro ao subir foto extra', err)
          }
        }
        if (extraRows.length > 0) {
          const { error: photosErr } = await supabase.from('user_machine_photos').insert(extraRows)
          if (photosErr) console.warn('Erro ao salvar fotos extras:', photosErr)
        }
      }

      toast.success('Máquina cadastrada! Em breve nossa equipe vai aprovar.')
      navigate('/perfil')
    } catch (err) {
      toast.error(err.message || 'Erro ao cadastrar')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <section className="dashboard">
        <div className="container">
          <div className="loader-wrap"><div className="loader" /></div>
        </div>
      </section>
    )
  }

  const selectedModel = machineModels.find(m => m.id === form.machine_model_id)
  const selectedApp = applications.find(a => a.id === form.application_id)

  return (
    <section className="dashboard">
      <Seo title="Cadastrar Nova Máquina · Separi" noIndex />
      <div className="container" style={{ paddingBottom: 80 }}>

        <Breadcrumbs items={[
          { label: 'Minha Conta', to: '/perfil' },
          { label: 'Cadastrar máquina' }
        ]} />

        <div className="machine-wizard">

          {/* HEADER */}
          <div className="machine-wizard-header">
            <span className="machine-wizard-eyebrow">
              <Settings size={14} /> Cadastro de equipamento
            </span>
            <h1 className="machine-wizard-title">Cadastrar nova máquina</h1>
            <p className="machine-wizard-sub">
              Em 3 passos rápidos, nossa equipe técnica recebe seu equipamento na fila de
              aprovação. Depois disso, você passa a ver o catálogo de peças e kits
              compatíveis.
            </p>
          </div>

          {/* STEPPER */}
          <div className="machine-wizard-stepper">
            {[
              { n: 1, label: 'Identificação' },
              { n: 2, label: 'Fotos' },
              { n: 3, label: 'Manual' },
              { n: 4, label: 'Revisão' }
            ].map(s => {
              const cls = step > s.n ? 'done' : step === s.n ? 'current' : ''
              return (
                <div key={s.n} className={`machine-wizard-step ${cls}`}>
                  <div className="machine-wizard-step-circle">
                    {step > s.n ? <CheckCircle2 size={20} /> : s.n}
                  </div>
                  <div className="machine-wizard-step-label">{s.label}</div>
                </div>
              )
            })}
          </div>

          {/* STEP 1: IDENTIFICAÇÃO */}
          {step === 1 && (
            <div className="machine-wizard-panel">
              <div className="machine-wizard-panel-head">
                <div className="machine-wizard-panel-icon"><Hash size={20} /></div>
                <div className="machine-wizard-panel-title">
                  <h2>Identificação da máquina</h2>
                  <p>Modelo, número de série e aplicação principal.</p>
                </div>
              </div>

              <div className="form-group">
                <label>Modelo da máquina <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select
                  className="form-select"
                  value={form.machine_model_id}
                  onChange={(e) => setForm({ ...form, machine_model_id: e.target.value })}
                >
                  <option value="">Selecione um modelo</option>
                  {machineModels.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.brand} · {m.model}{m.category ? ` (${m.category})` : ''}
                    </option>
                  ))}
                </select>
                <span className="form-help">
                  Não encontrou o modelo? Selecione o mais próximo e descreva nas observações depois.
                </span>
              </div>

              <div className="form-group">
                <label>Número de série <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 89234561"
                  value={form.serial_number}
                  onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                />
                <span className="form-help">
                  Encontra-se na placa de identificação do equipamento.
                </span>
              </div>

              <div className="form-group">
                <label>Aplicação principal <span style={{ color: 'var(--danger)' }}>*</span></label>
                <div className="select-grid">
                  {applications.map(a => (
                    <button
                      key={a.id}
                      type="button"
                      className={`select-card ${form.application_id === a.id ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, application_id: a.id })}
                    >
                      <div className="select-card-title">
                        <Building2 size={14} /> {a.name}
                      </div>
                      {a.description && <div className="select-card-sub">{a.description}</div>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="machine-wizard-actions">
                <button className="btn btn-ghost" onClick={() => navigate('/perfil')}>
                  <ArrowLeft size={16} /> Cancelar
                </button>
                <button className="btn btn-primary" onClick={goNext}>
                  Próximo passo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FOTOS */}
          {step === 2 && (
            <div className="machine-wizard-panel">
              <div className="machine-wizard-panel-head">
                <div className="machine-wizard-panel-icon"><Camera size={20} /></div>
                <div className="machine-wizard-panel-title">
                  <h2>Fotos da máquina</h2>
                  <p>Uma foto da plaqueta (obrigatória) e até várias fotos extras (opcional).</p>
                </div>
              </div>

              <label style={{ display: 'block', marginBottom: 12, fontSize: '0.92rem', fontWeight: 600 }}>
                Foto da plaqueta <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div
                className={`photo-drop ${form.photoPreview ? 'has-photo' : ''}`}
                onClick={() => fileMainRef.current?.click()}
              >
                {form.photoPreview ? (
                  <>
                    <img src={form.photoPreview} alt="Preview" />
                    <button
                      type="button"
                      className="photo-drop-remove"
                      onClick={(e) => { e.stopPropagation(); removePhoto() }}
                      aria-label="Remover foto"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="photo-drop-placeholder">
                    <div className="photo-drop-placeholder-icon">
                      <Camera size={26} />
                    </div>
                    <strong>Clique para enviar a foto da plaqueta</strong>
                    <span>JPG, PNG ou WEBP até 5 MB</span>
                  </div>
                )}
                <input
                  ref={fileMainRef}
                  type="file"
                  accept="image/*"
                  onChange={onPhoto}
                  style={{ display: 'none' }}
                />
              </div>

              <label style={{ display: 'block', marginTop: 28, marginBottom: 12, fontSize: '0.92rem', fontWeight: 600 }}>
                Fotos extras <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.86rem' }}>(opcional: placa, detalhes, problemas)</span>
              </label>
              <div className="extras-grid">
                {form.extraPhotos.map(ex => (
                  <div key={ex.id} className="extras-grid-item">
                    <img src={ex.preview} alt="" />
                    <div className="extras-grid-item-actions">
                      <button
                        type="button"
                        className="extras-grid-item-btn"
                        onClick={() => promoteExtra(ex.id)}
                        aria-label="Tornar foto principal"
                        title="Tornar foto principal"
                      >
                        <Star size={14} />
                      </button>
                      <button
                        type="button"
                        className="extras-grid-item-btn danger"
                        onClick={() => removeExtra(ex.id)}
                        aria-label="Remover"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="extras-add"
                  onClick={() => fileExtrasRef.current?.click()}
                >
                  <ImagePlus size={20} />
                  <span>Adicionar fotos</span>
                </button>
                <input
                  ref={fileExtrasRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onMultiExtras}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="wizard-hint">
                <Info size={16} className="wizard-hint-icon" />
                <div className="wizard-hint-text">
                  <strong>Dica:</strong> Fotos boas aceleram a aprovação. Tire em local iluminado,
                  centralizando a placa de identificação e mostrando o estado geral.
                </div>
              </div>

              <div className="machine-wizard-actions">
                <button className="btn btn-ghost" onClick={goPrev}>
                  <ArrowLeft size={16} /> Voltar
                </button>
                <button className="btn btn-primary" onClick={goNext}>
                  Próximo passo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETALHES (OPCIONAL — apenas manual) */}
          {step === 3 && (
            <div className="machine-wizard-panel">
              <div className="machine-wizard-panel-head">
                <div className="machine-wizard-panel-icon"><FileText size={20} /></div>
                <div className="machine-wizard-panel-title">
                  <h2>Manual da máquina</h2>
                  <p>Opcional. Anexar o manual técnico ajuda nossa engenharia a identificar a máquina mais rápido.</p>
                </div>
              </div>

              <label style={{ display: 'block', marginBottom: 12, fontSize: '0.92rem', fontWeight: 600 }}>
                Manual técnico em PDF <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.86rem' }}>(opcional)</span>
              </label>
              <div
                className={`manual-drop ${form.manual ? 'has-file' : ''}`}
                onClick={() => fileManualRef.current?.click()}
              >
                <div className="manual-drop-icon">
                  <FileText size={22} />
                </div>
                <div className="manual-drop-info">
                  {form.manual ? (
                    <>
                      <strong>{form.manualName}</strong>
                      <span>Clique para trocar o arquivo</span>
                    </>
                  ) : (
                    <>
                      <strong>Anexar manual em PDF</strong>
                      <span>Máximo 20 MB. Ajuda na identificação técnica.</span>
                    </>
                  )}
                </div>
                {form.manual && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={(e) => { e.stopPropagation(); removeManual() }}
                  >
                    <X size={14} />
                  </button>
                )}
                <input
                  ref={fileManualRef}
                  type="file"
                  accept="application/pdf"
                  onChange={onManual}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="machine-wizard-actions">
                <button className="btn btn-ghost" onClick={goPrev}>
                  <ArrowLeft size={16} /> Voltar
                </button>
                <button className="btn btn-primary" onClick={goNext}>
                  Próximo passo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVISÃO E CONFIRMAÇÃO */}
          {step === 4 && (
            <div className="machine-wizard-panel">
              <div className="machine-wizard-panel-head">
                <div className="machine-wizard-panel-icon"><CheckCircle2 size={20} /></div>
                <div className="machine-wizard-panel-title">
                  <h2>Revisar e confirmar</h2>
                  <p>Confira os dados antes de enviar para a fila de aprovação.</p>
                </div>
              </div>

              <div className="wizard-review">
                <div className="wizard-review-item">
                  <div className="wizard-review-item-label">Modelo</div>
                  <div className="wizard-review-item-value">
                    {selectedModel ? `${selectedModel.brand} · ${selectedModel.model}` : '—'}
                  </div>
                </div>
                <div className="wizard-review-item">
                  <div className="wizard-review-item-label">Número de série</div>
                  <div className="wizard-review-item-value">{form.serial_number || '—'}</div>
                </div>
                <div className="wizard-review-item">
                  <div className="wizard-review-item-label">Aplicação</div>
                  <div className="wizard-review-item-value">{selectedApp?.name || '—'}</div>
                </div>
                <div className="wizard-review-item span-2">
                  <div className="wizard-review-item-label">Fotos enviadas</div>
                  <div className="wizard-review-item-value">
                    1 plaqueta{form.extraPhotos.length > 0 && ` + ${form.extraPhotos.length} extra${form.extraPhotos.length > 1 ? 's' : ''}`}
                    {form.manual && ` · 1 manual PDF`}
                  </div>
                </div>
              </div>

              {form.photoPreview && (
                <div style={{
                  marginTop: 20,
                  aspectRatio: '16/9',
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1px solid var(--gray-200)'
                }}>
                  <img src={form.photoPreview} alt="Foto da plaqueta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div className="wizard-hint" style={{ marginTop: 20 }}>
                <Info size={16} className="wizard-hint-icon" />
                <div className="wizard-hint-text">
                  Após enviar, sua máquina entrará na <strong>fila de aprovação</strong>. Nossa equipe
                  valida em poucos dias úteis e libera seu acesso ao catálogo de peças compatíveis.
                </div>
              </div>

              <div className="machine-wizard-actions">
                <button className="btn btn-ghost" onClick={goPrev} disabled={saving}>
                  <ArrowLeft size={16} /> Voltar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={submit}
                  disabled={saving}
                  style={{ minWidth: 220 }}
                >
                  {saving
                    ? <><span className="loader sm" /> Enviando...</>
                    : <><Save size={16} /> Enviar para aprovação</>
                  }
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
