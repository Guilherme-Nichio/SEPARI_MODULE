/* ============================================================================
   src/site/assets.ts  —  MANIFESTO DE MÍDIA

   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR PARA COLOCAR AS IMAGENS.

   Como funciona
   -------------
   Cada slot começa com `src: null`. Enquanto está `null`, a página mostra
   exatamente o placeholder que você aprovou: o gradiente verde com a etiqueta
   do caminho por cima. Assim o design de hoje continua idêntico.

   Quando você preenche o `src`, três coisas acontecem sozinhas:
     1. a foto entra no lugar do gradiente;
     2. a etiqueta do caminho some;
     3. o recorte é aplicado (cover + centro), que é justamente o que o CSS
        original NÃO fazia — o shorthand `background:` das regras .img/.pic
        vinha depois do `background-size: cover` e zerava o recorte. Sem isso
        a sua foto apareceria em tamanho natural e repetida.

   Onde colocar os arquivos
   ------------------------
   Tudo dentro de `public/media/`. No Vite, `public/` é servido a partir da
   raiz, então `public/media/home/hero.mp4` vira a URL `/media/home/hero.mp4`.
   ATENÇÃO: os caminhos do HTML original (`/public/home/hero.mp4`) estavam
   errados — o prefixo `/public` não existe em runtime e daria 404.

   O campo `size` é a dimensão que o slot ocupa no layout em tela cheia. Exporte
   com o dobro (2x) para telas retina. `ratio` é a proporção do recorte.
   ========================================================================== */

export type Slot = {
  /** caminho a partir da raiz, ex: '/media/home/hero.jpg'. null = placeholder */
  src: string | null
  /** texto alternativo, importante para acessibilidade e SEO */
  alt: string
  /** dimensão exibida (1x). Exporte em 2x. */
  size: string
  /** proporção do recorte */
  ratio: string
  /** etiqueta mostrada enquanto o slot está vazio */
  label: string
}

const slot = (label: string, alt: string, size: string, ratio: string): Slot => ({
  src: null,
  alt,
  size,
  ratio,
  label,
})

/** Igual a slot(), mas com o arquivo já entregue. */
const filled = (
  src: string,
  label: string,
  alt: string,
  size: string,
  ratio: string
): Slot => ({ src, alt, size, ratio, label })

/* ══════════════════════════════════════════════════════════════════════════
   1. LOGO
   ══════════════════════════════════════════════════════════════════════════ */
export const BRAND = {
  /** Coloque em public/media/brand/. SVG é o ideal (escala sem perder nitidez).
   *  PNG também serve: exporte com 3x a altura de uso, fundo transparente. */
  logo: '/media/brand/separi.png' as string | null,

  /** Versão clara, para quando a navbar está por cima do vídeo escuro.
   *  Se ficar null, usa a `logo` acima nos dois casos. */
  logoLight: '/media/brand/separi-branco.png' as string | null,

  /** A logo já tem a palavra "SEPARI" desenhada? Marque true e o texto ao lado
   *  some. Se a sua logo é só o símbolo, deixe false. */
  logoIncludesWordmark: true,

  /** Altura da logo em px. A largura se ajusta sozinha, sem distorcer. */
  /* A logo é um lockup deitado de 9,25:1. Em 24px de altura ela ocupa ~222px
     de largura, que cabe folgado na nav de 1440px. Mexa só na altura: a
     largura acompanha sozinha, sem distorcer. */
  heightNav: 24,
  heightFooter: 22,

  /** Favicon e ícone de compartilhamento ficam em public/ (não em media/):
   *  public/favicon.png  ·  public/logo.png  ·  public/og-cover.jpg */
} as const

/* ══════════════════════════════════════════════════════════════════════════
   2. VÍDEOS DE FUNDO
   Exporte em H.264 (.mp4) e, se puder, também .webm — o navegador escolhe o
   menor. Sem áudio (o autoplay exige mudo). Alvo: no máximo 6 MB, 10 a 15 s
   em loop, 1920×1080. O `poster` é o primeiro quadro em JPG: aparece
   instantaneamente enquanto o vídeo carrega.
   ══════════════════════════════════════════════════════════════════════════ */
