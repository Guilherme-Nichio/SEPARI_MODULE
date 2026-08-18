# Separi v3.13 — Estabilização + UX Admin + Reset SQL

Esta é a versão "candidata oficial" — passe por todos os testes desta
release antes de promover a produção.

---

## 🚨 PASSO ZERO — Resetar o banco

Antes de subir o frontend, você precisa **resetar e recriar o banco** com o
novo script único e idempotente. Esse script substitui TODOS os SQLs
anteriores (schema + v36 + v38 + v40 + v41).

### Como rodar:

1. No painel Supabase, vá em **SQL Editor → New query**
2. Cole o conteúdo INTEIRO de `supabase/v42-reset-completo.sql`
3. Clique em **Run**
4. Depois, vá em **Authentication → Users → Add user** e crie:
   - `adm@separi.com.br` — senha `123456` — marque **Auto Confirm User**
   - `cliente@teste.com` — senha `123456` — marque **Auto Confirm User**
5. Volte ao **SQL Editor** e rode SOMENTE o bloco "PARTE 9" do script
   para promover o admin a `admin` no banco
6. Faça login em http://localhost:5173/login com `adm@separi.com.br` /
   `123456` — você verá "Painel Administrativo" no menu

### O que o script faz

- **Apaga** todo o schema `public` (CASCADE limpa dependências)
- **Cria** todas as tabelas necessárias (`profiles`, `machine_models`,
  `applications`, `mechanical_assemblies`, `user_machines`, `user_machine_*`,
  `parts`, `part_images`, `part_machine_compatibility`, `services`, `kits`,
  `kit_items`, `kit_services`, `quote_requests`, `quote_items`,
  `contact_messages`)
- **Cria** trigger `on_auth_user_created` que gera profile automaticamente
  quando um user nasce em `auth.users`
- **Cria** função `is_admin()` reutilizável nas políticas RLS
- **Cria** views `user_visible_parts`, `kits_with_pricing`, `user_visible_kits`
- **Aplica RLS** correta em todas as tabelas (admin vê tudo, cliente só seus
  dados) — isso **conserta o problema das cotações não carregarem no admin**
- **Configura** buckets de Storage (`machine-photos`, `machine-manuals`,
  `part-images`) com políticas adequadas
- **Insere** dados seed: 17 modelos de centrífuga, 10 aplicações, 7
  conjuntos mecânicos

---

## 🔥 Mudanças no frontend nesta versão

### 1. Navbar mobile — bug do arrasto lateral resolvido

- **Site não arrasta mais lateralmente no mobile**. `html` e `body`
  receberam `overflow-x: hidden` + `max-width: 100vw`.
- Removido o `max-width: calc(100vw - 32px)` que estava causando
  vazamento em alguns devices (a 100vw inclui scrollbar).
- Navbar mobile: width 100% sem cálculos com vw, paddings ajustados,
  user-badge fica só com o avatar (sem texto vazando), botões compactos.
- Quebra de breakpoint melhor em ≤768px e ≤420px.

### 2. Conteúdo do cliente não cola mais na navbar

- `.dashboard` agora tem `padding-top: 140px` (desktop) / `110px` (mobile)
  com `!important` para garantir prioridade.
- Quando o `ClientNav` está presente, ele assume a reserva da navbar
  (88px desktop / 78px mobile) e o `.dashboard` só ganha respiro (32px /
  24px) — sem duplicar.

### 3. Cadastrar máquina — wizard de 4 passos

Página `/perfil/maquinas/nova` totalmente refeita:

- **Passo 1: Identificação** — modelo, número de série, aplicação (cards
  clicáveis em vez de select).
- **Passo 2: Fotos** — área de drop visual para foto principal +
  grid de fotos extras com botão "tornar principal" (estrela) e remover.
- **Passo 3: Detalhes** — conjuntos mecânicos **agora opcionais**,
  manual em PDF opcional. Tudo pode ser deixado em branco.
- **Passo 4: Revisão** — resumo dos dados + preview da foto principal
  antes de enviar.
- Stepper visual no topo com check verde nas etapas concluídas e pulse
  na etapa atual.
- Botões "Voltar / Próximo" claros em cada passo.
- Mobile: stack vertical, stepper compacto, ações em coluna.

### 4. Admin Home — UX redesenhada

Página `/admin` agora tem:

- **Alerta no topo** quando há itens precisando de atenção (máquinas
  pendentes + cotações abertas), com botões diretos pra resolver.
- **4 KPI cards clicáveis**: Máquinas pendentes (urgente se >0), Cotações
  abertas (urgente se >0), Peças ativas, Clientes cadastrados. Cada um
  com valor grande, subtítulo contextual, e "Revisar fila → / Responder
  agora →".
