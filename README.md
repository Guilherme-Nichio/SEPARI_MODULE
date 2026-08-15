# Separi Platform

Plataforma B2B completa em React + Vite + Supabase para a Separi — manutenção, locação e fornecimento de peças para centrífugas industriais.

## Funcionalidades

### Site público
- **Home, Sobre, Serviços, Equipamentos** — totalmente migrados para React, mantendo identidade visual original (animação de partículas, glassmorphism, scroll reveal, parallax)
- Catálogo de marcas, blocos bento, timeline de trajetória, comparação campo/oficina
- Integração com WhatsApp em todos os CTAs principais

### Área do Cliente (autenticada)
- **Cadastro/login** com email e senha (Supabase Auth)
- **Perfil** com edição de dados e cadastro de máquinas próprias
- **Cadastro de máquinas** com modelo, número de série e foto obrigatória
- **Sistema de aprovação**: máquinas vão para fila do admin (pendente / aprovada / rejeitada com motivo)
- **Catálogo de peças** que só exibe peças compatíveis com as máquinas APROVADAS do cliente
- **Carrinho de cotação** com persistência local + submissão para o banco
- **Meus Pedidos**: histórico de cotações com status e resposta do admin

### Painel Admin
- **Visão geral** com estatísticas e atalhos
- **Aprovação de máquinas** com modal de detalhes, foto ampliada e motivo de rejeição
- **CRUD de peças** com upload de imagem e multi-seleção de modelos compatíveis
- **CRUD de modelos de máquinas**
- **Gestão de cotações**: leitura, troca de status, resposta ao cliente
- **Gestão de usuários** com promoção customer ↔ admin
- **Relatórios**: gráficos por mês, top peças, top clientes, distribuição por status

---

## Stack

- **React 18** + **Vite 5**
- **React Router v6** com rotas protegidas
- **Supabase** (Postgres + Auth + Storage + RLS) — tudo no plano gratuito
- **Lucide React** (ícones — zero emoji)
- **react-hot-toast** (notificações)
- CSS custom (preserva identidade visual original)

---

## Setup

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto (escolha senha forte para o banco)
3. Aguarde o provisionamento (~2 minutos)

### 2. Rodar o schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Cole o conteúdo de `supabase/schema.sql` e execute (`Run`)
3. Isso cria tabelas, RLS, triggers, buckets de storage e modelos iniciais

### 3. Pegar credenciais

1. No Supabase: **Project Settings > API**
2. Copie `Project URL` e `anon public key`

### 4. Configurar o projeto local

```bash
# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env
```

Edite o `.env`:

```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
VITE_WHATSAPP_NUMBER=551938167640
```

### 5. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## Promover o primeiro Admin

Depois de criar sua primeira conta pelo site (`/registro`), rode no SQL Editor do Supabase:

```sql
update public.profiles
set role = 'admin'
where email = 'seu_email@aqui.com';
```

Faça logout e login novamente — você verá o atalho "Painel Admin" no menu do usuário.

---

## Deploy no Vercel

### 1. Subir o código para o GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <SEU_REPO>
git push -u origin main
```

### 2. Importar no Vercel

1. Acesse [vercel.com](https://vercel.com), faça login com GitHub
2. **Add New > Project** → selecione o repositório
3. Framework: **Vite** (autodetecta)
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER` (opcional)
5. Clique **Deploy**

O `vercel.json` já está configurado para SPA routing.

### 3. Atualizar Site URL no Supabase

Para os emails de confirmação funcionarem em produção:

1. No Supabase: **Authentication > URL Configuration**
2. Defina **Site URL** como a URL do Vercel (ex: `https://separi.vercel.app`)
3. Adicione a mesma URL em **Redirect URLs**

---

## Estrutura do projeto

```
separi-platform/
├── public/                  # Logos e assets estáticos
├── supabase/
│   └── schema.sql           # Schema completo (rodar 1x)
├── src/
│   ├── lib/supabase.js      # Cliente Supabase + helper de upload
│   ├── contexts/
│   │   ├── AuthContext.jsx  # Estado de autenticação global
│   │   └── CartContext.jsx  # Carrinho de cotação (localStorage)
│   ├── components/
│   │   ├── Navbar.jsx       # Navbar responsiva com glassmorphism
│   │   ├── Footer.jsx
│   │   ├── ParticleCanvas.jsx  # Animação de partículas (canvas)
│   │   ├── Reveal.jsx       # Reveal animation com IntersectionObserver
│   │   ├── Modal.jsx        # Modal reutilizável
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Sobre.jsx
│   │   ├── Servicos.jsx
│   │   ├── Equipamentos.jsx
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Perfil.jsx       # Edição de dados + cadastro de máquinas
│   │   ├── Pecas.jsx        # Catálogo gated por máquinas aprovadas
│   │   ├── MeusPedidos.jsx
│   │   ├── NotFound.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx  # Layout com sub-rotas
│   │       ├── AdminHome.jsx       # Visão geral / stats
│   │       ├── AdminMachines.jsx   # Aprovação de máquinas
│   │       ├── AdminParts.jsx      # CRUD de peças
│   │       ├── AdminModels.jsx     # CRUD de modelos
│   │       ├── AdminQuotes.jsx     # Gestão de cotações
│   │       ├── AdminUsers.jsx      # Gestão de usuários
│   │       └── AdminReports.jsx    # Gráficos e rankings
│   ├── styles/
│   │   ├── globals.css      # Design tokens + estilos site público
│   │   └── platform.css     # Componentes da plataforma
│   ├── App.jsx              # Rotas
│   └── main.jsx             # Entry point
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## Como o sistema de peças funciona

1. Cliente se cadastra e cria sua conta
2. No perfil, cadastra máquinas que possui (modelo + nº de série + foto)
3. Admin recebe na fila e aprova/rejeita
4. Após aprovação, o cliente vê no catálogo apenas peças compatíveis com seus modelos
5. A filtragem é feita pela view SQL `user_visible_parts`, que usa o `auth.uid()` para retornar apenas as peças ligadas (via `part_machine_compatibility`) a algum modelo de máquina que o usuário tem APROVADO
6. Cliente monta cotação → ela é salva em `quote_requests` + `quote_items`
7. Admin recebe, responde, muda status → cliente vê em "Meus Pedidos"

---

## Segurança

Toda lógica de visibilidade está em **Row Level Security** (políticas SQL no Supabase):
- Cliente só lê seus próprios dados
- Admin lê tudo
- Upload de fotos de máquina: qualquer autenticado
- Upload de fotos de peça: apenas admin
- Catálogo de peças é filtrado pela view que confere as máquinas aprovadas

Sem essas políticas, os endpoints retornam vazio ou erro.

---

## Customização

- **Cores**: `src/styles/globals.css` na seção `:root` (variáveis CSS)
- **Modelos iniciais**: `supabase/schema.sql` seção "Seed inicial"
- **Telefone WhatsApp**: variável de ambiente `VITE_WHATSAPP_NUMBER`
- **Conteúdo das páginas públicas**: cada arquivo em `src/pages/`

---

## Suporte e contato

Site original: separi.com.br
