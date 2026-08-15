import { useEffect, useState, useRef } from 'react'

/**
 * BrandWordCycle — a "gracinha" da marca: o "S" fica fixo e o restante da
 * palavra vai trocando entre termos que começam com S e remetem a coisas boas
 * (SEPARI → SEPARADORES → SOLUÇÕES → SERVIÇO → SUPORTE → SEGURANÇA ...).
 * Efeito de digitação: apaga o sufixo da palavra atual e digita o da próxima,
 * sempre mantendo o "S" inicial.
 */
const WORDS = [
  'SEPARI',
  'SEPARADORES',
  'SOLUÇÕES',
  'SERVIÇO',
  'SUPORTE',
  'SEGURANÇA',
  'SINTONIA'
]

export default function BrandWordCycle() {
  const [index, setIndex] = useState(0)
  const [suffix, setSuffix] = useState(WORDS[0].slice(1)) // tudo depois do "S"
  const [phase, setPhase] = useState('hold')              // hold | deleting | typing
  const timer = useRef(null)

  useEffect(() => {
    const target = WORDS[index].slice(1)

    if (phase === 'hold') {
      timer.current = setTimeout(() => setPhase('deleting'), 1900)
    } else if (phase === 'deleting') {
      if (suffix.length === 0) {
        const nextIndex = (index + 1) % WORDS.length
        setIndex(nextIndex)
        setPhase('typing')
      } else {
        timer.current = setTimeout(() => setSuffix(suffix.slice(0, -1)), 45)
      }
    } else if (phase === 'typing') {
      if (suffix === target) {
        setPhase('hold')
      } else {
        timer.current = setTimeout(() => setSuffix(target.slice(0, suffix.length + 1)), 70)
      }
    }

    return () => clearTimeout(timer.current)
  }, [phase, suffix, index])

  return (
    <div className="sb-wordcycle" aria-label="SEPARI">
      <span className="sb-wordcycle-fixed">S</span>
      <span className="sb-wordcycle-suffix">{suffix}</span>
      <span className="sb-wordcycle-caret" aria-hidden="true" />
    </div>
  )
}
