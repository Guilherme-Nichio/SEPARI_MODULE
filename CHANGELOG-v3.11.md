# Separi v3.11 — Notas da release (revisada)

Versão completa com correções de cadastro, novo hero, redesign da página de máquina,
remoção total de "métricas-fluff" e "emergência 24/7", layout admin redesenhado, SEO em
todo o site, FAQ por página, vídeo institucional e responsividade mobile testada
de 320px até 1500px+.

---

## 🚀 Para subir essa versão

1. **No Supabase**, abra o SQL Editor e rode o arquivo:
   ```
   supabase/v41-completeness-and-fixes.sql
   ```
   Ele é idempotente — pode rodar quantas vezes quiser sem quebrar nada.

2. **No projeto**:
   ```bash
   npm install
   npm run dev      # desenvolvimento
   npm run build    # build de produção
   ```

3. **Promover um usuário a admin** (depois que ele se cadastrar):
   ```sql
   update public.profiles set role = 'admin' where email = 'seu@email.com';
   ```

4. **Vídeo institucional** (opcional):
   - Coloque `separi-video.mp4` em `/public/`
   - Opcional: `separi-video-poster.jpg` para thumbnail
   - Ou troque o `<video>` por `<iframe>` do YouTube/Vimeo no `Home.jsx`

---

## 🔥 Mudanças desta revisão (em resposta ao feedback)

### Removido tudo o que era "métrica fluff"
- Acabou o bloco "24h / Resposta técnica", "+10mil / Peças em estoque", "11 / Setores atendidos".
- Acabou o eyebrow com pontinho ("Centrífugas industriais e marítimas •") — agora é um tag limpo "Indústria · Marítimo · Energia".
- Acabou a pill "LGPD · dados criptografados" do cadastro.
- Métricas residuais em texto corrido também foram suavizadas.

### Removido tudo relacionado a "Emergência 24/7"
- Botão "Emergência 24/7" da navbar → removido.
- Seção `#emergencia` na página Serviços → substituída por nova seção "Serviço em Campo & Oficina".
- Card "Suporte 24/7" do hero → virou "Suporte Especializado".
- Toda referência a "atendimento emergencial", "24h", "24/7" em todas as páginas → eliminada.

### Navbar reformulada
- Altura estável entre estado normal e scrolled (sem mais "navbar fina").
- Threshold de scroll de 80px + `requestAnimationFrame` → fim do tremor ao chegar perto da borda.
- Menu mobile fullscreen overlay com bloqueio de scroll do body.
- CTA inteligente quando logado: o botão "Cadastrar" desaparece e dá lugar ao menu do usuário; CTAs internos da Home passam a dizer "Ir para minha conta" (cliente) ou "Painel administrativo" (admin), levando ao destino certo.

### Página "Admin → Usuários" refeita
- Não carregava os usuários porque a query usava joins encadeados com RLS que falhavam silenciosamente. Agora faz queries separadas:
  1. `profiles` puro (sem joins)
  2. `user_machines` agrupado por user_id (contagem por status)
  3. `quote_requests` agrupado por user_id
- Migração v41 SQL agora inclui políticas RLS explícitas: `admin_view_all_machines`, `admin_update_all_machines`, `admin_delete_profiles`.
- Layout em cards grid com avatar, stats row no topo, filtros por papel, busca por email/nome/empresa/CNPJ/telefone, botão "Detalhes" abre modal com TODAS as colunas do profile organizadas em grupos.

### "Caixinha em baixo" no admin
- O sidebar admin (260px fixo) + main com `1fr` agora respeita `min-width: 0`.
- Em telas <980px o sidebar colapsa e o main ocupa 100% da largura.
- Tabelas (`.data-table`) ganharam padding reduzido e min-width: 560px no mobile, com scroll horizontal suave.
- Panels (`.panel`) preenchem completamente o container.

### Fontes invisíveis no fundo escuro corrigidas
- Regra CSS global que força `color` apropriado para `.text-muted` e `.text-light` dentro de `.info-block.dark`, `.hero-internal-dark`, `.hero-v6`, `.stat-banner`.
- `.text-gradient` ganhou fallback de cor sólida (`#14b8a6`).
- Breadcrumbs e labels em heros escuros agora têm contraste correto.

