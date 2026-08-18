import { useState } from 'react'

/**
 * ImageSlot — mostra a imagem real a partir do caminho em /public.
 * Enquanto a imagem não existir, mostra um placeholder com o caminho.
 * Assim que o arquivo é colocado em /public, a imagem aparece e o
 * texto do caminho some automaticamente.
 *
 * src deve ser o caminho público, ex.: "/produtos/vfd.jpg"
 */
export default function ImageSlot({ src, alt = '', tag, tagIcon = null, className = '' }) {
  const [ok, setOk] = useState(true)
  // As etiquetas de canto (tag/tagIcon) foram desativadas a pedido:
  // as imagens aparecem limpas, sem rótulo sobreposto.
  return (
    <div className={`imgslot ${className} ${ok ? 'is-loaded' : 'is-empty'}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setOk(false)}
        style={{ display: ok ? 'block' : 'none' }}
      />
      {!ok && (
        <span className="imgslot-ph">imagem: <code>/public{src}</code></span>
      )}
    </div>
  )
}
