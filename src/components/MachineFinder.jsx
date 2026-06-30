import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'
import {
  MANUFACTURERS, getManufacturerTypes, getModels, slugify
} from '../data/catalog.js'

/**
 * Formulário simples (em lista): Fabricante → Tipo → Modelo → Buscar.
 * Leva à página personalizada do modelo escolhido.
 */
export default function MachineFinder() {
  const navigate = useNavigate()
  const [brand, setBrand] = useState('')
  const [type, setType] = useState('')
  const [model, setModel] = useState('')

  const types = useMemo(() => (brand ? getManufacturerTypes(brand) : []), [brand])
  const models = useMemo(() => (brand ? getModels(brand, type) : []), [brand, type])

  const onBrand = (e) => { setBrand(e.target.value); setType(''); setModel('') }
  const onType = (e) => { setType(e.target.value); setModel('') }

  const submit = (e) => {
    e.preventDefault()
    if (brand && model) navigate(`/maquina/${brand}/${slugify(model)}`)
  }

  return (
    <form className="sf" onSubmit={submit}>
      <div className="sf-row">
        <label htmlFor="sf-brand">Fabricante</label>
        <div className="sf-select">
          <select id="sf-brand" value={brand} onChange={onBrand}>
            <option value="">Selecione o fabricante</option>
            {MANUFACTURERS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
          <ChevronDown size={18} />
        </div>
      </div>

      <div className="sf-row">
        <label htmlFor="sf-type">Tipo</label>
        <div className="sf-select">
          <select id="sf-type" value={type} onChange={onType} disabled={!brand}>
            <option value="">{brand ? 'Todos os tipos' : 'Selecione o fabricante primeiro'}</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={18} />
        </div>
      </div>

      <div className="sf-row">
        <label htmlFor="sf-model">Modelo</label>
        <div className="sf-select">
          <select id="sf-model" value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand}>
            <option value="">{brand ? 'Selecione o modelo' : 'Selecione o fabricante primeiro'}</option>
            {models.map((m) => <option key={m.model} value={m.model}>{m.model}</option>)}
          </select>
          <ChevronDown size={18} />
        </div>
      </div>

      <button type="submit" className="sf-btn" disabled={!brand || !model}>
        <Search size={18} /> Buscar máquina
      </button>

      <p className="sf-help">
        Não sabe o modelo? <Link to="/fabricantes">Veja a lista por fabricante</Link>.
      </p>
    </form>
  )
}
