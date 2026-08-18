/* ============================================================================
   src/components/PlatformNav.jsx  —  a barra do SITE dentro da plataforma

   POR QUE ESTE ARQUIVO EXISTE
   ---------------------------
   As páginas pós-login do cliente (/perfil, /cotacao, /meus-pedidos e o
   catálogo legado) ainda montavam a <Navbar /> antiga: a barra verde fina no
   topo com "Ver catálogo / Máquinas Separi" e um mega-menu apontando para
   páginas que não existem mais (/produtos/separadoras, /produtos#bowls,
   /equipamentos...). Resultado: quem entrava na conta trocava de site.

   Aqui a barra passa a ser EXATAMENTE a mesma do resto do site — o próprio
   <SiteNav />, sem cópia de markup. Os links vêm da mesma lista (routes.ts),
   então nunca mais saem de sincronia.

   COMO FUNCIONA
   -------------
   O CSS do site novo é escopado: as regras da barra escura sobre fundo claro
   moram em `.sep-catalogo nav` (v79) e as do menu deslizante do celular em
   `.sep-site .nav_drawer` (v77/v78). Envolver o <SiteNav /> nessas duas
   classes é o que faz a barra ficar idêntica à de /estoque, /segmentos e
   /catalogo, sem duplicar uma linha de estilo.

   `.sep-site` também traz a camada de isolamento contra o CSS legado
   (styles/site/_base.css), que é justamente o que impede a plataforma de
   vazar fonte e margem para dentro da barra.

   O <nav> é `position: fixed`, então não ocupa altura no fluxo. Quem reserva
   o espaço é o `.plat_nav_spacer` — antes esse papel era do padding-top de
   136px do ClientNav, calculado para a altura da barra antiga. Ver
   styles/site/v80-nav-cliente-e-sobre.css.
   ========================================================================== */
import SiteNav from '../site/SiteNav'

export default function PlatformNav() {
  return (
    <>
      <div className="sep-site sep-catalogo sep-plat-nav">
        <SiteNav page="catalogo" />
      </div>
      <div className="plat_nav_spacer" aria-hidden="true" />
    </>
  )
}
