import { useEffect, useRef, useState } from 'react'

/**
 * Contador animado que conta de 0 até `end` quando entra no viewport.
 * Estética: looks like a gauge/measurement readout.
 */
export default function CounterUp({ end = 100, duration = 1500, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setVal(Math.floor(end * eased))
            if (progress < 1) requestAnimationFrame(animate)
            else setVal(end)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className="counter-up">
      {prefix}{val.toLocaleString('pt-BR')}{suffix}
    </span>
  )
}
