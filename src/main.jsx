import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
/* ── Fontes do site novo, self-hosted (não dependem do Google Fonts) ───────── */
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'

import './styles/globals.css'
import './styles/platform.css'
import './styles/v39-additions.css'
import './styles/v40-additions.css'
import './styles/v41-additions.css'
import './styles/v42-redesign.css'
import './styles/v43-final.css'
import './styles/v44-admin-redesign.css'
import './styles/v49-additions.css'
import './styles/v50-additions.css'
import './styles/v51-refresh.css'
import './styles/v52-polish.css'
import './styles/v53-home.css'
import './styles/v54-sobre.css'
import './styles/v55-pages.css'
import './styles/v56-tweaks.css'
import './styles/v57-produtos.css'
import './styles/v58-pecas.css'
import './styles/v59-polish.css'
import './styles/v60-megamenu.css'
import './styles/v61-rotary.css'
import './styles/v62-catalog.css'
import './styles/v63-updates.css'
import './styles/v64-fixes.css'
import './styles/v65-clean.css'
import './styles/v66-revamp.css'
import './styles/v67-revamp2.css'
import './styles/v68-home-font-test.css'
import './styles/v69-breathing.css'
import './styles/v70-brand.css'
import './styles/v71-polish.css'
import './styles/v72-produtos2.css'
import './styles/v73-pecas.css'
import './styles/v74-maquinas.css'
import './styles/v75-hero.css'
import './styles/v76-clean.css'

/* ── Site novo. _base.css PRECISA vir antes das páginas: a especificidade
      empata e quem vem depois vence. E todo este bloco vem depois do CSS
      legado, de propósito. ───────────────────────────────────────────────── */
import './styles/site/_base.css'
import './styles/site/home.css'
import './styles/site/produtos.css'
import './styles/site/pecas.css'
import './styles/site/servicos.css'
import './styles/site/sobre.css'
/* depois das páginas, de propósito: sobrescreve o ::after do hero */
import './styles/site/_hero-scrim.css'
import './styles/site/_layout-fixes.css'
import './styles/site/_legacy-collisions.css'

/* ── v77: responsividade. Precisa ser o ÚLTIMO import de CSS do projeto.
      Ele repete a especificidade das regras originais e depende da ordem da
      cascata para sobrescrever inclusive o que está dentro dos @media das
      páginas. Qualquer CSS importado depois daqui volta a vencê-lo. ──────── */
import './styles/v77-responsive.css'

/* ── v78: correções da nav no celular (hambúrguer na borda, logo menor) e o
      estilo da nova seção da página de Peças. Vem depois do v77 justamente
      para poder corrigi-lo. ─────────────────────────────────────────────── */
import './styles/v78-nav-e-pecas.css'

/* ── v79: páginas novas — estoque de máquinas, segmentos e catálogo pós-login,
      mais os botões de marca no hero da Home. É o ÚLTIMO CSS da fila de
      propósito: os escopos .sep-estoque / .sep-segmentos / .sep-catalogo não
      existem em nenhum arquivo anterior, e estando por último qualquer ajuste
      de responsividade nessas páginas vence sem precisar de !important. ──── */
import './styles/site/v79-estoque-segmentos-catalogo.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '0.95rem',
              fontWeight: 500,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            },
            success: { iconTheme: { primary: '#00A99D', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
