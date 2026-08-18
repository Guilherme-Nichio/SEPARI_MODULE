/* ============================================================================
   src/site/MachineFinderBox.tsx

   O buscador de máquina da página de Peças. O HTML original tinha três <select>
   com opções fixas e um script que trocava innerHTML. Aqui o markup é o mesmo
   (mesmas classes .finder_box / .finder_grid / .ffield / .sel / .fbtn e mesmos
   ids), mas as opções vêm de src/data/catalog.js — a mesma fonte que a
   plataforma usa — e o botão navega para /maquina/:marca/:modelo, que é a
   página de resultado que já existe no sistema.
   ========================================================================== */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MANUFACTURERS,
  getManufacturerTypes,
  getModels,
  slugify,
} from '../data/catalog.js'
import { R, external } from './routes'

type Model = { model: string; type: string }
type Manufacturer = { slug: string; name: string }

export default function MachineFinderBox() {
  const navigate = useNavigate()
  const [brand, setBrand] = useState('')
  const [type, setType] = useState('')
  const [model, setModel] = useState('')

  const brands = MANUFACTURERS as Manufacturer[]

  const types = useMemo<string[]>(
    () => (brand ? (getManufacturerTypes(brand) as string[]) : []),
    [brand]
  )

  const models = useMemo<Model[]>(
    () => (brand ? (getModels(brand, type || undefined) as Model[]) : []),
    [brand, type]
  )

  const onBrand = (v: string) => {
    setBrand(v)
    setType('')
    setModel('')
  }

  const onType = (v: string) => {
    setType(v)
    setModel('')
  }

  const search = () => {
    if (brand && model) navigate(`/maquina/${brand}/${slugify(model)}`)
    else if (brand) navigate(`${R.fabricantes}/${brand}`)
    else navigate(R.fabricantes)
  }

  return (
    <div className="finder_box sep_reveal">
      <div className="finder_grid">
        <div className="ffield">
          <label htmlFor="fMaker">Fabricante</label>
          <select
            className="sel"
            id="fMaker"
            value={brand}
            onChange={(e) => onBrand(e.target.value)}
          >
            <option value="">Selecione o fabricante</option>
            {brands.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ffield">
          <label htmlFor="fType">Tipo</label>
          <select
            className="sel"
            id="fType"
            value={type}
            disabled={!brand}
            onChange={(e) => onType(e.target.value)}
          >
            {brand ? (
              <>
                <option value="">Todos os tipos</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </>
            ) : (
              <option value="">Selecione o fabricante primeiro</option>
            )}
          </select>
        </div>

        <div className="ffield">
          <label htmlFor="fModel">Modelo</label>
          <select
            className="sel"
            id="fModel"
            value={model}
            disabled={!brand}
            onChange={(e) => setModel(e.target.value)}
          >
            {brand ? (
              <>
                <option value="">Todos os modelos</option>
                {models.map((m) => (
                  <option key={m.model} value={m.model}>
                    {m.model}
                  </option>
                ))}
              </>
            ) : (
              <option value="">Selecione o fabricante primeiro</option>
            )}
          </select>
        </div>

        <button className="btn btn_solid fbtn" onClick={search}>
          Buscar máquina
        </button>
      </div>

      <p className="hint">
        Não sabe o modelo? Mande a foto da placa de identificação no{' '}
        <a {...external} href={R.whatsapp}>
          WhatsApp
        </a>{' '}
        que a engenharia identifica para você.
      </p>
    </div>
  )
}