export const VIDEO = {
  /* HOME — o arquivo é public/media/home/video.mp4 */
  homeHero: {
    mp4: '/media/home/video.mp4' as string | null,
    webm: null as string | null, // '/media/home/video.webm'
    poster: null as string | null, // '/media/home/video-poster.jpg'
    size: '1920×1080 (16:9)',
  },

  /* SERVIÇOS — public/media/servicos/servicos.mp4 */
  servicosHero: {
    mp4: '/media/servicos/servicos.mp4' as string | null,
    webm: null as string | null,
    poster: null as string | null,
    size: '1920×1080 (16:9)',
  },

  /* PRODUTOS — public/media/produtos/produtos.mp4
     Enquanto o `mp4` estiver preenchido, o vídeo cobre o hero. Se você apagar
     o arquivo (ou trocar para null), a página volta sozinha para a foto
     `prodHero`, que continua no lugar por baixo. */
  produtosHero: {
    mp4: '/media/produtos/produtos.mp4' as string | null,
    webm: null as string | null,
    poster: null as string | null, // '/media/produtos/produtos-poster.jpg'
    size: '1920×1080 (16:9)',
  },

  /* SOBRE — public/media/sobre/drone.mp4 */
  sobreHero: {
    mp4: '/media/sobre/drone.mp4' as string | null,
    webm: null as string | null,
    poster: null as string | null,
    size: '1920×1080 (16:9)',
  },
} as const

export type VideoKey = keyof typeof VIDEO

/* ══════════════════════════════════════════════════════════════════════════
   3. IMAGENS
   Os tamanhos abaixo saíram das alturas reais do CSS de cada página.
   ══════════════════════════════════════════════════════════════════════════ */