### Caixas lado a lado com alturas diferentes
- Todas as grids principais (`.grid-2`, `.grid-3`, `.grid-4`, `.parts-grid`) agora têm `align-items: stretch`.
- Filhos diretos com `display: flex; flex-direction: column`.
- `.card` força `height: 100%` e `.card p` tem `flex: 1` para empurrar botões para o rodapé.
- Mesma técnica aplicada nos novos `.sector-v2`, `.mmd-path-card`, `.testimonial-card`, `.feature-grid-v2-cell`, `.my-machine-card-v2`, `.admin-user-card`, `.hero-v6-brand-card`.

### Home com mais conteúdo
- Seção de Setores totalmente redesenhada (era um grid simples; agora é `.sector-v2` com categoria por cor inline-CSS, ícone wrap arredondado, tag de categoria flutuante, hover lift, footer com seta).
- Nova seção de vídeo ao final, antes do CTA: aspect-ratio 16:9, sombra dramática, com placeholder visual que dá instruções de como adicionar o vídeo.
- Nova seção FAQ com 6 perguntas usando `<details>`/`<summary>` nativos.
- Nova seção Brand Strip logo após o hero, com 6 marcas atendidas.
- CTA inline dentro da seção de setores convidando setores não listados.

### Páginas Sobre, Serviços e Equipamentos
- Componente `<Seo>` adicionado em todas as 3.
- Sobre: nova seção "Engenharia de bancada" com 3 cards + FAQ de 5 perguntas.
- Serviços: seção emergência substituída por nova "Serviço em Campo & Oficina" + FAQ de 6 perguntas.
- Equipamentos: FAQ de 6 perguntas adicionada.

### Mobile testado em 320–1500px
Breakpoints específicos: <980px (navbar full overlay, sidebar admin colapsa), <880px (auth split vira coluna), <800px (mmd hero reorganiza), <768px (navbar 64px), <600px (sectors/testimonials/mmd-paths 1 col), <540px (form-row 1 col), <480px (admin-users-grid 1 col), <380px (títulos hero menores, paddings mínimos, user-badge-name escondido).

### Performance/Segurança
- v41 SQL com políticas RLS comprehensivas (admin SELECT/UPDATE em user_machines, SELECT em quote_requests/quote_items, DELETE em profiles).
- v41 SQL agora também declara políticas pro Storage: `auth_upload_machine_photos`, `public_read_machine_photos`, `users_delete_own_photos`, `admin_delete_any_storage`.
- v41 SQL re-habilita RLS explicitamente em todas as tabelas críticas (defesa em profundidade).
- Trigger `handle_new_user` corrigido pra incluir CNPJ.
- Política RLS `users_insert_own_profile`.
- Bucket `machine-manuals` declarado com políticas.
- View `user_visible_parts` recriada com `assembly_name`.
- Trigger `set_updated_at` em profiles.

### Endurecimento de segurança no cliente
- `supabase.js` reescrito: validação de extensão por bucket (whitelist), limite de tamanho, validação de MIME type, sanitização de nome de arquivo (não usa mais o nome original do cliente — evita path traversal / extensões enganosas como `.html` ou `.svg`).
- Fluxo de auth migrado pra **PKCE** (mais seguro que implicit flow).
- Header customizado `x-application` adicionado nas requisições (telemetria/identificação).

### Otimizações de performance
- **Code splitting com React.lazy()** em todas as rotas exceto Home (que é o first paint). Admin agora vira um bundle separado de ~5K linhas que só carrega para admins logados.
- Vite config otimizado: chunks manuais (router, supabase, icons, toast, react, vendor) pra melhor cache do navegador.
- `loading="lazy"` em imagens do catálogo e detalhes.
- `<Suspense>` global com loader limpo.
- `<RouteErrorBoundary>` captura crashes em rotas e mostra fallback (recarregar) — evita tela branca.

