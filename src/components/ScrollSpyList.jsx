import { useEffect, useRef } from 'react'

/**
 * Marca o item da lista que está mais próximo do centro do viewport
 * com a classe .is-active. Permite o efeito de timeline iluminada
 * conforme o usuário rola.
 */
export default function ScrollSpyList({ children, itemSelector = '.spy-item', className = '' }) {
  const wrapperRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const update = () => {
      const items = wrapper.querySelectorAll(itemSelector)
      if (!items.length) return

      const viewportCenter = window.innerHeight * 0.45
      let closest = null
      let closestDist = Infinity

      items.forEach(item => {
        const rect = item.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) return
        const itemCenter = rect.top + rect.height / 2
        const dist = Math.abs(itemCenter - viewportCenter)
        if (dist < closestDist) {
          closestDist = dist
          closest = item
        }
      })

      items.forEach(item => {
        if (item === closest) item.classList.add('is-active')
        else item.classList.remove('is-active')
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
  }, [itemSelector])

  return <div ref={wrapperRef} className={className}>{children}</div>
}
