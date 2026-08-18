/* ============================================================================
   MAPA DE LINKS — src/site/routes.ts

   Único lugar onde as páginas novas conhecem as rotas da plataforma.
   Se alguma rota mudar no App.jsx, muda aqui e o site inteiro acompanha.
   ========================================================================== */
import { CONTATO } from './siteConfig'

export const R = {
  /* ---- páginas públicas, design novo ---- */
  home: '/',
  pecas: '/pecas',
  produtos: '/produtos',
  estoque: '/estoque',                // catálogo de máquinas em estoque
  segmentos: '/segmentos',            // índice dos setores atendidos
  servicos: '/servicos',
  sobre: '/sobre',

  /* ---- plataforma (o "sistema") ---- */
  catalogo: '/catalogo',              // catálogo de peças, exige login
  login: '/login',
  registro: '/registro',
  perfil: '/perfil',
  maquinaNova: '/perfil/maquinas/nova',
  meusPedidos: '/meus-pedidos',
  cotacao: '/cotacao',
  maquinasNovas: '/maquinas',
  fabricantes: '/fabricantes',
  equipamentosLegado: '/equipamentos',

  /* ---- contato ----------------------------------------------------------
     Vem tudo de site/siteConfig.ts, que é o único lugar onde o telefone e o
     e-mail estão escritos. Antes daqui saíam três números diferentes:
     o WhatsApp apontava para 19 98601-4198 (outra linha) e o `tel:` tinha um
     dígito a menos — ligava para lugar nenhum. */
  whatsapp: CONTATO.whatsappUrl,        // https://wa.me/5519974059048
  email: CONTATO.emailHref,             // mailto:vendas@separi.com.br
  telefone: CONTATO.telefoneHref,       // tel:+5519974059048
  endereco: CONTATO.enderecoMapa,
} as const

/* Reexportados por conveniência: quem já importa de './routes' não precisa
   importar de dois lugares para escrever o telefone na tela. */
export { CONTATO, waLink, mailLink } from './siteConfig'

/** Rota de cotação: quem não está logado passa pelo cadastro primeiro. */
export const quoteRoute = (isAuthenticated: boolean) =>
  isAuthenticated ? R.cotacao : R.registro

/** Catálogo de peças: idem, a página do sistema já barra, mas evita o flash. */
export const catalogRoute = (isAuthenticated: boolean) =>
  isAuthenticated ? R.catalogo : R.registro

/** URL da página de detalhe de uma máquina do estoque. */
export const stockRoute = (slug: string) => `/estoque/${slug}`

/** URL da página de um segmento atendido. */
export const segmentRoute = (slug: string) => `/segmentos/${slug}`

/** Abre link externo em nova aba com rel seguro. */
export const external = { target: '_blank', rel: 'noopener noreferrer' } as const
