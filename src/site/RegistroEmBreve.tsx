/* ============================================================================
   src/site/RegistroEmBreve.tsx  —  PORTEIRO DO CADASTRO PÚBLICO

   Bloquear os botões resolve 95% dos casos, mas não o visitante que digita
   /registro na barra de endereço, nem o link antigo que alguém já mandou por
   e-mail. Este envelope cobre esse resto.

   O QUE ELE NÃO FAZ
   -----------------
   Não toca na página de login. A equipe e o admin precisam entrar para
   cadastrar as máquinas do estoque e acompanhar os pedidos — se /login também
   fosse bloqueado, vocês ficariam de fora do próprio sistema.

   COMO A EQUIPE TESTA O CADASTRO ANTES DE PUBLICAR
   ------------------------------------------------
   Abra `/registro?acesso=interno`. O formulário de verdade aparece,
   exatamente como está hoje. O endereço fica em PLATAFORMA.chaveBypass, no
   site/siteConfig.ts, e pode ser trocado por outra palavra a qualquer momento.

   PARA LIBERAR PARA TODO MUNDO
   ----------------------------
   Ponha PLATAFORMA.ativo (ou apenas bloquearCadastroPublico) em `false`.
   Este arquivo passa a ser transparente: entrega a página original e pronto.
   ========================================================================== */
import { type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PLATAFORMA } from './siteConfig'
import { AvisoEmBreve } from './EmBreve'
import { R } from './routes'

export default function RegistroEmBreve({ children }: { children: ReactNode }) {
  const [params] = useSearchParams()

  const bloqueado =
    PLATAFORMA.ativo &&
    PLATAFORMA.bloquearCadastroPublico &&
    params.get('acesso') !== PLATAFORMA.chaveBypass

  if (!bloqueado) return <>{children}</>

  return (
    <section className="sep-embreve_pagina">
      <div className="wrap">
        <AvisoEmBreve
          titulo={PLATAFORMA.titulo}
          texto={PLATAFORMA.texto}
          mensagemWhatsapp="Olá! Vim pelo site e gostaria de falar sobre peças e serviços."
          assuntoEmail="Contato pelo site"
        >
          <div className="sep-embreve_extra">
            <Link className="btn btn_line" to={R.home}>
              Voltar para a home
            </Link>
            <Link className="btn btn_line" to={R.pecas}>
              Ver linha de peças
            </Link>
          </div>
        </AvisoEmBreve>
      </div>
    </section>
  )
}
