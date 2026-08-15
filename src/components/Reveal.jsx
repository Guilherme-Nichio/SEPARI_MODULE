import { useEffect, useRef, useState } from 'react'

/**
 * Reveal animado com variantes para criar experiência de scroll diferenciada.
 *
 * variant: 'fade-up' (default), 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'blur-in'
 * delay: ms antes de iniciar (encadeia revelações)
 * threshold: porção visível pra triggerar (default 0.15)
 */
export default function Reveal({
  children,
  delay = 0,
  variant = 'fade-up',
  threshold = 0.15,
  className = '',
  as: Tag = 'div'
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
