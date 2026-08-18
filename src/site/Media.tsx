/* ============================================================================
   src/site/Media.tsx

   Componentes que preenchem os slots de mídia. Regra de ouro: enquanto o slot
   está vazio o markup renderizado é IDÊNTICO ao HTML original — mesma div,
   mesmas classes, mesma etiqueta de caminho. Nada muda até você preencher o
   `src` no assets.ts.
   ========================================================================== */
import { useEffect, useRef, useState } from 'react'
import { BRAND, IMG, VIDEO, type ImgKey } from './assets'

/* ──────────────────────────────────────────────────────────────────────────
   Bg — o div de imagem de fundo (.img, .pic, .bgimg, .frame)

   Por que o estilo vai inline em vez de ir para o CSS: as regras originais
   são do tipo

       .spot .visual .img { background-size: cover; background: <gradiente> }

   O shorthand `background:` vem DEPOIS e zera o `background-size`. Qualquer
   regra que eu escrevesse em arquivo teria de brigar com 4 níveis de
   especificidade. Inline resolve de uma vez e sem !important.
   ────────────────────────────────────────────────────────────────────────── */
type BgProps = {
  slot: ImgKey
  className: string
  /** posição do recorte, se o assunto da foto não estiver no centro */
  position?: string
  /** mostra a etiqueta com o caminho enquanto o slot está vazio */
  showLabel?: boolean
  /** atributos extras (ex: data-i nas etapas) */
  [key: `data-${string}`]: unknown
}

export function Bg({
  slot,
  className,
  position = 'center',
  showLabel = false,
  ...rest
}: BgProps) {
  const asset = IMG[slot]
  const [broken, setBroken] = useState(false)

  /* Se o arquivo não existir (404), o background-image inline substituiria o
     gradiente do CSS por nada e o card ficaria vazio. Aqui a gente testa o
     carregamento e, falhando, volta ao placeholder. */
  useEffect(() => {
    if (!asset.src) return
    const img = new Image()
    img.onerror = () => setBroken(true)
    img.src = asset.src
  }, [asset.src])

  const filled = Boolean(asset.src) && !broken

  return (
    <>
      <div
        className={className}
        role={filled ? 'img' : undefined}
        aria-label={filled ? asset.alt : undefined}
        style={
          filled
            ? {
                backgroundImage: `url('${asset.src}')`,
                backgroundSize: 'cover',
                backgroundPosition: position,
                backgroundRepeat: 'no-repeat',
              }
            : undefined
        }
        {...rest}
      />
      {showLabel && !filled && <span className="tag">{asset.label}</span>}
    </>
  )
}

/**
 * Slots em que o HTML original tinha SÓ a etiqueta de caminho, sem div de
 * imagem — por exemplo `<div class="visual"><span class="tag">...</span></div>`.
 * O gradiente vinha do próprio container.
 *
 * Vazio, renderiza exatamente a etiqueta de antes. Preenchido, injeta uma
 * camada de imagem cobrindo o container (que já é position:relative com
 * overflow:hidden) e esconde a etiqueta. Estilo inline de propósito: o
 * shorthand `background:` do container zeraria qualquer background-size
 * declarado em arquivo.
 */
