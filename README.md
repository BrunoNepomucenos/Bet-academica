# 🎯 Bet Acadêmica — Sistema Simulado de Apostas Esportivas

Plataforma **acadêmica** de apostas esportivas **fictícias**, desenvolvida em **React**.
Todos os valores, saldos, apostas, prêmios e bônus são simulados e usados apenas para fins
educacionais. **Não há dinheiro real, PIX, cartão, gateway de pagamento, criptomoedas ou
integração com sites reais de apostas.**

---

## 👥 Integrantes

Bruno Nepomuceno
Cícero Gomes


---

## 📝 Descrição geral do sistema

A aplicação possui dois perfis com acessos distintos:

- **Administrador** — cadastra e **edita** eventos esportivos, controla a abertura/encerramento
  das apostas, lança os resultados, concede bônus e acompanha o painel estatístico (incluindo
  top de jogadores).
- **Usuário/Jogador** — cadastra-se na plataforma, visualiza os eventos disponíveis (com filtro
  e busca), realiza apostas fictícias, **cancela apostas pendentes**, acompanha o saldo simulado,
  recarrega a carteira, consulta o histórico filtrável e o ranking.

Os dados são consumidos de uma **API simulada com JSON Server** (`db.json`) via **axios**.

---

## ⭐ Funcionalidades extras escolhidas

Foram implementadas **várias** funcionalidades extras, todas integradas ao JSON Server e
diretamente relacionadas ao tema do sistema:

1. **Ranking dos jogadores** (`/ranking`) — classifica os jogadores pelo saldo fictício.
2. **Sistema de bônus** (`/admin/bonus`) — o administrador credita bônus a um jogador,
   alterando o saldo e registrando a movimentação.
3. **Painel estatístico do administrador** (`/admin`) — resumo da plataforma (eventos,
   jogadores, volume apostado, distribuição de apostas por status, eventos por esporte e
   top 5 jogadores).
4. **Filtro de eventos por esporte + busca** — na tela de eventos disponíveis do jogador.
5. **Extrato de movimentações** — no painel do jogador (apostas, prêmios, bônus, recargas,
   estornos).
6. **Simulação de carteira do jogador** (`/perfil`) — recarga de saldo fictício com valores
   rápidos, registrada no extrato.
7. **Cancelamento de aposta pendente** — o jogador cancela uma aposta em evento ainda aberto
   e recebe o valor estornado.
8. **Cadastro de novo jogador** (`/cadastro`) — com bônus de boas-vindas fictício.
9. **Página de regulamento** (`/regulamento`) — regras de negócio da plataforma.
10. **Tema claro/escuro** (Context API + `data-bs-theme`), persistido no `localStorage`.

---

## 📜 Regras de negócio

- Apostas só podem ser feitas em eventos com status **aberto**.
- O valor da aposta não pode ultrapassar o **saldo** do jogador (validação no formulário).
- Ao apostar, o saldo é **debitado** e a aposta entra como **pendente**.
- O jogador pode **cancelar** uma aposta pendente enquanto o evento estiver **aberto**; o valor
  é **estornado** integralmente e a aposta vira **cancelada**.
- O administrador pode **encerrar** as apostas de um evento (bloqueia novas apostas).
- Ao **lançar o resultado**, cada aposta pendente do evento é atualizada:
  - palpite correto → status **ganha**, `retorno = valor × odd`, prêmio creditado no saldo;
  - palpite incorreto → status **perdida**, retorno 0.
- Novos jogadores recebem **R$ 500** de bônus de boas-vindas; o jogador pode **recarregar**
  saldo fictício pela carteira.
- **Usuário comum não acessa** funcionalidades administrativas.
- **Administrador não realiza apostas** como jogador.

---

## 🛠️ Tecnologias utilizadas

- **React 18** + **Vite**
- **React Router DOM** (rotas e rotas protegidas)
- **React Hooks** (`useState`, `useEffect`, `useContext`, `useMemo`, `useCallback` + hooks
  customizados `useAuth` / `useToast` / `useTheme`)
- **Context API** (`AuthContext`, `ToastContext`, `ThemeContext`)
- **JSON Server** (API fake)
- **axios** (consumo da API)
- **React-Bootstrap + Bootstrap 5.3** (estilização, responsividade e modo escuro nativo)
- **CSS** customizado (design system com variáveis, gradientes e animações)

---

## ▶️ Como executar

> É necessário ter o **Node.js** instalado.

### 1. Instalar as dependências
```bash
npm install
```

### 2. Iniciar o JSON Server (API) — terminal 1
```bash
npm run api
```
A API ficará disponível em **http://localhost:3001**.

