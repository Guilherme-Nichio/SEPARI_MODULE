# Separi v3.10 — Changelog

Versão focada em **catálogo de serviços**, **kits combinando peças + serviços** e várias melhorias de UX (CTAs mais óbvios, multi-upload de fotos, hero dinâmico, página de perfil profissional).

## 🗄️ Banco de dados — migração obrigatória

Antes de subir a aplicação, **rode o script SQL no Supabase**:

```
supabase/v40-services-and-multi-photos.sql
```

O script é **100% idempotente** — pode rodar de novo sem quebrar. Ele:

- Cria a tabela `services` (catálogo de serviços do admin).
- Cria a tabela `kit_services` (serviços inclusos em kits).
- Cria a tabela `part_images` (multi-foto para peças).
- Cria a tabela `user_machine_photos` (multi-foto para máquinas do cliente).
- Recria as views `kits_with_pricing` e `user_visible_kits` para somar peças + serviços.
- Atualiza a constraint do `quote_items` para suportar `service_id`.
- Adiciona RLS para todas as novas tabelas.
- Adiciona 4 serviços de exemplo (manutenção preventiva, balanceamento dinâmico, instalação, emergência 24h).

## ✨ Novidades por área

### 📦 Admin · Catálogo de Serviços (novo)
- Menu lateral: **Catálogo de Serviços** (`/admin/servicos`).
- CRUD completo: código, nome, descrição, categoria, duração estimada, preço, visibilidade de preço, imagem.
- Banner explicativo no topo: "O que é um serviço".

### 🧰 Admin · Kits com peças + serviços
- O cadastro de kit agora tem duas abas internas: **Peças** e **Serviços**.
- O preço base do kit é a soma de peças + serviços.
- Validação aceita kit com só peças, só serviços ou ambos.
- Tabela de kits mostra a contagem de serviços.

### 🔩 Admin · Cadastro de peça com multi-fotos
- Foto principal continua existindo.
- Nova galeria de **fotos extras** abaixo: anexe várias de uma vez.
- Botão de estrela na foto extra para promovê-la a foto principal.
- Salva na nova tabela `part_images`.

### 👤 Cliente · Página "Minha Conta"
- Header novo profissional: avatar circular com iniciais, nome, empresa, e estatísticas (aprovadas / em análise / total).
- Cards de máquina **simplificados**: foto + marca + modelo + status + um único CTA grande.
- Tab "Meus Dados" com layout sidebar+form e **barra de progresso de completude** do perfil.

### 🛠️ Cliente · Página da máquina (`/perfil/maquinas/:id`)
- **CTAs do topo** (Kit Completo / Kit Intermediário / Peças Avulsas) agora aparecem **logo após o header da máquina** — não precisa mais rolar.
- Banner explicativo: "Como podemos ajudar nesta máquina?"
- Cada card de kit mostra peças **e serviços** inclusos (lista expansível).
- Detalhes técnicos da máquina foram movidos para um painel colapsável abaixo (menos ruído visual).

### 🛒 Cliente · Catálogo de Peças (`/pecas`)
- Cliente seleciona **uma máquina aprovada** no topo (chips visuais com foto).
- Filtro estrito: só aparecem peças compatíveis com a máquina selecionada.
- Faixa fixa no topo com os **CTAs dos kits** (Completo e Intermediário) daquela máquina — sempre visíveis.

### 📷 Cliente · Cadastro de máquina (`/perfil/maquinas/nova`)
- **Multi-upload** de fotos extras (além da foto principal).
- Estrela para promover qualquer foto extra a principal.
- Box de dica destacando a importância das fotos.

### 🏠 Home · Hero dinâmico
- Substituído por hero V4 com:
  - Mesh gradient animado de fundo.
  - Painel industrial vivo (gauges animados de RPM/Temperatura/Eficiência).
  - Onda de sinal pulsante.
  - Chip "ONLINE" pulsando.
  - Badge flutuante "+10.000 peças prontas".
- Mantém estética clean e profissional.

## 🎨 Estilos
- Novo arquivo `src/styles/v40-additions.css` com todas as classes novas.
- Já importado em `src/main.jsx`.
- Totalmente responsivo (mobile cobre 480px, 600px, 900px).

## ✅ Como atualizar

1. Substitua o código-fonte pelo conteúdo deste pacote.
2. No Supabase SQL Editor, rode `supabase/v40-services-and-multi-photos.sql`.
3. Reinstale dependências (`npm install`) e refaça o build (`npm run build`).
4. Faça deploy normal.

Pronto — todas as novas features ficam disponíveis automaticamente para usuários com perfil `admin` e `customer`.
