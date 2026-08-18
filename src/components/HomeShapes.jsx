/* Símbolos personalizados (cores da marca) para as etapas e para o
   "jogo de formas" da seção de serviços. */

export const PROCESS_SYMBOLS = [
  // 01 — cadastrar máquina (placa + parafusos)
  (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="12" width="28" height="24" rx="3" />
      <circle cx="16" cy="18" r="1.4" fill="currentColor" />
      <circle cx="32" cy="18" r="1.4" fill="currentColor" />
      <line x1="16" y1="26" x2="32" y2="26" />
      <line x1="16" y1="31" x2="26" y2="31" />
    </svg>
  ),
  // 02 — validação (lupa sobre disco)
  (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="21" cy="21" r="11" />
      <path d="M14 23 L21 16 L28 23" />
      <line x1="29.5" y1="29.5" x2="38" y2="38" />
    </svg>
  ),
  // 03 — cotação (lista de itens marcados)
  (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14 L36 14 L36 38 L12 38 Z" />
      <polyline points="16 20 18 22 22 18" />
      <polyline points="16 28 18 30 22 26" />
      <line x1="26" y1="20" x2="32" y2="20" />
      <line x1="26" y1="28" x2="32" y2="28" />
    </svg>
  ),
  // 04 — orçamento (documento com selo)
  (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 10 L28 10 L34 16 L34 38 L14 38 Z" />
      <polyline points="28 10 28 16 34 16" />
      <circle cx="24" cy="27" r="4" />
      <path d="M24 31 L21 36 M24 31 L27 36" />
    </svg>
  )
]

/**
 * OperationShapes — "jogo de formas" que exemplifica o que mantém a operação
 * rodando: três formas geométricas distintas conectadas por um fluxo contínuo
 * (ciclo de manutenção → revisão → recondicionamento). Apenas cores da marca.
 */
export function OperationShapes() {
  const nodes = [
    { title: 'Manutenção preventiva', shape: 'hex' },
    { title: 'Revisão geral', shape: 'gear' },
    { title: 'Recondicionamento', shape: 'rotor' }
  ]
  return (
    <div className="op-shapes" aria-hidden="true">
      <svg className="op-shapes-flow" viewBox="0 0 900 140" preserveAspectRatio="none">
        <path d="M150 70 C 300 0, 600 140, 750 70" fill="none" stroke="currentColor"
          strokeWidth="2" strokeDasharray="3 8" strokeLinecap="round" />
      </svg>
      {nodes.map((n, i) => (
        <div className="op-node" key={i}>
          <span className={`op-shape op-${n.shape}`}>
            {n.shape === 'hex' && (
              <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M40 8 L68 24 L68 56 L40 72 L12 56 L12 24 Z" />
                <path d="M40 24 L56 33 L56 47 L40 56 L24 47 L24 33 Z" opacity="0.5" />
              </svg>
            )}
            {n.shape === 'gear' && (
              <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="40" cy="40" r="16" />
                <circle cx="40" cy="40" r="6" />
                {Array.from({ length: 8 }).map((_, k) => {
                  const a = (k * Math.PI) / 4
                  const x1 = 40 + Math.cos(a) * 18, y1 = 40 + Math.sin(a) * 18
                  const x2 = 40 + Math.cos(a) * 26, y2 = 40 + Math.sin(a) * 26
                  return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />
                })}
              </svg>
            )}
            {n.shape === 'rotor' && (
              <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <circle cx="40" cy="40" r="26" />
                <path d="M40 40 L40 16 M40 40 L61 52 M40 40 L19 52" />
                <circle cx="40" cy="40" r="5" fill="currentColor" stroke="none" />
              </svg>
            )}
          </span>
          <span className="op-node-title">{n.title}</span>
        </div>
      ))}
    </div>
  )
}