### 3. Iniciar o React (front-end) — terminal 2
```bash
npm run dev
```
A aplicação abrirá em **http://localhost:5173**.

> Mantenha os **dois terminais** rodando ao mesmo tempo.

---

## 🔑 Usuários de teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Administrador | `admin@bet.com` | `123` |
| Jogador | `joao@bet.com` | `123` |
| Jogador | `maria@bet.com` | `123` |
| Jogador | `carlos@bet.com` | `123` |

> Na tela de login há **chips de acesso rápido** que preenchem o formulário automaticamente.
> Também é possível **criar uma nova conta** em `/cadastro`.

---

## 🗺️ Principais rotas do sistema

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Pública | Login simulado |
| `/cadastro` | Pública | Cadastro de novo jogador (extra) |
| `/regulamento` | Autenticado | Regras da plataforma (extra) |
| `/admin` | Administrador | Painel estatístico (extra) |
| `/admin/eventos` | Administrador | Cadastro/edição de eventos, encerrar apostas, lançar resultado |
| `/admin/bonus` | Administrador | Concessão de bônus (extra) |
| `/dashboard` | Jogador | Resumo, saldo e extrato |
| `/eventos` | Jogador | Eventos disponíveis + filtro/busca + apostar |
| `/historico` | Jogador | Histórico filtrável + cancelamento de apostas |
| `/ranking` | Jogador | Ranking de jogadores (extra) |
| `/perfil` | Jogador | Carteira e recarga de saldo (extra) |

---

## 🧩 Organização do código

```
src/
├── components/   # Reutilizáveis (Navbar, Footer, EventoCard, ApostaModal,
│                 #  StatCard, EmptyState, ConfirmModal, StatusBadge, Loader)
├── contexts/     # Context API (AuthContext, ToastContext, ThemeContext)
├── pages/        # Páginas: Login, Cadastro, Regulamento + admin/ e user/
├── services/     # Consumo da API com axios (usuarios, eventos, apostas)
├── routes/       # Rotas e controle de acesso (PrivateRoute, RoleRoute, AppRoutes)
├── styles/       # CSS complementar (design system)
├── App.jsx
└── main.jsx
```

### Como o Context API e os Hooks foram usados
- **AuthContext** guarda o usuário logado, persiste a sessão no `localStorage` e expõe
  `login`, `logout` e `atualizarUsuario` (mantém o saldo sincronizado). Consumido por `useAuth()`.
- **ToastContext** centraliza as notificações da aplicação via `useToast()`.
- **ThemeContext** controla o tema claro/escuro, persiste em `localStorage` e aplica
  `data-bs-theme`, via `useTheme()`.
- Hooks como `useEffect` carregam os dados da API; `useMemo` otimiza filtros/buscas;
  `useCallback` memoiza ações dos contexts.

---

## 🖼️ Principais telas

- **Login** — layout em duas colunas (hero + formulário) com acesso rápido e link de cadastro.
- **Cadastro** — criação de conta com bônus de boas-vindas.
- **Painel do Administrador** — cards de estatística, gráficos e top de jogadores.
- **Gerenciamento de Eventos** — formulário de cadastro/edição + tabela com ações
  (editar / encerrar / resultado / excluir com confirmação).
- **Painel do Jogador** — saldo, estatísticas, aproveitamento e extrato de movimentações.
- **Eventos Disponíveis** — cards com filtro por esporte, busca e modal de aposta.
- **Histórico de Apostas** — tabela com filtros por status, busca e cancelamento.
- **Carteira / Perfil** — dados da conta e recarga de saldo fictício.
- **Ranking** — classificação dos jogadores pelo saldo.
- **Regulamento** — regras da plataforma em accordion.

> Substitua esta seção por prints reais das telas na entrega.

---

## 🚧 Dificuldades encontradas

- Sincronizar o saldo do JSON Server com o estado global após cada aposta/prêmio/estorno.
- Processar o resultado de um evento atualizando todas as apostas e creditando os ganhadores.
- Garantir o controle de acesso por perfil nas rotas.
- Implementar o tema escuro reutilizando o suporte nativo do Bootstrap 5.3.

> Ajuste conforme a experiência real da dupla.

---

## 🔮 Melhorias futuras

- Autenticação real com token (JWT) e back-end próprio.
- Hash de senhas (atualmente são fictícias e em texto puro, apenas para simulação).
- Paginação nos eventos e no histórico.
- Apostas múltiplas e diferentes mercados além de vencedor.
- Notificações em tempo real quando um evento é finalizado.
