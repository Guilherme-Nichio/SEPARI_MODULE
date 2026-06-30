/**
 * AssemblySequence — ilustra "desde a primeira peça" mostrando, em ordem,
 * a evolução de uma peça solta até a centrífuga montada. SVGs em linha,
 * apenas nas cores da marca (teal/preto/branco). O último estágio recebe
 * destaque (máquina montada).
 */
const STAGES = [
  { label: 'Disco', svg: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="32" cy="40" rx="22" ry="8" />
      <path d="M10 40 L32 18 L54 40" />
      <line x1="32" y1="18" x2="32" y2="26" />
    </svg>
  )},
  { label: 'Conjunto de discos', svg: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 46 L32 30 L52 46" opacity="0.5" />
      <path d="M12 40 L32 24 L52 40" opacity="0.75" />
      <path d="M12 34 L32 18 L52 34" />
      <line x1="32" y1="14" x2="32" y2="50" />
    </svg>
  )},
  { label: 'Bowl', svg: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 22 C16 14, 48 14, 48 22 L44 44 C44 50, 20 50, 20 44 Z" />
      <ellipse cx="32" cy="22" rx="16" ry="5" />
      <line x1="32" y1="8" x2="32" y2="17" />
    </svg>
  )},
  { label: 'Conjunto rotativo', svg: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20 C18 13, 46 13, 46 20 L42 40 C42 46, 22 46, 22 40 Z" />
      <ellipse cx="32" cy="20" rx="14" ry="4.5" />
      <line x1="32" y1="46" x2="32" y2="58" />
      <circle cx="32" cy="58" r="3" />
    </svg>
  )},
  { label: 'Máquina montada', highlight: true, svg: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="10" width="24" height="20" rx="4" />
      <ellipse cx="32" cy="14" rx="12" ry="3.5" />
      <path d="M16 30 L48 30 L44 52 C44 56, 20 56, 20 52 Z" />
      <line x1="32" y1="56" x2="32" y2="60" />
      <line x1="24" y1="60" x2="40" y2="60" />
    </svg>
  )}
]

export default function AssemblySequence() {
  return (
    <div className="assembly-seq" role="list" aria-label="Da peça à máquina montada">
      {STAGES.map((s, i) => (
        <div className="assembly-step-wrap" key={s.label} role="listitem">
          <div className={`assembly-step ${s.highlight ? 'is-final' : ''}`}>
            <span className="assembly-step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="assembly-step-art">{s.svg}</span>
          </div>
          <span className="assembly-step-label">{s.label}</span>
          {i < STAGES.length - 1 && (
            <span className="assembly-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" />
              </svg>
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
