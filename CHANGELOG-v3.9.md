# CHANGELOG v3.9 — Preços, Kits e UX

Versão completa que entrega as 9 mudanças combinadas, em 6 frentes técnicas.

## 🆕 O que mudou

### 1. Cliente vê todas peças compatíveis com sua máquina
A view `user_visible_parts` (do v3.6) já fazia isso. Reforçamos no UI:
- `/pecas` agora deixa claro: "X peças compatíveis com suas Y máquinas aprovadas"
- Filtro lateral "Minhas máquinas" pra ver peças por máquina específica
- A partir do detalhe da máquina (`/perfil/maquinas/:id`), o botão "Escolher peças avulsas" abre o catálogo já filtrado pelo modelo

### 2. Equipamentos do cliente em evidência
- **Home (logado):** novo bloco "Suas máquinas" abaixo do hero, mostra até 6 máquinas em cards com status e CTA pra detalhes
- **Navbar:** novo link "Minhas Máquinas" pra clientes
- **Menu do usuário:** atalho "Minhas Máquinas" no dropdown

### 3. Cadastro de máquina e carrinho em páginas dedicadas
**ANTES:** ambos eram modais.
**AGORA:**
- `/perfil/maquinas/nova` — página dedicada de cadastro (mantém as 3 seções numeradas)
- `/cotacao` — página dedicada de carrinho com layout 2 colunas (itens + resumo lateral)
- Os modais foram REMOVIDOS

### 4. Revisão Preventiva nas máquinas
Nova área dentro de `/perfil/maquinas/:id` (acessível só pra máquinas **aprovadas**):

- **Kit Completo** — busca em `user_visible_kits` por `kit_type='preventive_complete'`
- **Kit Intermediário** — `kit_type='preventive_intermediate'`
- **Escolher Peças Avulsas** — vai pra `/pecas?machine=...`

Cada card mostra: número de peças, preço (se visível), botão "Adicionar à cotação".

### 5. Cadastro de Kits no admin
Nova rota: **`/admin/kits`**.

Cada kit tem:
- **Código mãe** único (ex: `KIT-COMPLETO-MRPX418`)
- Nome, descrição, imagem
- **Tipo:** `preventive_complete` | `preventive_intermediate` | `custom`
- **Máquina alvo** (obrigatório) e conjunto (opcional)
- **Peças** com quantidade (seletor com busca, filtra pelo conjunto se selecionado)
- **Ajuste de preço:** `%` ou `R$`, positivo ou negativo
- **Visibilidade do preço** ao cliente (toggle)
- **Preview em tempo real:** preço base + ajuste = preço final

Bônus: botão **"Clonar peças do conjunto"** — se você selecionou conjunto + modelo, pega todas as peças compatíveis e já adiciona ao kit com quantidade 1.

Constraint do banco: só pode haver **1 kit `preventive_complete` e 1 `preventive_intermediate` por modelo**, evitando duplicação.

### 6. Hierarquia organizada de peças (Conjunto → Peças)
`/pecas` foi reorganizada:
- Cards agrupados em **accordion por Conjunto Mecânico** (ex: "Transmissão Vertical", "Hidráulica")
- Cada conjunto mostra contagem e pode ser colapsado
- Sidebar de filtros: por Conjunto, Marca e Máquina

### 7. Responsivo mobile
Novo arquivo `src/styles/v39-additions.css` com media queries:
- Hero pro vira 1 coluna em ≤768px
- Cotação vira 1 coluna
- Sidebar de filtros vira topo no /pecas
- Grids de máquinas e kits viram 1 coluna
- Form admin (200px + 1fr) vira 1 coluna

### 8. Home — primeira sessão profissional
Hero completamente refeito (`hero-pro`):
- Eyebrow ("Manutenção industrial certificada")
- Título com gradient teal
- Lead claro e direto
- 2 CTAs (cotação + ver equipamentos OU minhas máquinas se logado)
- Métricas: "24h resposta · 10K+ peças · 11 setores"
- Card direita: lista das 4 marcas certificadas (Alfa Laval, GEA, Tetra Pak, Seital) com tag por linha

