# CHANGELOG v3.14 — Estoque de máquinas, segmentos e catálogo pós-login

Rodada focada em quatro entregas: limpeza do hero da Home com chamadas por
marca, o módulo completo de **estoque de máquinas** (público + painel), uma
**página por segmento atendido** e o **catálogo do cliente** trazido para o
mesmo estilo do resto do site.

---

## 1. Home

**Seta piscando removida.** O `<div class="scroll_hint">↓</div>` saiu do
`src/site/pages/HomePage.tsx`. A animação `home-bob` continua no
`styles/site/home.css` sem uso — não removi para não mexer em CSS já aprovado,
mas ela não é mais referenciada por nenhum elemento.

**Dois botões de marca, semitransparentes.** Entraram logo abaixo do parágrafo
da direita, dentro do `.hero_side`. São vidro fosco de verdade: fundo
translúcido + `backdrop-filter: blur(10px)`, então o vídeo continua visível por
trás. Cada botão leva ao estoque já filtrado pela marca
(`/estoque?marca=Alfa%20Laval`).

Para trocar as marcas ou acrescentar uma terceira, mexa só na constante
`HERO_BRANDS`, no topo do `HomePage.tsx`. O layout se ajusta sozinho (no
celular vira duas colunas, e abaixo de 420px, uma).

**Cards de segmento** agora apontam para `/segmentos/:slug` (design novo) em
vez de `/aplicacoes/:slug` (design antigo).

---

## 2. Estoque de máquinas

### Banco — rode isto primeiro

```
supabase/v49-estoque-maquinas.sql
```

Supabase → SQL Editor → New query → cole tudo → Run. O script é idempotente,
não apaga nada do que já existe e cria:

- a tabela `stock_machines`;
- as políticas de RLS (leitura pública só do que está publicado, escrita só
  para admin, via a função `is_admin()` que já existia);
- o bucket de storage `stock-images`;
- 4 máquinas de exemplo, para você ver a tela funcionando de imediato. Pode
  apagar todas pelo painel quando cadastrar as reais.

**Enquanto o SQL não for rodado, nada quebra:** a página pública mostra um
aviso educado e o painel mostra a instrução de qual arquivo rodar. Isso é
tratado em `src/lib/stock.js`, que detecta a tabela ausente e devolve lista
vazia em vez de estourar.

### Páginas novas

| Rota | Arquivo | O que faz |
|---|---|---|
| `/estoque` | `src/site/pages/EstoquePage.jsx` | Catálogo com filtros |
| `/estoque/:slug` | `src/site/pages/EstoqueDetalhePage.jsx` | Detalhes do produto |
| `/admin/estoque` | `src/pages/admin/AdminStock.jsx` | Cadastro |

**Filtros:** tipo de máquina, segmento, marca, condição e busca livre. Ficam na
URL, então a busca é compartilhável e o link do hero da Home já chega filtrado.
As opções de marca e tipo saem do próprio estoque — nada de listar filtro que
não tem máquina por trás.

**Card:** foto, badges de condição e situação, título, descrição curta no estilo
especificação, chips com capacidade/rotação/potência/ano, tags de segmento,
preço (ou "sob consulta") e o botão **Saber mais**.

**Página de detalhe:** galeria com miniaturas, resumo com preço e CTA, lista de
diferenciais, descrição completa, **condições de uso**, o que acompanha, os
quatro passos da compra, tabela de ficha técnica fixa na lateral e máquinas
relacionadas. A chamada para o vendedor abre o WhatsApp com a mensagem já
escrita, citando a máquina específica.

**Painel do admin:** formulário completo — identificação, segmentos (múltipla
escolha), ficha técnica, especificações extras (rótulo + valor, quantas quiser),
textos, upload de foto principal e galeria, preço, situação, publicar/despublicar,
destaque e ordem de exibição. O slug da URL é gerado sozinho a partir de marca +
modelo, e conflitos ganham sufixo automático.

**Imagens:** o upload pelo painel vai para o bucket `stock-images`. Se preferir
arquivos fixos, dá para colar o caminho direto no campo de URL, por exemplo
`/media/estoque/minha-maquina.jpg`.

---

## 3. Uma página por segmento

| Rota | Arquivo |
|---|---|
| `/segmentos` | `src/site/pages/SegmentosPage.jsx` |
| `/segmentos/:slug` | `src/site/pages/SegmentoPage.jsx` |

São os dez setores que já existiam em `src/data/applications.jsx` — nenhum
conteúdo foi reescrito, só ganhou a roupa nova. Cada página traz: hero com foto
do setor, texto de introdução, como a separação funciona ali, o que costuma dar
errado, o que a Separi entrega, pontos de atenção na manutenção, equipamento
típico, marcas e modelos atendidos, **as máquinas do estoque marcadas com aquele
segmento**, FAQ em acordeão e outros setores.

