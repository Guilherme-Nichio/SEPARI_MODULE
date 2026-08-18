/* ============================================================================
   src/site/EmBreve.tsx  —  "ESTAMOS TRABALHANDO NESSA PLATAFORMA"

   Três coisas moram aqui:

   1. `EmBreveProvider` — envolve o app inteiro e guarda o aviso (modal) num
      único lugar, para não existirem N cópias dele espalhadas pelas páginas.

   2. `BtnPlataforma` / `LinkPlataforma` — substituem, com uma troca de linha,
      qualquer botão ou link que levaria à área do cliente. Enquanto
      `PLATAFORMA.ativo` for `true` eles não navegam: abrem o aviso, ganham o
      ar de desativado e avisam o leitor de tela. Quando o interruptor virar
      `false`, voltam a navegar exatamente para onde navegavam antes.

   3. `AvisoEmBreve` — o mesmo aviso em versão de bloco, para ocupar o lugar da
      grade de máquinas do estoque e o miolo da página de cadastro.

   Nenhum botão foi apagado do site. O texto, a posição e o desenho continuam
   iguais: só o destino do clique muda enquanto a plataforma não está no ar.
   ========================================================================== */
import {
  createContext, useCallback, useContext, useEffect, useState,
  type ReactNode, type MouseEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import CentrifugaSpinner from '../components/CentrifugaSpinner'
import { PLATAFORMA, CONTATO, waLink, mailLink } from './siteConfig'

/* ══════════════════════════════════════════════════════════════════════════
   CONTEXTO
   ══════════════════════════════════════════════════════════════════════════ */

type Ctx = {
  /** a plataforma do cliente está bloqueada agora? */
  bloqueada: boolean
  /** abre o aviso com a centrifuguinha */
  abrir: () => void
  fechar: () => void
}

const EmBreveCtx = createContext<Ctx>({
  bloqueada: false,
  abrir: () => {},
  fechar: () => {},
})

export const useEmBreve = () => useContext(EmBreveCtx)

export function EmBreveProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const bloqueada = PLATAFORMA.ativo

  const abrir = useCallback(() => setAberto(true), [])
  const fechar = useCallback(() => setAberto(false), [])

  return (
    <EmBreveCtx.Provider value={{ bloqueada, abrir, fechar }}>
      {children}
      {aberto && <ModalEmBreve onClose={fechar} />}
    </EmBreveCtx.Provider>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   O AVISO EM MODAL
   ══════════════════════════════════════════════════════════════════════════ */

function ModalEmBreve({ onClose }: { onClose: () => void }) {
  /* Esc fecha e o fundo para de rolar enquanto o aviso está aberto — mesma
     mecânica do menu do celular, para o comportamento ser previsível. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = anterior
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="sep-embreve_scrim" onClick={onClose}>
      <div
        className="sep-embreve_modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sep-embreve-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="sep-embreve_x"
          aria-label="Fechar aviso"
          onClick={onClose}
          autoFocus
        >
          &#10005;
        </button>

        <CentrifugaSpinner size={96} />

        <h2 id="sep-embreve-titulo">{PLATAFORMA.titulo}</h2>
        <p>{PLATAFORMA.texto}</p>

        <AcoesContato origem="plataforma" />

        <button type="button" className="sep-embreve_voltar" onClick={onClose}>
          Continuar navegando pelo site
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   O AVISO EM BLOCO (estoque, página de cadastro)
   ══════════════════════════════════════════════════════════════════════════ */

export function AvisoEmBreve({
  titulo,
  texto,
  mensagemWhatsapp,
  assuntoEmail,
  children,
}: {
  titulo: string
  texto: string
  mensagemWhatsapp?: string
  assuntoEmail?: string
  /** botões extras, colocados abaixo dos de contato */
  children?: ReactNode
}) {
  return (
    <div className="sep-embreve_bloco">
      <CentrifugaSpinner size={104} />
      <h3>{titulo}</h3>
      <p>{texto}</p>
      <AcoesContato
        origem="bloco"
        mensagemWhatsapp={mensagemWhatsapp}
        assuntoEmail={assuntoEmail}
      />
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   OS CAMINHOS DE CONTATO — sempre os mesmos, sempre o número certo
   ══════════════════════════════════════════════════════════════════════════ */

function AcoesContato({
  origem,
  mensagemWhatsapp,
  assuntoEmail,
}: {
  origem: 'plataforma' | 'bloco'
  mensagemWhatsapp?: string
  assuntoEmail?: string
}) {
  const msg =
    mensagemWhatsapp ??
    'Olá! Vim pelo site da Separi e gostaria de falar com um especialista.'
  const assunto = assuntoEmail ?? 'Contato pelo site'

  return (
    <>
      <div className="sep-embreve_acoes">
        <a
          className="btn btn_solid"
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Falar no WhatsApp
        </a>
        <a className="btn btn_line" href={mailLink(assunto)}>
          Mandar um e-mail
        </a>
      </div>

      <div className="sep-embreve_contatos">
        <a href={CONTATO.telefoneHref}>{CONTATO.telefoneTexto}</a>
        <span aria-hidden="true">·</span>
        <a href={CONTATO.emailHref}>{CONTATO.email}</a>
      </div>
      {origem === 'plataforma' && (
        <p className="sep-embreve_nota">
          Assim que a área do cliente estiver no ar, ela aparece aqui mesmo.
        </p>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   BOTÕES E LINKS QUE LEVAVAM À ÁREA DO CLIENTE
   ══════════════════════════════════════════════════════════════════════════ */

/** Atributos comuns a botão e link enquanto a plataforma está bloqueada. */
const travado = {
  'aria-disabled': true as const,
  'data-embreve': 'true',
  title: PLATAFORMA.textoCurto,
}

/**
 * Botão que levaria à área do cliente.
 * Bloqueado: abre o aviso. Liberado: navega para `to`, como sempre fez.
 */
export function BtnPlataforma({
  to,
  className = 'btn btn_solid',
  children,
  onClick,
}: {
  to: string
  className?: string
  children: ReactNode
  /** ação extra, executada só quando a plataforma está liberada */
  onClick?: () => void
}) {
  const { bloqueada, abrir } = useEmBreve()
  const navigate = useNavigate()

  const clique = () => {
    if (bloqueada) { abrir(); return }
    onClick?.()
    navigate(to)
  }

  return (
    <button
      type="button"
      className={`${className}${bloqueada ? ' is_embreve' : ''}`}
      onClick={clique}
      {...(bloqueada ? travado : {})}
    >
      {children}
    </button>
  )
}

/**
 * Link que levaria à área do cliente (rodapé, listas de navegação).
 * Mantém a aparência de link; bloqueado, abre o aviso em vez de navegar.
 */
export function LinkPlataforma({
  to,
  className,
  children,
}: {
  to: string
  className?: string
  children: ReactNode
}) {
  const { bloqueada, abrir } = useEmBreve()
  const navigate = useNavigate()

  const clique = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (bloqueada) { abrir(); return }
    navigate(to)
  }

  return (
    <a
      href={to}
      className={`${className ?? ''}${bloqueada ? ' is_embreve' : ''}`.trim() || undefined}
      onClick={clique}
      {...(bloqueada ? travado : {})}
    >
      {children}
    </a>
  )
}
