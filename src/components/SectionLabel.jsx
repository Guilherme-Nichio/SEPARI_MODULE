/**
 * Indicador técnico/industrial de seção: "01 / SETORES ATENDIDOS, 11 SEGMENTOS"
 * Traz a estética de blueprint/painel industrial.
 */
export default function SectionLabel({ number, label, count, onDark = false }) {
  return (
    <div className={`section-label ${onDark ? 'on-dark' : ''}`}>
      <span className="section-label-num">{String(number).padStart(2, '0')}</span>
      <span className="section-label-bar" />
      <span className="section-label-text">{label}</span>
      {count && (
        <>
          <span className="section-label-dot">·</span>
          <span className="section-label-count">{count}</span>
        </>
      )}
    </div>
  )
}
