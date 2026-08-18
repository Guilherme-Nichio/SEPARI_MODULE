/* ============================================================================
   src/site/siteConfig.ts  —  PAINEL DE CONTROLE DO SITE

   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR PARA:
     · trocar telefone, WhatsApp ou e-mail do site inteiro;
     · ligar/desligar o aviso "plataforma em construção" nos botões de conta;
     · ligar/desligar o modo "estoque em preparação".

   Nada aqui apaga conteúdo. Tudo é interruptor: virou `false`, o site volta
   exatamente ao que era antes, com as máquinas do banco aparecendo e os botões
   de login/cadastro navegando normalmente.
   ========================================================================== */

/* ══════════════════════════════════════════════════════════════════════════
   1. CONTATO
   Fonte única da verdade. O site inteiro (páginas novas, páginas legadas,
   rodapé, menu do celular e dados estruturados do Google) lê daqui.

   Se um dia o número mudar, mude SÓ as duas linhas de baixo.
   ══════════════════════════════════════════════════════════════════════════ */

/** Número do WhatsApp comercial em formato internacional, só dígitos.
 *  55 (Brasil) + 19 (DDD) + 974059048 */
export const WHATSAPP_DIGITS = '5519974059048'

/** E-mail comercial. */
export const EMAIL = 'vendas@separi.com.br'

export const CONTATO = {
  /** só dígitos, para montar links wa.me */
  whatsappDigits: WHATSAPP_DIGITS,
  /** como o número aparece escrito na tela */
  telefoneTexto: '+55 (19) 97405-9048',
  /** versão curta, para espaços apertados */
  telefoneCurto: '(19) 97405-9048',
  /** href do clique-para-ligar */
  telefoneHref: `tel:+${WHATSAPP_DIGITS}`,
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  whatsappUrl: `https://wa.me/${WHATSAPP_DIGITS}`,
  endereco: 'R. Augusto Poltronieri, 179 - Park Comercial de Indaiatuba, Indaiatuba SP',
  enderecoMapa:
    'https://www.google.com/maps/search/?api=1&query=R.+Augusto+Poltronieri,+179,+Indaiatuba+SP',
} as const

/** Monta um link de WhatsApp já com a mensagem escrita.
 *  Uso: `waLink('Quero cotar peças para a minha centrífuga')` */
export const waLink = (mensagem?: string) =>
  mensagem
    ? `${CONTATO.whatsappUrl}?text=${encodeURIComponent(mensagem)}`
    : CONTATO.whatsappUrl

/** Monta um link de e-mail com assunto (e corpo) prontos. */
export const mailLink = (assunto?: string, corpo?: string) => {
  const p = new URLSearchParams()
  if (assunto) p.set('subject', assunto)
  if (corpo) p.set('body', corpo)
  const qs = p.toString()
  return qs ? `${CONTATO.emailHref}?${qs}` : CONTATO.emailHref
}

/* ══════════════════════════════════════════════════════════════════════════
   2. PLATAFORMA DO CLIENTE — "estamos trabalhando nisso"

   Enquanto `ativo: true`, todo botão que levaria à área do cliente (Entrar,
   Cadastrar, Ver catálogo, Solicitar cotação, Montar meu kit, Minha conta…)
   deixa de navegar e abre um aviso com a centrifuguinha girando e um caminho
   de contato direto.

   Os botões CONTINUAM no lugar, com o mesmo texto e o mesmo desenho — só
   ganham um ar de "desativado" e o clique passa a abrir o aviso. Nada de
   conteúdo foi removido: para religar a plataforma, troque para `false` e
   tudo volta a navegar como antes.
   ══════════════════════════════════════════════════════════════════════════ */
export const PLATAFORMA = {
  /** ⇦ O INTERRUPTOR. `false` devolve a navegação normal ao site inteiro. */
  ativo: true,

  titulo: 'Estamos trabalhando nessa plataforma',
  texto:
    'A área do cliente — cadastro de máquinas, catálogo de peças e pedidos online — ' +
    'está em construção para melhor te atender. Enquanto isso, fale direto com a ' +
    'nossa engenharia: respondemos rápido e com a peça certa.',
  /** aviso curto, usado no lugar de textos longos (tooltip e menu do celular) */
  textoCurto: 'Estamos trabalhando nessa plataforma para melhor te atender.',

  /** Bloqueia também o acesso digitando o endereço na barra do navegador.
   *  A página de login continua de pé (a equipe e o admin precisam entrar),
   *  o que fica bloqueado é o cadastro público. */
  bloquearCadastroPublico: true,

  /** Palavra-passe de bypass: /registro?acesso=interno continua abrindo o
   *  cadastro de verdade, para a própria equipe testar antes de publicar. */
  chaveBypass: 'interno',
} as const

/* ══════════════════════════════════════════════════════════════════════════
   3. ESTOQUE DE MÁQUINAS — "em preparação"

   Enquanto `ativo: true`, a página /estoque continua existindo, com o mesmo
   hero, o mesmo texto e o mesmo CTA final — mas a grade de máquinas não é
   exibida (as de demonstração somem) e no lugar entra o mesmo painel de aviso
   da plataforma, com a centrifuguinha e o botão de contato.

   Quando você cadastrar as máquinas de verdade em /admin/estoque, troque para
   `false`: os filtros e a grade voltam sozinhos, sem mexer em mais nada.
   ══════════════════════════════════════════════════════════════════════════ */
export const ESTOQUE = {
  /** ⇦ O INTERRUPTOR. `false` devolve a grade de máquinas do banco. */
  ativo: true,

  titulo: 'Estamos preparando o nosso estoque',
  texto:
    'As máquinas disponíveis estão sendo fotografadas, revisadas e cadastradas uma a uma. ' +
    'Enquanto a vitrine não fica pronta, diga o que você precisa: temos equipamentos ' +
    'novos e recondicionados de todas as marcas relevantes do mercado, e a engenharia ' +
    'dimensiona o certo para o seu processo.',
  ctaWhatsapp: 'Falar com um vendedor',
  ctaEmail: 'Mandar um e-mail',
  mensagemWhatsapp:
    'Olá! Vim pelo site e quero saber quais máquinas vocês têm disponíveis.',
  assuntoEmail: 'Consulta de máquinas em estoque',
} as const
