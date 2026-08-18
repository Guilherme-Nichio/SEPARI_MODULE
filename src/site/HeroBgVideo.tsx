/* ============================================================================
   src/site/HeroBgVideo.tsx  —  VÍDEO DE FUNDO DO HERO

   Um único componente para as QUATRO páginas com hero de vídeo: Home,
   Produtos, Serviços e Sobre. Antes cada página tinha a sua própria cópia do
   markup, com medidas e camadas ligeiramente diferentes — e uma delas com o
   `type` escrito errado, o que fazia o navegador recusar o arquivo.

   As três camadas, sempre na mesma ordem:

       1. vídeo      (z-index 1)  ← este componente
       2. véu verde  (z-index 2)  ← este componente
       3. texto      (z-index 3)  ← a página, com `zIndex: 3` no .hero_inner

   POR QUE `object-fit: cover` E NÃO O TRUQUE DO 100vw/56.25vw
   -----------------------------------------------------------
   O truque antigo dimensionava o vídeo pela LARGURA DA JANELA e depois o
   centralizava. Funciona no desktop, mas no celular o hero quase nunca tem a
   altura da janela inteira (o navegador esconde e mostra a barra de
   endereço), então sobrava vídeo para fora em cima e embaixo — decodificando
   pixels que ninguém vê e gastando bateria. `object-fit: cover` recorta
   exatamente a caixa do hero, seja ela qual for, em qualquer tela.

   GARANTIAS PARA O VÍDEO APARECER MESMO
   -------------------------------------
   · `muted` é forçado como ATRIBUTO, não só como propriedade do React — sem
     isso o Chrome avalia a política de autoplay antes de o React marcar o
     elemento e bloqueia a reprodução em silêncio;
   · `playsInline` impede o iPhone de abrir o vídeo em tela cheia;
   · se o navegador bloquear mesmo assim, o primeiro toque na tela dá play;
   · se o arquivo faltar ou o codec não for suportado, o componente some e a
     página cai no fundo que já existia (imagem ou gradiente), sem buraco;
   · com `prefers-reduced-motion`, mostra o poster parado em vez do vídeo.
   ========================================================================== */
import { useEffect, useRef, useState } from 'react'
import { VIDEO, type VideoKey } from './assets'

/* O véu verde da marca, idêntico ao que estava inline em cada página. */
const SCRIM =
  'linear-gradient(180deg, rgba(6,46,42,.72) 0%, rgba(6,46,42,.34) 45%, rgba(6,46,42,.68) 100%),' +
  'linear-gradient(142deg, rgba(20,184,166,.28) 0%, rgba(20,184,166,.10) 50%, rgba(6,46,42,0) 80%)'

type Props = {
  /** qual vídeo, do manifesto em assets.ts */
  slot: VideoKey
  /** desenha o véu verde por cima do vídeo. Deixe `false` quando o CSS da
   *  página já tem o seu próprio véu no `.hero::after`. */
  scrim?: boolean
  /** camada do vídeo. O véu entra sempre uma acima. */
  zIndex?: number
  /** aproximação da imagem, para esconder bordas ou marca d'água. 1 = sem zoom */
  zoom?: number
}

export default function HeroBgVideo({
  slot,
  scrim = true,
  zIndex = 1,
  zoom = 1,
}: Props) {
  const v = VIDEO[slot]
  const ref = useRef<HTMLVideoElement>(null)
  const [falhou, setFalhou] = useState(false)

  /* Movimento reduzido: nada de vídeo em loop. Lido uma vez, no primeiro
     render, porque a preferência não muda no meio da visita. */
  const [semMovimento] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )

  const fonte = v?.mp4 || v?.webm || null

  useEffect(() => {
    const el = ref.current
    if (!el || !fonte || semMovimento) return

    const MOTIVOS: Record<number, string> = {
      1: 'carregamento abortado',
      2: 'erro de rede ao baixar o arquivo',
      3: 'falha ao decodificar — arquivo corrompido ou codec não suportado',
      4: 'arquivo não encontrado (404) ou formato não suportado pelo navegador',
    }
    const aviso = (msg: string) =>
      console.error(`[Separi · vídeo do hero "${slot}"] ${msg}`)

    const onErro = () => {
      const codigo = el.error?.code ?? 0
      aviso(`${MOTIVOS[codigo] ?? 'erro desconhecido'} (código ${codigo}).`)
      aviso(
        `Confira se o arquivo existe em "public${fonte}", com o nome exatamente ` +
          `igual (minúsculas contam), e se foi exportado em H.264 + AAC. ` +
          `HEVC/H.265 e ProRes não tocam no navegador.`
      )
      setFalhou(true) // some e devolve o fundo original da página
    }

    /* O React aplica `muted` como PROPRIEDADE. A política de autoplay do
       Chrome é avaliada na criação do elemento e às vezes roda antes disso —
       resultado: autoplay bloqueado em silêncio e vídeo parado no quadro
       zero. Forçar o atributo aqui resolve. */
    el.muted = true
    el.defaultMuted = true
    el.setAttribute('muted', '')

    const tocar = () => {
      const p = el.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          /* Bateria fraca no iPhone, aba em segundo plano, política mais
             rígida… o primeiro toque na tela resolve. */
          const retry = () => {
            el.play().catch(() => {})
            document.removeEventListener('pointerdown', retry)
          }
          document.addEventListener('pointerdown', retry, { once: true })
        })
      }
    }

    el.addEventListener('error', onErro, true)
    el.addEventListener('canplay', tocar, { once: true })
    tocar()

    return () => {
      el.removeEventListener('error', onErro, true)
      el.removeEventListener('canplay', tocar)
    }
  }, [slot, fonte, semMovimento])

  /* Sem arquivo configurado, ou arquivo que não tocou: não renderiza nada.
     A página mantém o fundo que já tinha — imagem, no caso de Produtos, ou o
     gradiente `.video_fallback`, nas demais. Nunca fica um buraco preto. */
  const mostraVideo = Boolean(fonte) && !falhou && !semMovimento

  return (
    <>
      {mostraVideo && (
        <div
          className="sep-herovideo"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <video
            ref={ref}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={v.poster ?? undefined}
            tabIndex={-1}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            }}
          >
            {v.webm && <source src={v.webm} type="video/webm" />}
            {v.mp4 && <source src={v.mp4} type="video/mp4" />}
          </video>
        </div>
      )}

      {/* Poster parado, para quem pediu movimento reduzido no sistema. */}
      {semMovimento && v?.poster && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex,
            backgroundImage: `url('${v.poster}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {scrim && (
        <div
          className="hero_scrim"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: zIndex + 1,
            pointerEvents: 'none',
            background: SCRIM,
          }}
        />
      )}
    </>
  )
}