export function Tag({
  slot,
  position = 'center',
}: {
  slot: ImgKey
  position?: string
}) {
  const asset = IMG[slot]
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    if (!asset.src) return
    const img = new Image()
    img.onerror = () => {
      setBroken(true)
      console.error(
        `[Separi · imagem "${slot}"] não carregou: ${asset.src}. ` +
          `Confira se o arquivo existe em public${asset.src} e se o nome bate (minúsculas).`
      )
    }
    img.src = asset.src
  }, [asset.src, slot])

  if (!asset.src || broken) return <span className="tag">{asset.label}</span>

  return (
    <div
      role="img"
      aria-label={asset.alt}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundImage: `url('${asset.src}')`,
        backgroundSize: 'cover',
        backgroundPosition: position,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   HeroVideo — vídeo de fundo do hero

   Sem arquivo configurado, não renderiza <video> nenhum: sobra só o
   .video_fallback, que é o gradiente que você já vê hoje. Com arquivo, o
   vídeo entra por cima. O recorte (object-fit: cover) já vem do CSS da página.
   ────────────────────────────────────────────────────────────────────────── */
export function HeroVideo({ slot }: { slot: keyof typeof VIDEO }) {
  const v = VIDEO[slot]
  const ref = useRef<HTMLVideoElement>(null)

  /* Diagnóstico. A versão anterior deste componente simplesmente sumia com o
     <video> quando dava erro, o que escondia a causa: você via o gradiente e
     nenhuma explicação. Agora ele fica no DOM e o motivo vai para o console. */
  useEffect(() => {
    const el = ref.current
    if (!el || !v.mp4) return

    const CODIGOS: Record<number, string> = {
      1: 'carregamento abortado',
      2: 'erro de rede ao baixar o arquivo',
      3: 'falha ao decodificar — o arquivo está corrompido ou o codec não é suportado',
      4: 'arquivo não encontrado (404) ou formato/codec não suportado pelo navegador',
    }

    const aviso = (msg: string) =>
      console.error(`[Separi · vídeo do hero "${slot}"] ${msg}`)

    const onErr = () => {
      const code = el.error?.code ?? 0
      aviso(`${CODIGOS[code] ?? 'erro desconhecido'} (código ${code})`)
      aviso(`URL tentada: ${new URL(v.mp4!, location.origin).href}`)

      // confirma se é caminho errado ou codec
      fetch(v.mp4!, { method: 'HEAD' })
        .then((r) => {
          if (!r.ok) {
            aviso(`O servidor respondeu ${r.status}. É problema de CAMINHO ou NOME DE ARQUIVO.`)
            aviso(`Confira: public${v.mp4} existe? O nome bate exatamente, incluindo maiúsculas?`)
          } else {
            aviso(
              `O arquivo existe e foi baixado (${r.headers.get('content-type')}). ` +
                `Então é CODEC: reexporte em H.264 + AAC. HEVC/H.265 e ProRes não tocam no navegador.`
            )
          }
        })
        .catch(() => aviso('Não foi possível verificar a URL.'))
    }

    const onOk = () =>
      console.info(`[Separi · vídeo do hero "${slot}"] carregado e tocando.`)

    el.addEventListener('error', onErr, true)
    el.addEventListener('loadeddata', onOk)

    /* O React aplica `muted` como PROPRIEDADE, não como atributo HTML. A
       política de autoplay do Chrome é avaliada na criação do elemento, e às
       vezes ela roda antes de o React marcar a propriedade — resultado: o
       autoplay é bloqueado em silêncio e o vídeo fica parado no quadro zero
       (que, sem poster, é transparente). Forçar aqui resolve. */
    el.muted = true
    el.defaultMuted = true
    el.setAttribute('muted', '')

    const tocar = () => {
      const p = el.play()
      if (p && typeof p.catch === 'function') {
        p.catch((err: Error) => {
          aviso(`autoplay bloqueado pelo navegador (${err.name}). Tentando de novo no primeiro clique.`)
          const retry = () => { el.play().catch(() => {}); document.removeEventListener('pointerdown', retry) }
          document.addEventListener('pointerdown', retry, { once: true })
        })
      }
    }
    tocar()
    el.addEventListener('canplay', tocar, { once: true })

    /* Ferramenta de diagnóstico: rode separiVideo() no console do navegador. */
    ;(window as unknown as Record<string, unknown>).separiVideo = () => {
      const r = el.getBoundingClientRect()
      const c = getComputedStyle(el)
      console.table({
        'URL': v.mp4,
        'readyState (4 = pronto)': el.readyState,
        'pausado': el.paused,
        'largura do vídeo (0 = não decodificou)': el.videoWidth,
        'altura do vídeo': el.videoHeight,
        'caixa na tela': `${Math.round(r.width)}x${Math.round(r.height)}`,
        'display': c.display,
        'opacity': c.opacity,
        'visibility': c.visibility,
        'z-index': c.zIndex,
        'position': c.position,
        'object-fit': c.objectFit,
        'erro': el.error ? `código ${el.error.code}` : 'nenhum',
      })
      return 'Se largura do vídeo = 0, é codec. Se caixa = 0x0, é CSS. Se pausado = true, é autoplay.'
    }

    return () => {
      el.removeEventListener('error', onErr, true)
      el.removeEventListener('canplay', tocar)
      el.removeEventListener('loadeddata', onOk)
    }
  }, [slot, v.mp4])

  if (!v.mp4 && !v.webm) return null

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Com movimento reduzido, mostra só o poster parado.
  if (reduce && v.poster) {
    return (
      <div
        className="bg"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: `url('${v.poster}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    )
  }

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={v.poster ?? undefined}
      aria-hidden="true"
      style={{
        /* Redundante com o CSS da página, de propósito: garante que nenhuma
           regra herdada do CSS legado esconda o vídeo. */
        display: 'block',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1,
      }}
    >
      {v.webm && <source src={v.webm} type="video/webm" />}
      {v.mp4 && <source src={v.mp4} type="video/mp4" />}
    </video>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   Logo — o símbolo da marca

   Sem arquivo, desenha o mesmo SVG do design atual. Com arquivo, troca por
   <img> com altura fixa e largura automática, para não distorcer logos que
   não são quadradas.
   ────────────────────────────────────────────────────────────────────────── */
export function Logo({
  height,
  variant = 'dark',
}: {
  height: number
  variant?: 'dark' | 'light'
}) {
  const [broken, setBroken] = useState(false)
  const src =
    variant === 'light' ? BRAND.logoLight ?? BRAND.logo : BRAND.logo

  if (src && !broken) {
    return (
      <img
        src={src}
        alt="Separi"
        onError={() => setBroken(true)}
        style={{
          height,
          width: 'auto',
          maxWidth: 260,
          objectFit: 'contain',
          display: 'block',
          flex: 'none',
        }}
      />
    )
  }

  // fallback: o símbolo original, idêntico ao HTML aprovado
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      width={height}
      height={height}
      aria-hidden="true"
    >
      <path
        d="M4 6 L16 24 L28 6"
        stroke="#14b8a6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** O texto "SEPARI" ao lado do símbolo. Some sozinho se a sua logo já tiver
 *  a palavra desenhada (BRAND.logoIncludesWordmark). */
export function Wordmark() {
  if (BRAND.logo && BRAND.logoIncludesWordmark) return null
  return <>SEPARI</>
}