- **6 atalhos de cadastro rápido**: Nova peça, Novo serviço, Novo kit,
  Novo modelo, Nova aplicação, Ver relatórios.
- **Atividade recente** em 2 colunas lado a lado: Máquinas pendentes |
  Cotações recentes — todos clicáveis para ir ao detalhe.
- Status badges nos itens (Pendente, Aberta, Em análise, Respondida,
  Fechada).

### 5. Refinamentos gerais

- Form inputs/selects/textareas com estilo unificado: bordas mais
  espessas, focus com ring teal, placeholders mais legíveis.
- Dropdowns mobile com `max-width: 100%` (não estouram horizontal).

---

## 📁 Arquivos modificados / criados nesta versão

```
src/styles/v43-final.css                      (NOVO — fixes críticos)
src/main.jsx                                  + import v43
src/pages/MaquinaNova.jsx                     wizard 4 passos
src/pages/admin/AdminHome.jsx                 KPIs + atalhos + recentes
supabase/v42-reset-completo.sql               (NOVO — script único)
supabase/_arquivo_antigo/                     (migrations antigas arquivadas)
```

---

## 🧪 Roteiro de teste oficial (release candidate)

### Setup
- [ ] `npm install` sem erros
- [ ] `npm run build` sem warnings
- [ ] `.env` com credenciais reais do Supabase
- [ ] Script `v42-reset-completo.sql` rodado no Supabase
- [ ] `adm@separi.com.br` + `cliente@teste.com` criados em Authentication
- [ ] Bloco final da PARTE 9 rodado (admin promovido)

### Mobile (≤768px)
- [ ] Site **NÃO** arrasta lateralmente (passar dedo pra esquerda/direita)
- [ ] Navbar não estoura
- [ ] User-badge só com avatar
- [ ] Menu mobile abre/fecha sem bug

### Cliente (logar com cliente@teste.com)
- [ ] Conteúdo de `/perfil` respira da navbar (não cola)
- [ ] Cadastrar máquina: passo a passo com stepper visual
- [ ] Pode pular o passo 3 (conjuntos) sem erro
- [ ] Foto principal obrigatória, extras opcionais
- [ ] Resumo no passo 4 antes de enviar
- [ ] Após envio, ir pra `/perfil` e ver a máquina como "Pendente"

### Admin (logar com adm@separi.com.br)
- [ ] `/admin` mostra alerta de atenção se houver itens pendentes
- [ ] 4 KPI cards clicáveis (clica → vai pra página correspondente)
- [ ] 6 atalhos rápidos funcionam
- [ ] `/admin/maquinas` lista a máquina cadastrada pelo cliente teste
- [ ] Aprovar a máquina → cliente vê como "Aprovada"
- [ ] Cliente faz cotação de peça (após criar peça compatível no admin)
- [ ] `/admin/cotacoes` **lista a cotação** (RLS funcionando)
- [ ] `/admin/cotacoes/:id` abre, mostra itens corretos (peças + kits + serviços)
- [ ] Templates rápidos de resposta funcionam
- [ ] Auto-mudança de status "Aberta → Em análise" ao escrever
- [ ] Cliente vê resposta em `/meus-pedidos` com timeline visual

### Visual (geral)
- [ ] Cards de "Trabalho de precisão" e "Onde a separação importa"
      distribuem bem em qualquer largura
- [ ] Seção "Da sua planta à nossa bancada" (Serviços) tem cards
      escuros estilizados
- [ ] Botão "Nossos valores" no Sobre é visível (fundo branco, texto teal)
- [ ] Hero do Equipamentos sem tag "Em destaque"
- [ ] Home sem seção de depoimentos
- [ ] Vídeo institucional ainda está na Home
- [ ] Status (Pendente, Em análise, etc) sem azul/roxo

---

## 🖼️ Imagens (relembrando — vai em `/public/`)

```
public/
├── logo.png                       LOGOMARCA principal
├── favicon.png                    ícone da aba
├── og-cover.jpg                   compartilhamento social
├── separi-oficina.jpg             foto da oficina (Home)
├── separi-bowl.jpg                foto bowl recondicionamento (Home)
├── separi-preventiva.jpg          foto manutenção em campo (Serviços)
├── separi-revisao.jpg             foto revisão oficina (Serviços)
├── separi-video.mp4               vídeo institucional (Home)
└── separi-video-poster.jpg        thumbnail do vídeo
```

Todas as imagens têm fallback automático — se uma não existir, o
elemento mostra ícone/placeholder no lugar. Você pode adicionar uma por
uma sem quebrar nada.