export const IMG = {
  /* ---- SEGMENTOS: 10 cards, aparecem na Home e em Produtos ---------------
     Grade de 5 colunas, card de 200–210 px de altura. Recorte quadrado-ish.
     Como o card é pequeno e a legenda fica por cima, prefira fotos com o
     assunto no centro e sem texto. */
  segLaticinios:  filled('/media/segmentos/laticinios.jpg',  '/media/segmentos/laticinios.jpg', 'Planta de laticínios',        '280×210', '4:3'),
  segCervejaria:  filled('/media/segmentos/cervejaria.jpg', '/media/segmentos/cervejaria.jpg',  'Cervejaria industrial',       '280×210', '4:3'),
  segBebidas:     filled('/media/segmentos/bebidas.jpg',  '/media/segmentos/bebidas.jpg',     'Produção de sumos e bebidas', '280×210', '4:3'),
  segNaval:       filled('/media/segmentos/naval.jpg',    '/media/segmentos/naval.jpg',     'Aplicação marinha e naval',   '280×210', '4:3'),
  segOleos:       filled('/media/segmentos/oleos.jpg',  '/media/segmentos/oleos.jpg',       'Processamento de óleos',      '280×210', '4:3'),
  segFarma:       filled('/media/segmentos/farmaceutica.png','/media/segmentos/farmaceutica.png','Indústria farmacêutica',      '280×210', '4:3'),
  segOleoGas:     filled('/media/segmentos/oleo-gas.jpg', '/media/segmentos/oleo-gas.jpg',     'Setor de óleo e gás',         '280×210', '4:3'),
  segMineracao:   filled('/media/segmentos/mineracao.jpg', '/media/segmentos/mineracao.jpg',  'Operação de mineração',       '280×210', '4:3'),
  segEnergia:     filled('/media/segmentos/geracaodeenergia.png',  '/media/segmentos/geracaodeenergia.png',   'Geração de energia',          '280×210', '4:3'),
  segFluidos:     filled('/media/segmentos/fluidos.jpg',  '/media/segmentos/fluidos.jpg',     'Fluidos industriais',         '280×210', '4:3'),

  /* ---- HOME ------------------------------------------------------------ */
  homeBowl:       filled('/media/home/paradas.jpg', '/media/home/paradas.jpg',      'Bowl de centrífuga',                 '700×520', '4:3'),
  homeProduto:    filled('/media/home/produto.png',  '/media/home/produto.png',  'Separadora de discos',               '700×520', '4:3'),
  homeOficina:    filled('/media/home/oficina.jpg', '/media/home/oficina.jpg',  'Oficina de recondicionamento',       '700×520', '4:3'),
  homeSvcCampo:   filled('/media/home/servico-campo.jpg',   '/media/home/servico-campo.jpg', 'Serviço de campo',             '700×780', '9:16'),
  homeSvcOficina: filled('/media/home/servico-oficina.jpg','/media/home/servico-oficina.jpg', 'Oficina técnica',              '700×780', '9:16'),
  homeCta:        filled('/media/home/cta.jpg',   '/media/home/cta.jpg',     'Equipe Separi em operação',          '700×560', '5:4'),

  /* ---- PRODUTOS -------------------------------------------------------- */
  prodHero:       filled('/media/produtos/hero.jpg', '/media/produtos/hero.jpg',                'Separação centrífuga industrial', '1920×1080', '16:9'),
  prodMaquina:    filled('/media/produtos/separi-maquina.jpg',   '/media/produtos/separi-maquina.jpg',  'Máquina Separi',                  '700×560',  '5:4'),
  prodSeparadoras:filled('/media/produtos/separadora.png',   '/media/produtos/separadora.png',      'Separadoras de discos',           '760×480',  '16:10'),
  prodCentrifugas:filled('/media/produtos/decanter.png',  '/media/produtos/decanter.png',       'Centrífugas e decanters',         '760×480',  '16:10'),
  prodSepDetalhe: filled('/media/produtos/centrifuga.jpg','/media/produtos/centrifuga.jpg','Detalhe de separadora',           '700×540',  '4:3'),
  prodCentDetalhe:filled('/media/produtos/decanter2.png','/media/produtos/decanter2.png','Detalhe de decanter',             '700×540',  '4:3'),
  prodBowl:       filled('/media/home/cta.jpg',   '/media/home/cta.jpg',             'Bowl para locação',               '700×560',  '5:4'),

  /* ---- PEÇAS ----------------------------------------------------------- */
  pecasHero:      filled('/media/pecas/peca.jpg',   '/media/pecas/peca.jpg',      'Peças para centrífugas',   '640×580', '1:1'),
  pecasBowl:      filled('/media/pecas/Rotor.jpg',   '/media/pecas/Rotor.jpg',       'Base tambor',             '460×260', '16:9'),
  pecasDiscos:    filled('/media/pecas/pratos.jpg', '/media/pecas/pratos.jpg',  'Conjunto de discos',       '460×260', '16:9'),
  pecasGravidade: filled('/media/pecas/gravity-disc.jpg','/media/pecas/gravity-disc.jpg','Disco de gravidade',       '460×260', '16:9'),
  pecasRolamentos:filled('/media/pecas/rolamentos.jpg', '/media/pecas/rolamentos.jpg',  'Rolamentos',               '460×260', '16:9'),
  pecasVedacoes:  filled('/media/pecas/aneis.jpg', '/media/pecas/aneis.jpg',    'Vedações e O-rings',       '460×260', '16:9'),
  pecasAgua:      filled('/media/pecas/agua-operacao.jpg','/media/pecas/agua-operacao.jpg','Sistema de água',         '460×260', '16:9'),

  /* ---- SERVIÇOS -------------------------------------------------------- */
  svcPreventiva:  filled('/media/servicos/preventiva.jpg','/media/servicos/preventiva.jpg',  'Manutenção preventiva',  '700×560', '5:4'),
  svcRevisao:     filled('/media/servicos/revisao.jpg',  '/media/servicos/revisao.jpg',    'Revisão geral',          '700×560', '5:4'),
  svcCampo:       filled('/media/home/servico-campo.jpg','/media/home/servico-campo.jpg',    'Atendimento em campo',   '700×560', '5:4'),
  svcOficina:     filled('/media/home/servico-oficina.jpg','/media/home/servico-oficina.jpg',    'Oficina em Indaiatuba',  '700×560', '5:4'),

  /* ---- SERVIÇOS · as 5 etapas do bloco sticky --------------------------
     Aparecem numa moldura de no máximo 460 px de altura, uma de cada vez. */
  etapaChegada:     filled('/media/servicos/etapa-chegada.jpg',  '/media/servicos/etapa-chegada.jpg',   'Chegada do equipamento',   '760×460', '16:10'),
  etapaDesmontagem: filled('/media/servicos/etapa-desmontagem.jpg','/media/servicos/etapa-desmontagem.jpg', 'Desmontagem e inspeção',   '760×460', '16:10'),
  etapaOrcamento:   filled('/media/servicos/etapa-orcamento.jpg',  '/media/servicos/etapa-orcamento.jpg',  'Orçamento técnico',        '760×460', '16:10'),
  etapaExecucao:    filled('/media/servicos/etapa-execucao.jpg',  '/media/servicos/etapa-execucao.jpg',     'Aprovação e execução',     '760×460', '16:10'),
  etapaTeste:       filled('/media/servicos/etapa-teste.jpg',  '/media/servicos/etapa-teste.jpg',        'Teste funcional',          '760×460', '16:10'),

  /* ---- SOBRE ----------------------------------------------------------- */
  sobreOficina:   filled('/media/sobre/parceiro.jpg', '/media/sobre/parceiro.jpg',     'Oficina Separi',            '700×540', '4:3'),
  equipeDirecao:  filled('/media/equipe/hugo.jpg',   '/media/equipe/hugo.jpg',    'Hugo Rafacho, direção',     '440×440', '1:1'),
  equipeEngenharia:filled('/media/sobre/sobre.jpg', '/media/sobre/sobre.jpg', 'Equipe de engenharia',      '440×440', '1:1'),
  equipeAtendimento:filled('/media/sobre/tecnicos.jpg', '/media/sobre/tecnicos.jpg','Equipe tecnica',        '440×440', '1:1'),
} as const

export type ImgKey = keyof typeof IMG

/* As 5 etapas na ordem em que o scroll as revela. */
export const STEP_KEYS: ImgKey[] = [
  'etapaChegada',
  'etapaDesmontagem',
  'etapaOrcamento',
  'etapaExecucao',
  'etapaTeste',
]