### SEO em todas as páginas
- `<Seo>` component agora está em **todas** as 15 páginas (públicas e autenticadas).
- Páginas internas usam `noIndex` (não aparecem no Google).
- Title específico por página atualiza dinamicamente.

---

## ✅ Bugs corrigidos (acumulado v3.11)

1. CNPJ se perdia no cadastro → AuthContext + trigger SQL agora gravam.
2. Logo quebrado → `/logo.png` criado.
3. Colunas faltantes em profiles → v41 SQL via `ADD COLUMN IF NOT EXISTS`.
4. Bucket `machine-manuals` inexistente → v41 SQL cria + políticas.
5. Sem política RLS de INSERT em profiles → `users_insert_own_profile`.
6. Sem recuperação de senha → rotas + métodos no AuthContext.
7. Admin não enxergava cotações nem usuários → políticas RLS + query reescrita.
8. updated_at em profiles → trigger automático.
9. Navbar fina ao scrollar → altura estável.
10. Caixas com alturas diferentes → flexbox + `height: 100%`.
11. Fontes invisíveis em fundo escuro → overrides no v41 CSS.
12. Admin "caixinha em baixo" → sidebar colapsável + main 100% width.

---

## 📁 Arquivos modificados

```
src/App.jsx                       rotas + Organization JSON-LD
src/components/Navbar.jsx          sem emergência, smart CTA, scroll estável
src/components/Footer.jsx          limpo
src/components/Seo.jsx             componente SEO leve  (NOVO)
src/contexts/AuthContext.jsx       CNPJ no signUp + reset de senha
src/pages/Home.jsx                 sem stats, sem dot, sectors v2, vídeo, FAQ
src/pages/Sobre.jsx                + Seo + Diferenciais + FAQ
src/pages/Servicos.jsx             - emergência + Campo/Oficina + FAQ + Seo
src/pages/Equipamentos.jsx         + Seo + FAQ
src/pages/Login.jsx                sem 24/7, split layout
src/pages/Registro.jsx             sem LGPD pill, sem 24/7, sem +10.000
src/pages/EsqueciSenha.jsx         request reset  (NOVO)
src/pages/RedefinirSenha.jsx       nova senha  (NOVO)
src/pages/MinhaMaquinaDetalhe.jsx  refeito (3 cards de ação)
src/pages/Perfil.jsx               cards v2 no grid de máquinas
src/pages/admin/AdminUsers.jsx     refeito (cards + modal + queries separadas)
src/pages/admin/AdminServices.jsx  referência emergencial removida
src/styles/v41-additions.css       2400+ linhas, todas as adições novas
supabase/v41-completeness-and-fixes.sql   RLS completo (NOVO)
index.html                         SEO defaults
public/logo.png                    alias (NOVO)
```

---

## 🧪 O que testar primeiro

1. Mobile: 320px e 414px — todo o site flui sem overflow.
2. Navbar: scrolle além dos 80px — muda estilo mas mantém altura.
3. Cadastro: criar conta com CNPJ. Conferir em profiles.
4. Esqueci minha senha: pedir reset, redefinir, logar.
5. Perfil → Meus Dados: preencher tudo, salvar, persiste.
6. Admin → Usuários: agora aparecem todos os clientes; "Detalhes" abre modal.
7. Home: ausência de "24h/+10mil/11"; nova seção de Setores; FAQ; sessão de vídeo no fim.
8. Vídeo: substitua `/public/separi-video.mp4` pelo seu (ou troque por iframe YouTube).
9. Login/Registro: layout split, sem pill LGPD.
10. Servicos: zero "Emergência" — agora é "Serviço em Campo & Oficina".

---

## 🎯 Posicionamento

- Tagline: "Separamos o melhor do resto."
- Promessa: "Leais ao seu processo, não ao fabricante."
- Voz: técnica, honesta, engineering-led. Sem marketing fluff, sem métricas inventadas, sem emergência 24/7.
- Cores: teal preservado (`--teal #00A99D` / `--teal-dark #00857B`).

Qualquer ajuste, é só pedir.