### 9. Breadcrumbs em toda navegação
Novo componente `<Breadcrumbs />` em `src/components/Breadcrumbs.jsx`.
Adicionado em:
- `/pecas` → "Início › Catálogo"
- `/pecas/:id` → "Início › Catálogo › [conjunto] › [peça]"
- `/perfil` → "Início › Minha Conta"
- `/perfil/maquinas/nova` → "Início › Minha Conta › Cadastrar nova máquina"
- `/perfil/maquinas/:id` → "Início › Minha Conta › [Marca Modelo]"
- `/cotacao` → "Início › Catálogo › Cotação (N itens)"
- `/meus-pedidos` → "Início › Meus Pedidos"

## 🗃️ Mudanças no banco

Novo arquivo: `supabase/v38-precos-e-kits.sql` (idempotente). Resumo:

**`parts`:**
- `price numeric(12,2)` default 0
- `price_visible boolean` default true

**`kits` (nova):**
- `code` (unique), `name`, `description`, `image_url`
- `kit_type`: `preventive_complete` | `preventive_intermediate` | `custom`
- `machine_model_id` (obrigatório), `assembly_id` (opcional)
- `price_adjustment_type`: `percent` | `absolute`
- `price_adjustment_value` (positivo = acréscimo, **negativo = desconto**)
- `is_active`, `price_visible`
- Constraint: 1 kit `preventive_complete` e 1 `preventive_intermediate` por modelo

**`kit_items` (nova):** kit_id + part_id + quantity

**`quote_items` (alterada):** `part_id` virou nullable, novo `kit_id`, constraint XOR (peça OU kit)

**Views:**
- `kits_with_pricing` — kits com `base_price`, `final_price`, `item_count` calculados
- `user_visible_kits` — kits ativos filtrados por máquinas aprovadas do user

## 📂 Arquivos novos

```
supabase/v38-precos-e-kits.sql

src/components/Breadcrumbs.jsx
src/pages/MaquinaNova.jsx
src/pages/MinhaMaquinaDetalhe.jsx
src/pages/Cotacao.jsx
src/pages/admin/AdminKits.jsx
src/styles/v39-additions.css
```

## 📝 Arquivos modificados

```
src/App.jsx                          (novas rotas)
src/main.jsx                         (import do CSS)
src/contexts/CartContext.jsx         (suporte a kits, itemCount)
src/components/Navbar.jsx            (link /cotacao + menu kits + Minhas Máquinas)
src/pages/Home.jsx                   (hero-pro + bloco Minhas Máquinas)
src/pages/Perfil.jsx                 (SEM modal, cards linkam pra detalhe)
src/pages/Pecas.jsx                  (accordion + breadcrumbs + sem modal)
src/pages/PecaDetalhe.jsx            (breadcrumbs + preço)
src/pages/MeusPedidos.jsx            (breadcrumbs + suporte kits)
src/pages/admin/AdminParts.jsx       (campo preço + toggle visibilidade)
src/pages/admin/AdminDashboard.jsx   (rota /admin/kits)
```

## 🧨 Breaking changes (relevantes)

1. **CartContext API:** continua compatível com `addItem`/`count`, mas o formato dos itens em `localStorage` mudou. Os itens antigos são migrados automaticamente na primeira carga.
2. **Cliente sem máquina aprovada:** `/pecas` agora bloqueia com notice card e botão "Cadastrar máquinas" → `/perfil/maquinas/nova`.
3. **quote_items:** agora aceita peça OU kit. Cotações antigas continuam funcionando (todas tinham `part_id`).

## ✅ Status do build
`npm run build` passou limpo: 1657 modules, 648KB JS, 130KB CSS. Zero erros.
