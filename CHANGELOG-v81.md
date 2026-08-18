# v81 — Preparação para publicar

Nada do que já existia foi apagado. Todo o comportamento novo está atrás de
**interruptores** num único arquivo: `src/site/siteConfig.ts`.

---

## 1. Onde mexer depois (o painel de controle)

Abra `src/site/siteConfig.ts`. São três blocos:

| O que | Onde | Como desligar |
|---|---|---|
| Telefone, WhatsApp, e-mail | `WHATSAPP_DIGITS` e `EMAIL` | trocar o valor, o site inteiro acompanha |
| Aviso "plataforma em construção" | `PLATAFORMA.ativo` | `false` → todos os botões voltam a navegar |
| "Estoque em preparação" | `ESTOQUE.ativo` | `false` → a grade de máquinas do banco volta |

Não é preciso tocar em mais nenhum arquivo.

---

## 2. Contatos — três números errados corrigidos

Este foi o achado mais sério da revisão. O site tinha **três** destinos
diferentes, e nenhum era o número de vendas:

| Onde | Estava | Ficou |
|---|---|---|
| `.env` (`VITE_WHATSAPP_NUMBER`), usado por 15 páginas | `551938167640` | `5519974059048` |
| `routes.ts` → botões "Falar no WhatsApp" do site novo | `5519986014198` | `5519974059048` |
| `routes.ts` → `tel:` do rodapé e do menu do celular | `+551997405948` (um dígito a menos, não completava a ligação) | `+5519974059048` |
| `MeusPedidos.jsx` | `contato@separi.com.br` | `vendas@separi.com.br` |

O número deixou de depender do `.env`: agora vem de `siteConfig.ts`, para que
um `.env` desatualizado na Vercel não consiga mandar cliques para a linha
errada de novo. Os dados estruturados do Google (`App.jsx`) também passaram a
ler daqui.

---

## 3. Plataforma do cliente — "estamos trabalhando nessa plataforma"

Os botões **continuam todos no lugar**, com o mesmo texto e o mesmo desenho.
Enquanto `PLATAFORMA.ativo` for `true`, o clique abre um aviso com a
centrifuguinha girando e caminhos de contato (WhatsApp, e-mail, telefone), em
vez de navegar.

Cobertos: barra de navegação (desktop e celular), rodapé, e todos os CTAs de
página — "Entrar", "Cadastrar", "Ver catálogo", "Solicitar cotação", "Cotar
Kit Geral", "Cotar Kit Tambor", "Montar meu kit", "Cadastrar minha máquina",
"Criar conta", "Fazer login", "Minha conta". A navbar e o rodapé antigos (das
rotas legadas) também.

**Quem digita `/registro` na barra de endereço** cai num porteiro
(`RegistroEmBreve.tsx`) que mostra o mesmo aviso.

**A página `/login` continua funcionando de propósito** — vocês precisam
entrar para usar `/admin` e cadastrar as máquinas do estoque. Se quiser testar
o cadastro real antes de publicar, use `/registro?acesso=interno`.

Arquivos novos: `src/site/EmBreve.tsx`, `src/site/RegistroEmBreve.tsx`,
`src/components/CentrifugaSpinner.tsx`.

---

## 4. Estoque em preparação

A página `/estoque` continua no ar com o mesmo hero, o mesmo texto e o mesmo
CTA final. O que muda enquanto `ESTOQUE.ativo` for `true`:

- a página **não consulta o banco**, então as máquinas de demonstração somem;
- os filtros ficam escondidos (um formulário que sempre devolve zero frustra);
- no lugar da grade entra o painel com a centrífuga e os botões de contato;
- `/estoque/:slug` (links antigos já compartilhados) mostra o mesmo aviso em
  vez de abrir uma máquina de teste;
- a seção "Em estoque para *setor*" das páginas de segmento não é montada.

Quando cadastrar as máquinas de verdade em `/admin/estoque`, troque para
`false` e tudo volta sozinho.

---

## 5. Vídeos nos heros — as quatro páginas

Criado `src/site/HeroBgVideo.tsx`, um componente único usado por Home,
Produtos, Serviços e Sobre. Os arquivos ficam declarados em `site/assets.ts`,
no bloco `VIDEO`.

**Dois bugs que impediam o vídeo de aparecer:**

1. O `assets.ts` apontava para arquivos inexistentes — `home.mp4` e
   `services.mp4`, quando os reais são `video.mp4` e `servicos.mp4`.
2. O `<source>` do Sobre estava escrito `type="drone/mp4"` — um tipo MIME que
   não existe. O navegador descartava o arquivo sem nem tentar baixar.

**Produtos ganhou vídeo** (`/media/produtos/produtos.mp4`), com a foto
`prodHero` e o gradiente permanecendo por baixo como rede de segurança.

Garantias para o vídeo tocar mesmo: `muted` forçado como atributo (não só como
propriedade do React, senão o Chrome bloqueia o autoplay em silêncio),
`playsInline` para o iPhone não abrir em tela cheia, novo `play()` no primeiro
toque se o navegador recusar, e queda limpa para o fundo anterior se o arquivo
faltar ou o codec não for suportado — nunca fica retângulo preto.

Para trocar um vídeo, mexa só no `VIDEO` do `assets.ts`. Para tirar, ponha o
`mp4` em `null`: a página volta ao fundo antigo sem precisar de edição.

---

## 6. Responsividade

Novo arquivo `src/styles/v81-embreve-e-responsivo.css`, importado por último.

- **Hero do Sobre**: o v80 transformou a abertura em hero de vídeo com
  `height: 100vh; min-height: 660px`, mas é importado *depois* do v77 e
  escapou da correção de `100svh`. No iPhone o hero nascia mais alto que a
  tela e o botão "Falar com especialista" ficava abaixo da dobra. Corrigido.
- **Vídeo no celular**: trocado o truque de `100vw / 56.25vw` por
  `object-fit: cover`, que recorta a caixa real do hero. O anterior
  dimensionava pela largura da janela e sobrava vídeo fora da tela, gastando
  bateria decodificando pixels invisíveis.
- **Celular deitado**: as quatro páginas com hero de tela cheia soltam a
  altura abaixo de 560px, senão o título não cabe.
- **Tipografia fluida** para estoque, segmentos e catálogo — nasceram no v79 e
  tinham salto seco no breakpoint de 980px.
- **`<select>` e busca do estoque em 16px**: abaixo disso o Safari do iPhone
  dá zoom na página ao focar o campo, e não volta sozinho.
- **Alvos de toque** de 44px nos links de rodapé, grade de segmentos com
  degrau de 3 colunas no tablet, rodapé em 2 colunas entre 561 e 900px.
- Modal e painel do aviso: botões de largura cheia abaixo de 560px, respeito
  ao *notch* (`env(safe-area-inset-*)`), e rolagem quando a tela é baixa.
- `prefers-reduced-motion`: a centrífuga fica desenhada porém parada, e os
  vídeos dão lugar ao poster.

---

## Como testar

```bash
npm install
npm run dev
```

Confira: menu do celular em ~375px de largura · clicar em "Entrar" ou
"Cadastrar" (deve abrir o aviso) · `/estoque` (aviso + contato, sem máquinas) ·
Home, Produtos, Serviços e Sobre (vídeo tocando no hero) · qualquer botão de
WhatsApp (deve abrir a conversa com o **(19) 97405-9048**).

> A pasta `public/` não vem neste pacote, conforme combinado — os caminhos de
> mídia continuam apontando para os arquivos que já estão na sua. A pasta
> `dist/` também ficou de fora por ser saída de build, regerada pelo
> `npm run build`.
