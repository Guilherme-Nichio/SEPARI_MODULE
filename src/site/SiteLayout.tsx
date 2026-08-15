/* ============================================================================
   src/site/SiteLayout.tsx

   Envelope das páginas novas. Faz três coisas:

   1. Aplica as classes de escopo: `.sep-site` (camada de isolamento contra o
      CSS legado) + `.sep-<pagina>` (o CSS daquela página específica).
      Sem isso o CSS de uma página vazaria na outra — a nav da Home é branca
      sobre vídeo, a de Peças é escura sobre fundo claro, e as duas usam
      seletor `nav`.

   2. Marca <html> com `.sep-route` enquanto a rota está montada, para anular
      o `html { font-size: 17px }` e o `scroll-padding-top` do CSS antigo.

   3. Monta a nav e o footer compartilhados em volta do conteúdo.
   ========================================================================== */
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import SiteNav, { type SitePage } from './SiteNav'
import SiteFooter from './SiteFooter'

type Props = {
  page: SitePage
  children: ReactNode
  /** ref opcional para os hooks da página (reveal, faq, steps) */
  containerRef?: RefObject<HTMLDivElement>
}

export default function SiteLayout({ page, children, containerRef }: Props) {
  const localRef = useRef<HTMLDivElement>(null)
  const ref = containerRef ?? localRef

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('sep-route')
    return () => html.classList.remove('sep-route')
  }, [])

  return (
    <div ref={ref} className={`sep-site sep-${page}`}>
      <SiteNav page={page} />
      {children}
      <SiteFooter />
    </div>
  )
}
