/* ============================================================================
   src/components/CentrifugaSpinner.tsx

   A "centrifuguinha girando": um separador de discos visto de cima, com o
   conjunto de pratos rodando, o anel de sólidos girando ao contrário e as
   gotículas sendo lançadas para fora. É SVG puro, sem imagem e sem
   dependência — pesa alguns bytes e escala sem perder nitidez.

   A animação vive no CSS (styles/v81-final.css) para poder ser desligada de
   uma vez em `prefers-reduced-motion`. Com movimento reduzido a peça continua
   desenhada, apenas parada: quem tem sensibilidade a movimento não perde a
   informação, só a rotação.
   ========================================================================== */

type Props = {
  /** lado do quadrado, em px. O desenho escala junto. */
  size?: number
  className?: string
}

export default function CentrifugaSpinner({ size = 92, className = '' }: Props) {
  /* 12 pratos radiais, distribuídos igualmente. Gerado em vez de escrito à
     mão para ficar fácil mudar a contagem. */
  const pratos = Array.from({ length: 12 }, (_, i) => i * 30)
  /* 6 gotículas sendo lançadas, cada uma com um atraso diferente para não
     saírem todas juntas. */
  const gotas = Array.from({ length: 6 }, (_, i) => i * 60)

  return (
    <span
      className={`sep-centrifuga ${className}`.trim()}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Centrífuga girando, indicando trabalho em andamento"
    >
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <defs>
          {/* varredura que dá a sensação de velocidade */}
          <linearGradient id="sepSweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity=".85" />
          </linearGradient>
        </defs>

        {/* ── carcaça externa, parada ─────────────────────────────────── */}
        <circle
          cx="60" cy="60" r="52"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".18"
          strokeWidth="3"
        />

        {/* ── gotículas lançadas para fora ────────────────────────────── */}
        <g className="sep-centrifuga_gotas">
          {gotas.map((ang, i) => (
            <circle
              key={ang}
              cx="60" cy="60" r="2.6"
              fill="#14b8a6"
              style={{
                transformOrigin: '60px 60px',
                transform: `rotate(${ang}deg)`,
                animationDelay: `${i * 0.22}s`,
              }}
            />
          ))}
        </g>

        {/* ── anel de sólidos: gira ao contrário, mais devagar ─────────── */}
        <circle
          className="sep-centrifuga_anel"
          cx="60" cy="60" r="45"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".38"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 14"
        />

        {/* ── conjunto de pratos: o que realmente gira ─────────────────── */}
        <g className="sep-centrifuga_pratos">
          {/* varredura de velocidade */}
          <path
            d="M60 22 A38 38 0 0 1 98 60 L86 60 A26 26 0 0 0 60 34 Z"
            fill="url(#sepSweep)"
          />
          {pratos.map((ang) => (
            <line
              key={ang}
              x1="60" y1="26" x2="60" y2="44"
              stroke="#14b8a6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeOpacity=".9"
              style={{ transformOrigin: '60px 60px', transform: `rotate(${ang}deg)` }}
            />
          ))}
          <circle
            cx="60" cy="60" r="38"
            fill="none"
            stroke="#14b8a6"
            strokeOpacity=".55"
            strokeWidth="2"
          />
        </g>

        {/* ── eixo central, parado ────────────────────────────────────── */}
        <circle cx="60" cy="60" r="16" fill="currentColor" fillOpacity=".08" />
        <circle
          cx="60" cy="60" r="16"
          fill="none"
          stroke="#14b8a6"
          strokeWidth="2.5"
        />
        <circle cx="60" cy="60" r="5" fill="#14b8a6" />
      </svg>
    </span>
  )
}
