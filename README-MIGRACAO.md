# Migração v3.8 → v3.9 — Passo a passo

## 0. Backup (recomendado)
Antes de qualquer coisa, faça backup do seu Supabase (pode ser via dashboard → Database → Backups) e do seu repo atual.

---

## 1. Aplicar SQL no Supabase

1. Abra o Supabase → **SQL Editor** → **New query**
2. Cole TODO o conteúdo de `supabase/v38-precos-e-kits.sql`
3. Clique em **Run**
4. Deve aparecer "Success. No rows returned." ou similar

O script é **idempotente** — pode rodar várias vezes sem quebrar.

### O que ele faz:
- Adiciona `price` + `price_visible` em `parts`
- Cria tabelas `kits` e `kit_items`
- Cria views `kits_with_pricing` e `user_visible_kits`
- Altera `quote_items` pra aceitar kit (constraint XOR peça/kit)
- RLS + índices + triggers

---

## 2. Substituir os arquivos do projeto

1. **Faça backup** da sua pasta `src/` atual (renomeie pra `src.backup`)
2. Copie a pasta `src/` desta entrega pra raiz do seu projeto
3. Copie o arquivo `supabase/v38-precos-e-kits.sql` pra dentro da sua pasta `supabase/`

Se você usa Git:
```bash
# extrai o zip em algum lugar temporário
unzip separi-v3.9.zip -d /tmp/separi-v3.9
cd /caminho/do/seu/projeto

# substitui src
rm -rf src
cp -r /tmp/separi-v3.9/src .

# adiciona o sql novo
cp /tmp/separi-v3.9/supabase/v38-precos-e-kits.sql ./supabase/

git add -A
git commit -m "v3.9: preços, kits, páginas dedicadas e responsivo"
```

---

## 3. Rodar
```bash
npm install   # nada novo, mas garante consistência
npm run dev
```

Não há novas dependências.

---

## 4. Testar — fluxo de aceitação

### Como admin:
1. **`/admin/pecas`** — edite uma peça qualquer. Confira:
   - Campo "Preço unitário (R$)"
   - Botão "Visível ao cliente" / "Oculto ao cliente" (pílula teal/cinza)
   - Tabela mostra preço e ícone de olho riscado quando oculto

2. **`/admin/kits`** — clique em "Novo Kit":
   - Preencha código, nome, escolha tipo (`Custom` pra teste)
   - Escolha máquina alvo
   - Escolha um conjunto (opcional)
   - **Adicione peças** pelo seletor da esquerda
   - Veja o **preço base calcular automaticamente** (soma das peças)
   - Mude tipo de ajuste pra `%` e valor `-10` → veja preço final reduzir 10%
   - Mude pra `R$` e valor `200` → veja final = base + 200
   - Salva

### Como cliente:
1. **`/`** (home) — logado como cliente, deve aparecer o bloco "Suas máquinas" abaixo do hero
2. **`/perfil`** — clique em uma máquina **aprovada**
3. **`/perfil/maquinas/:id`** — deve mostrar:
   - Foto + dados + status
   - Bloco "Revisão Preventiva" com 3 cards (Completo / Intermediário / Avulsas)
   - Se você criou kits preventivos no passo anterior, os cards mostram o preço e botão "Adicionar à cotação"
   - "Escolher Peças Avulsas" leva pra `/pecas?machine=...`
4. **`/pecas`** — peças agora vêm em accordion por conjunto. Breadcrumbs no topo
5. **Adicione algumas peças e/ou kits** ao carrinho
6. **Clique no carrinho na navbar** ou em "Minha Cotação" no menu → vai pra `/cotacao` (página dedicada, não modal)
7. Confira o resumo lateral com total estimado
8. Envie a cotação → vai pra `/meus-pedidos`
9. Confira que o pedido lista corretamente kits e peças (kits têm tag "KIT")

### Mobile (largura ≤ 768px):
- Hero vira 1 coluna
- Cotação vira 1 coluna (resumo desce)
- Sidebar do catálogo desce pro topo
- Form de admin (foto+campos) vira 1 coluna

---

## 5. Cadastrar conteúdo inicial

Depois da migração, recomendo cadastrar nessa ordem:

1. **`/admin/pecas`** — coloque preço (mesmo que estimado) nas peças mais importantes. Marque como "Oculto" as que você não quer mostrar
2. **`/admin/kits`** — pra cada modelo de máquina importante, crie:
   - 1 kit **Preventivo Completo** (todas peças críticas)
   - 1 kit **Preventivo Intermediário** (peças essenciais reduzido)
   - Eventualmente kits **Custom** (ex: "Kit Conjunto Tambor", "Kit Vedações")

---

## 6. Se der pau

| Sintoma | Solução |
|---|---|
| Build do React quebra | Confirme que copiou TODOS os arquivos (esp. `src/main.jsx`, `src/App.jsx`, `src/contexts/CartContext.jsx`, `src/styles/v39-additions.css`) |
| Erro `relation "kits" does not exist` no console | Você não rodou o SQL. Rode `v38-precos-e-kits.sql` primeiro |
| Cliente não vê kits | Verifique: (1) kit `is_active=true`, (2) `machine_model_id` casa com alguma máquina **aprovada** do cliente |
| Carrinho antigo "perde" itens | Esperado. Os itens são migrados pro novo formato, mas se o cliente tinha sessão aberta, ele vê uma versão limpa. Sem perda de dados (cotações já enviadas continuam intactas) |
| `/admin/kits` dá 404 | Confirme que o `AdminDashboard.jsx` foi substituído (tem rota `<Route path="kits" element={<AdminKits />} />`) |
| Preço aparece "Sob consulta" pra todos | Você não definiu preço nas peças. Edite cada peça em `/admin/pecas` e coloque preço |

---

## 7. SQL acumulado (estado final)

Ordem cronológica dos scripts no Supabase:

1. `schema.sql` (inicial)
2. `fix-admin-policies.sql`
3. `add-machine-manual.sql`
4. `v36-conjuntos-aplicacoes.sql`
5. `fix-orphan-profiles.sql` (quando aplicável)
6. **`v38-precos-e-kits.sql`** ← novo desta versão

---

## ✅ Checklist final

- [ ] Rodei `v38-precos-e-kits.sql` no Supabase (sem erros)
- [ ] Substituí toda a pasta `src/`
- [ ] `npm run build` passa sem erros
- [ ] `npm run dev` levanta e a home carrega
- [ ] Logado como admin, vejo `/admin/kits` no menu
- [ ] Logado como cliente com máquina aprovada, vejo bloco "Suas máquinas" na home
- [ ] Carrinho leva pra `/cotacao` (página dedicada, não modal)
- [ ] Cadastro de máquina é em `/perfil/maquinas/nova` (não modal)
- [ ] Catálogo `/pecas` mostra peças agrupadas por conjunto
- [ ] Breadcrumbs aparecem em todas as páginas internas
- [ ] Em mobile (largura ≤ 768px), tudo vira 1 coluna

Qualquer dúvida ou problema na execução, manda screenshot ou cola o erro do console.
