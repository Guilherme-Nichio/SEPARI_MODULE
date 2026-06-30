# Separi v3.12 — Redesign visual e UX de pedidos

Versão focada em refinamento visual: novos heros distintos para cada página,
padronização de cores de status, remoção de UPPERCASE excessivo, correção
do navbar no mobile, espaçamento correto entre conteúdo e navbar, timeline
visual de pedidos e correção do bug que escondia kits e serviços do admin.

---

## 🚀 Para subir essa versão

Sem migração SQL nova. Basta:

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # build de produção
```

E colocar as imagens em `/public/` (ver lista no final).

---

## 🔥 Mudanças desta versão

### 🎨 Visual / Design

- **Novo arquivo `src/styles/v42-redesign.css`** (consolidado, fácil de
  reverter), importado por último no `main.jsx`. Contém todos os overrides.

- **Padronização das cores de status** — eliminado o azul de "open" e o
  roxo de "in_progress" que estavam fora da identidade visual:
  - Pendente / Aberta → âmbar
  - Em análise → teal escuro
  - Aprovada / Respondida → verde
  - Rejeitada → vermelho
  - Fechada → cinza

- **Remoção do UPPERCASE excessivo** em footer, tabelas, eyebrows, breadcrumbs
  e labels diversos. Uppercase fica só em labels técnicos minúsculos
  (gauge-label, hero-readout-label) onde é estética industrial intencional.

### 🏠 Heros distintos por página

Cada página de conteúdo agora tem uma estética própria, não mais o mesmo
"page-intro" genérico:

- **Sobre** — Hero "manifesto editorial" claro: fundo creme, tipografia
  grande com itálico no destaque, faixa horizontal de 4 colunas de meta
  (Fundação · Sede · Atuação · Marcas), marca d'água gigante "SOBRE" atrás
  como elemento gráfico.

- **Servicos** — Hero "blueprint técnico" escuro: fundo grafite/teal com
  grid técnico, tag pulsante "Cobertura técnica completa", título e lead
  no topo, e na parte de baixo uma faixa horizontal com **3 etapas
  numeradas (01 Diagnóstico → 02 Execução → 03 Relatório)**.

- **Equipamentos** — Hero "showcase de produto": split com texto à esquerda
  e card de produto destacado à direita com tag "Em destaque", título
  "Linha Recondicionada", grid de 4 specs (Padrão OEM · Garantia · Run-in ·
  Entrega) e CTA pill.

### 📐 Espaçamento / Layout

- **Conteúdo não cola mais na navbar**. Padding-top de `.dashboard`,
  `.admin-shell` e `.peca-page` aumentado para 130–140px (desktop) e
  110–120px (mobile). Quando o ClientNav está presente o conteúdo só
  precisa de respiro (36px desktop / 24px mobile).

### 📱 Navbar mobile

- `user-badge` agora é **contido**: no mobile mostra só o avatar circular,
  sem texto vazando. Tamanho do avatar aumentado pra 32px pra não ficar
  pequeno demais.
- Container do navbar com `calc(100vw - 24px)` — não estoura mais a tela.
- Logo cai pra 24px no <768px e 22px no <420px.
- Gaps menores no `.nav-actions`.
- Menu mobile dropdown com `left/right: 12px` em vez de `width: 100%`.

### 📋 Página "Meus Pedidos" — refeita

- **Stats no topo**: Total · Aguardando · Com retorno da Separi.
- **Filtros por status** (Todas · Abertas · Em análise · Respondidas ·
  Fechadas) com contador em cada um.
- **Timeline visual de 4 etapas em cada pedido**:
  ```
  Recebido  →  Em análise  →  Respondida  →  Concluída
  ```
  Cada etapa tem círculo (vazio / done / current com pulse animation) e
  legenda. Mostra exatamente onde o pedido está.
- **Bloco de resposta da Separi refinado** com avatar gradient, título,
  data de resposta, texto em card branco com borda teal, e botões de ação:
  "Continuar pelo WhatsApp" + "Responder por email".
- **Strip de espera âmbar** quando o pedido está sem resposta — mensagem
  diferenciada por status (Recebido vs Em análise).
- **Suporte a kits e serviços** (antes só mostrava peças nos itens).
- **ID curto do pedido** (#XXXXXXXX) para o cliente referenciar facilmente
  ao falar com o suporte.

### 🔧 Painel Admin → Cotação detalhe (`AdminQuoteDetail`)

- **Bug corrigido**: agora carrega kits e serviços nos quote_items (antes
  só carregava parts, então kits e serviços ficavam invisíveis).
- **Resumo do cliente reorganizado**: avatar maior, contato em links
  diretos (mailto:, tel:), e mini-cards de contagem (Itens totais · Peças ·
  Kits · Serviços).
- **Templates rápidos de resposta**: 4 botões pré-prontos que o admin
  clica e o texto cola na caixa:
  - Confirmação inicial
  - Orçamento simples (com placeholders R$ 0,00)
  - Solicitar mais info
  - Sem estoque
- **Auto-mudança de status**: ao começar a escrever a resposta, status
  passa automaticamente de "Aberta" → "Em análise".
- **Botão direto pro WhatsApp** com texto pré-preenchido referenciando
  o pedido (usa o telefone do próprio cliente).
- Status com descrição contextual abaixo do select.
- Contador de caracteres na mensagem.

### 🖼️ Logomarca unificada

Antes existiam 3 referências de logo (`/Separi-logo1.png`, `/Separi-logo5.png`,
`/logo.png`). Agora tudo aponta para `/logo.png` (logomarca principal),
`/favicon.png` (ícone do browser) e `/og-cover.jpg` (imagem de
compartilhamento social).

### 🧹 Limpeza de "fluff"

- Removido `"Em até 24h úteis"` dos pontos de confiança em Login e Registro.
- Removido `"+10.000 peças em estoque. Atendimento 24/7."` do meta
  description do `index.html`.

---

## 📁 Arquivos modificados / criados

```
src/styles/v42-redesign.css                   (NOVO — 1500+ linhas de overrides)
src/main.jsx                                  import do v42
src/App.jsx                                   logo unificado
src/components/Seo.jsx                        DEFAULT_IMAGE → /og-cover.jpg
src/components/Navbar.jsx                     logo unificado
src/pages/Sobre.jsx                           hero manifesto editorial
src/pages/Servicos.jsx                        hero blueprint técnico
src/pages/Equipamentos.jsx                    hero showcase de produto
src/pages/Login.jsx                           sem "24h", logo unificado
src/pages/Registro.jsx                        sem "24h", logo unificado
src/pages/EsqueciSenha.jsx                    logo unificado
src/pages/RedefinirSenha.jsx                  logo unificado
src/pages/MeusPedidos.jsx                     timeline visual + stats + filtros
src/pages/admin/AdminQuoteDetail.jsx          bug kits/serviços + templates
index.html                                    favicon, OG, descrição limpa
```

---

## 🖼️ Imagens que você precisa colocar em `/public/`

Lista oficial. Os caminhos abaixo são os que o código está esperando:

| Caminho no código          | Arquivo a colocar em `public/`     | Dimensão recomendada              | Função                                                                  |
|---------------------------|------------------------------------|-----------------------------------|-------------------------------------------------------------------------|
| `/logo.png`                | `logo.png`                         | 400×120 px PNG transparente       | **Logomarca principal** — navbar, footer, sidebar admin, páginas auth   |
| `/favicon.png`             | `favicon.png`                      | 128×128 px PNG quadrado           | Favicon do browser (aba)                                                |
| `/og-cover.jpg`            | `og-cover.jpg`                     | 1200×630 px JPG                   | Imagem de compartilhamento (WhatsApp, Facebook, Twitter, LinkedIn)      |
| `/separi-video.mp4`        | `separi-video.mp4`                 | 1920×1080 H.264, ≤30 MB           | Vídeo institucional na seção "Nossa operação por dentro" da Home        |
| `/separi-video-poster.jpg` | `separi-video-poster.jpg`          | 1920×1080 px JPG                  | Thumbnail mostrado antes do play do vídeo                               |
| `/separi-oficina.jpg`      | `separi-oficina.jpg`               | 1600×1100 px JPG                  | Foto da oficina — info-block "Campo / Oficina" na Home                  |
| `/separi-bowl.jpg`         | `separi-bowl.jpg`                  | 1600×1100 px JPG                  | Foto de bowl em recondicionamento — info-block escuro na Home           |

Estrutura final do `/public/`:

```
public/
├── logo.png                     ← logomarca principal (ÚNICA — usa em todo lugar)
├── favicon.png                  ← ícone da aba do browser
├── og-cover.jpg                 ← imagem para compartilhamento social
├── separi-video.mp4             ← vídeo institucional (opcional)
├── separi-video-poster.jpg      ← thumbnail do vídeo
├── separi-oficina.jpg           ← foto da oficina
└── separi-bowl.jpg              ← foto do bowl em recondicionamento
```

> Os arquivos antigos `Separi-logo1.png` e `Separi-logo5.png` podem ser
> removidos depois que você confirmar que tudo está funcionando com os
> novos nomes. Se preferir, mantenha-os no `public/` como backup.

---

## 🧪 O que testar primeiro

1. **Mobile** (320 → 480 → 768px) — navbar não estoura mais, user-badge
   contido (só avatar).
2. **Sobre** — hero claro estilo manifesto com itálico no "seu processo".
3. **Servicos** — hero escuro com 3 etapas numeradas na faixa inferior.
4. **Equipamentos** — hero com card de showcase "Linha Recondicionada"
   na lateral.
5. **Meus Pedidos** — fazer um pedido novo, ver a timeline com pulse no
   passo atual; admin responder; voltar e ver o bloco de resposta refinado.
6. **Admin → Cotações → Detalhes** — kits e serviços agora aparecem nos
   itens; testar os botões de template rápido; conferir auto-mudança de
   status ao começar a escrever.
7. **Cores** — não deve haver nenhum status azul ou roxo. Tudo na
   paleta teal / âmbar / verde / vermelho / cinza.
8. **Conteúdo / navbar** — em qualquer página interna, scroll até o topo
   e o conteúdo respira da navbar (não cola).

Qualquer ajuste, é só pedir.
