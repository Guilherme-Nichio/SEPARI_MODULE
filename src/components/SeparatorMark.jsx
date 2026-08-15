/**
 * SeparatorMark — ícone vetorial inspirado no empilhamento de discos de uma
 * separadora centrífuga (disc stack). Usado como motivo de marca em eyebrows,
 * dropdowns e divisores. Stroke fino para combinar com a tipografia minimalista.
 */
export default function SeparatorMark({ size = 18, strokeWidth = 1.5, className = '', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* eixo central */}
      <line x1="12" y1="3" x2="12" y2="21" opacity="0.55" />
      {/* discos empilhados (cones da separadora) */}
      <path d="M4 7.5 L12 5 L20 7.5" />
      <path d="M4 11 L12 8.5 L20 11" opacity="0.85" />
      <path d="M4 14.5 L12 12 L20 14.5" opacity="0.7" />
      <path d="M5.5 18 L12 16 L18.5 18" opacity="0.55" />
    </svg>
  )
}
