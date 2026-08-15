/* ============================================================================
   src/site/hooks/siteHooks.ts

   Os scripts inline das páginas HTML originais, reescritos como hooks.
   Mesma lógica, mesmos thresholds, mesmas classes — só que com cleanup,
   escopados ao container da página (nada de document.querySelectorAll global,
   que colidiria com as páginas da plataforma).
   ========================================================================== */
import { useEffect, useState, type RefObject } from 'react'

/* ---------------------------------------------------------------------------
   nav.scrolled — original:
   const onNav = () => nav.classList.toggle('scrolled', window.scrollY > 40)
   ------------------------------------------------------------------------- */
export function useNavScrolled(offset = 40): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}

/* ---------------------------------------------------------------------------
   .sep_reveal -> adiciona .in quando entra na viewport (uma vez só)
   ------------------------------------------------------------------------- */
export function useReveal(
  ref: RefObject<HTMLElement>,
  threshold = 0.1,
  /* v3.14 — as páginas novas montam cards DEPOIS da resposta do Supabase.
     O observador original só rodava uma vez, no mount: os elementos que
     chegavam depois nunca eram observados e ficavam presos em opacity: 0.
     Passe aqui qualquer valor que mude quando novo conteúdo entra na tela
     (o array de dados, um booleano de loading) e o observador é remontado. */
  dep?: unknown
) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.sep_reveal'))
    if (!targets.length) return

    // Sem IntersectionObserver (ou com motion reduzido), mostra tudo direto.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold }
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ref, threshold, dep])
}

/* ---------------------------------------------------------------------------
   FAQ acordeão — abre um, fecha os outros, anima via max-height
   ------------------------------------------------------------------------- */
export function useFaq(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('.faq_item'))
    if (!items.length) return

    const closeAll = () => {
      items.forEach((i) => {
        i.classList.remove('open')
        const ans = i.querySelector<HTMLElement>('.faq_a')
        if (ans) ans.style.maxHeight = ''
      })
    }

    const cleanups: Array<() => void> = []

    items.forEach((item) => {
      const q = item.querySelector<HTMLElement>('.faq_q')
      const a = item.querySelector<HTMLElement>('.faq_a')
      if (!q || !a) return

      const onClick = () => {
        const wasOpen = item.classList.contains('open')
        closeAll()
        if (!wasOpen) {
          item.classList.add('open')
          a.style.maxHeight = `${a.scrollHeight}px`
        }
      }

      q.addEventListener('click', onClick)
      cleanups.push(() => q.removeEventListener('click', onClick))
    })

    // se a janela mudar de largura, o texto reflui e o max-height fica errado
    const onResize = () => {
      const open = root.querySelector<HTMLElement>('.faq_item.open .faq_a')
      if (open) open.style.maxHeight = `${open.scrollHeight}px`
    }
    window.addEventListener('resize', onResize)
    cleanups.push(() => window.removeEventListener('resize', onResize))

    return () => cleanups.forEach((fn) => fn())
  }, [ref])
}

/* ---------------------------------------------------------------------------
   Serviços: bloco sticky das 5 etapas, dirigido pelo scroll
   ------------------------------------------------------------------------- */
export function useStepsScroll(
  ref: RefObject<HTMLElement>,
  paths: readonly string[]
) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const scrollEl = root.querySelector<HTMLElement>('#stepsScroll')
    if (!scrollEl) return

    const frames = Array.from(root.querySelectorAll<HTMLElement>('.steps_media .frame'))
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.steps_text .panel'))
    const ticks = Array.from(root.querySelectorAll<HTMLElement>('#stepsTicks span'))
    const fill = root.querySelector<HTMLElement>('#stepsFill')
    const badge = root.querySelector<HTMLElement>('#mediaBadge')
    const mediaTag = root.querySelector<HTMLElement>('#mediaTag')
    const total = frames.length
    if (!total) return

    let current = -1

    const setStep = (i: number) => {
      if (i === current) return
      current = i
      frames.forEach((f) => f.classList.toggle('on', Number(f.dataset.i) === i))
      panels.forEach((p) => p.classList.toggle('on', Number(p.dataset.i) === i))
      ticks.forEach((t, k) => t.classList.toggle('on', k <= i))
      if (badge) badge.textContent = String(i + 1).padStart(2, '0')
      if (mediaTag && paths[i]) mediaTag.textContent = paths[i]
    }

    const onScroll = () => {
      const rect = scrollEl.getBoundingClientRect()
      const span = scrollEl.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), span)
      const progress = span > 0 ? scrolled / span : 0
      let idx = Math.floor(progress * total)
      if (idx > total - 1) idx = total - 1
      if (idx < 0) idx = 0
      setStep(idx)
      if (fill) fill.style.width = `${(progress * 100).toFixed(1)}%`
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, paths])
}
