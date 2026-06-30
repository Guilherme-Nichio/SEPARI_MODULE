/**
 * ValuesCycle — os 5 valores dispostos em círculo, ligados por um fluxo
 * que aponta de um para o outro (ciclo). No mobile vira uma lista encadeada.
 */
export default function ValuesCycle({ values }) {
  const n = values.length
  const R = 41 // raio em % do container
  // ângulos a partir do topo, sentido horário
  const ang = (i) => (-90 + (360 / n) * i) * (Math.PI / 180)
  const pos = (i) => ({
    left: `${50 + R * Math.cos(ang(i))}%`,
    top: `${50 + R * Math.sin(ang(i))}%`
  })
  // arcos de seta entre nós consecutivos (na viewBox 0..100)
  const arc = (i) => {
    const r = 41
    const a0 = ang(i), a1 = ang((i + 1) % n)
    // recuar das pontas para não tocar os nós
    const pad = 0.34
    const s0 = a0 + pad, s1 = a1 - pad
    const x0 = 50 + r * Math.cos(s0), y0 = 50 + r * Math.sin(s0)
    const x1 = 50 + r * Math.cos(s1), y1 = 50 + r * Math.sin(s1)
    return { x0, y0, x1, y1, r }
  }

  return (
    <div className="vc">
      <svg className="vc-ring" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <marker id="vc-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 1 L8 5 L0 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        {Array.from({ length: n }).map((_, i) => {
          const a = arc(i)
          return (
            <path
              key={i}
              d={`M ${a.x0} ${a.y0} A ${a.r} ${a.r} 0 0 1 ${a.x1} ${a.y1}`}
              fill="none" stroke="currentColor" strokeWidth="0.9"
              strokeDasharray="2.4 3" strokeLinecap="round"
              markerEnd="url(#vc-arrow)"
            />
          )
        })}
      </svg>

      {values.map((v, i) => (
        <div className="vc-node" key={i} style={pos(i)}>
          <span className="vc-node-icon">{v.icon}</span>
          <strong>{v.title}</strong>
          <span className="vc-node-sub">{v.sub}</span>
        </div>
      ))}
    </div>
  )
}
