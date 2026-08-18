import { useEffect, useRef } from 'react'

/**
 * Wrapper que aplica parallax sutil ao FILHO marcado com data-parallax.
 * Usa transform: translate3d() para GPU; nada de canvas.
 *
 * Como usar:
 *   <ParallaxSection>
 *     <div data-parallax="0.2">background bonito aqui</div>
 *     <div>conteúdo normal</div>
 *   </ParallaxSection>
 */
export default function ParallaxSection({ children, className = '', ...rest }) {
  const wrapperRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const parallaxItems = wrapper.querySelectorAll('[data-parallax]')
    if (!parallaxItems.length) return

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const update = () => {
      const rect = wrapper.getBoundingClientRect()
      const windowH = window.innerHeight

      if (rect.bottom < 0 || rect.top > windowH) {
        rafRef.current = null
        return
      }

      const progress = (windowH - rect.top) / (windowH + rect.height)

      parallaxItems.forEach(item => {
        const speed = parseFloat(item.dataset.parallax) || 0.2
        const offset = (progress - 0.5) * 100 * speed
        item.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
      })

      rafRef.current = null
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section ref={wrapperRef} className={className} {...rest}>
      {children}
    </section>
  )
}