As rotas antigas `/aplicacoes/:slug` agora renderizam a página nova. A versão
antiga continua acessível em `/aplicacoes-legado/:slug`, caso você queira
comparar antes de descartar.

---

## 4. Catálogo de peças pós-login

`/catalogo` → `src/site/pages/CatalogoPage.jsx`

Estava com a cara da plataforma antiga, destoando do resto. Agora usa a mesma
nav, o mesmo rodapé, a mesma tipografia e os mesmos botões das outras páginas,
mais uma barra própria da área do cliente (Minhas máquinas · Catálogo · Meus
pedidos · Ver cotação com contador).

**Nenhuma funcionalidade foi perdida:** filtro por máquina aprovada, kits
prontos (completo e intermediário), busca por código/nome/descrição, filtro por
conjunto mecânico, agrupamento em acordeão, adicionar à cotação e atalho de
WhatsApp por peça continuam iguais.

A rota passou a exigir login de cliente (`CustomerRoute`). A versão antiga ficou
em `/catalogo-legado`.

Links da área do cliente que apontavam para `/pecas` (que hoje é a página
institucional pública) foram redirecionados para `/catalogo`: `ClientNav`,
menu do usuário na navbar antiga, Cotação, Meus Pedidos e o botão de peças
avulsas no detalhe da máquina.

---

## Arquivos novos

```
supabase/v49-estoque-maquinas.sql
src/lib/stock.js
src/pages/admin/AdminStock.jsx
src/site/pages/EstoquePage.jsx
src/site/pages/EstoqueDetalhePage.jsx
src/site/pages/SegmentosPage.jsx
src/site/pages/SegmentoPage.jsx
src/site/pages/CatalogoPage.jsx
src/styles/site/v79-estoque-segmentos-catalogo.css
```

## Arquivos alterados

```
src/App.jsx                      rotas novas + matcher de rota de site
src/main.jsx                     import do v79 (último da cascata)
src/site/SiteNav.tsx             item "Estoque" + escopos das páginas novas
src/site/SiteFooter.tsx          links de Estoque e Segmentos
src/site/routes.ts               R.estoque, R.segmentos e helpers
src/site/pages/HomePage.tsx      seta removida + botões de marca
src/site/hooks/siteHooks.ts      useReveal aceita dependência (ver nota abaixo)
src/lib/supabase.js              bucket stock-images liberado para upload
src/components/ClientNav.jsx     Catálogo → /catalogo
src/components/Navbar.jsx        menu do usuário → /catalogo
src/pages/Cotacao.jsx            voltar ao catálogo → /catalogo
src/pages/MeusPedidos.jsx        idem
src/pages/MinhaMaquinaDetalhe.jsx  peças avulsas → /catalogo
src/pages/admin/AdminDashboard.jsx  item e rota do estoque
```

### Nota sobre o `useReveal`

O hook original observava os elementos `.sep_reveal` uma única vez, no
`mount`. Nas páginas antigas isso bastava, porque todo o conteúdo era estático.
Nas novas, os cards chegam **depois** da resposta do Supabase — eles nunca eram
observados e ficariam presos em `opacity: 0`, ou seja, invisíveis.

O hook ganhou um terceiro parâmetro opcional (`dep`): passe qualquer valor que
mude quando conteúdo novo entra na tela e o observador é remontado. A assinatura
antiga continua válida, então as cinco páginas originais não mudaram em nada.

---

## Colisões de CSS

O `v79` traz um bloco próprio de neutralização, no mesmo espírito do
`site/_legacy-collisions.css`. Duas classes do design novo têm o mesmo nome que
classes da plataforma antiga:

- `.hero` — o `globals.css` declara `min-height: 92vh`, `display: flex`,
  `align-items: center`, fundo branco e dois pseudo-elementos com gradiente e
  grade. Nada disso é declarado pelas páginas novas, então passaria direto e
  quebraria o topo das telas.
- `.btn` — a borda de 2px transparente do legado engorda o botão sólido.

Ambas foram anuladas dentro de `.sep-estoque`, `.sep-segmentos` e
`.sep-catalogo`.

---

## Como testar

1. Rode `supabase/v49-estoque-maquinas.sql` no Supabase.
2. `npm install && npm run dev`.
3. Home: confira que a seta sumiu e que os dois botões de marca aparecem sobre
   o vídeo. Clique em um deles: cai no estoque filtrado.
4. `/estoque`: as 4 máquinas do seed aparecem. Teste os filtros e o "Saber mais".
5. `/admin/estoque`: cadastre uma máquina, marque segmentos e publique. Ela
   aparece no catálogo e na página do segmento correspondente.
6. `/segmentos` e `/segmentos/laticinios`.
7. Entre como cliente e abra `/catalogo`.
