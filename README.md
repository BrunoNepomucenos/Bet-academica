# 🎯 Bet Acadêmica — Sistema Simulado de Apostas Esportivas

Plataforma **acadêmica** de apostas esportivas **fictícias**, desenvolvida em **React**.
Todos os valores, saldos, apostas, prêmios e bônus são simulados e usados apenas para fins
educacionais. **Não há dinheiro real, PIX, cartão, gateway de pagamento ou integração com
sites reais de apostas.**

---

## 👥 Integrantes

| Integrante | Responsabilidades principais |
|------------|------------------------------|
| **[Integrante 1]** | Estrutura inicial, Context API (Auth/Toast), login, rotas protegidas, área do administrador (eventos, resultado, painel estatístico) |
| **[Integrante 2]** | Serviços (axios), área do jogador (eventos, apostas, saldo), histórico, dashboard, funcionalidades extras (ranking, bônus, filtro) |

> Substitua os nomes acima pelos nomes reais da dupla.

---

## 📝 Descrição geral do sistema

A aplicação possui dois perfis com acessos distintos:

- **Administrador** — cadastra eventos esportivos, controla a abertura/encerramento das
  apostas, lança os resultados, concede bônus e acompanha o painel estatístico.
- **Usuário/Jogador** — visualiza os eventos disponíveis, realiza apostas fictícias,
  acompanha o saldo simulado, consulta o histórico e o ranking.

Os dados são consumidos de uma **API simulada com JSON Server** (`db.json`).

---

## ⭐ Funcionalidades extras escolhidas

Foram implementadas **quatro** funcionalidades extras, todas integradas ao JSON Server:

1. **Ranking dos jogadores** (`/ranking`) — classifica os jogadores pelo saldo fictício.
2. **Sistema de bônus** (`/admin/bonus`) — o administrador credita bônus a um jogador,
   alterando o saldo e registrando a movimentação.
3. **Painel estatístico do administrador** (`/admin`) — resumo da plataforma (eventos,
   jogadores, volume apostado, distribuição de apostas por status e eventos por esporte).
4. **Filtro de eventos por esporte** — na tela de eventos disponíveis do jogador.

Como bônus de organização, há ainda um **extrato de movimentações** no painel do jogador.

---

## 📜 Regras de negócio

- Apostas só podem ser feitas em eventos com status **aberto**.
- O valor da aposta não pode ultrapassar o **saldo** do jogador (validação no formulário).
- Ao apostar, o saldo é **debitado** e a aposta entra como **pendente**.
- O administrador pode **encerrar** as apostas de um evento (bloqueia novas apostas).
- Ao **lançar o resultado**, cada aposta pendente do evento é atualizada:
  - palpite correto → status **ganha**, `retorno = valor × odd`, prêmio creditado no saldo;
  - palpite incorreto → status **perdida**, retorno 0.
- **Usuário comum não acessa** funcionalidades administrativas.
- **Administrador não realiza apostas** como jogador.

---

## 🛠️ Tecnologias utilizadas

- **React 18** + **Vite**
- **React Router DOM** (rotas e rotas protegidas)
- **React Hooks** (`useState`, `useEffect`, `useContext`, `useMemo`, `useCallback` + hooks customizados `useAuth`/`useToast`)
- **Context API** (`AuthContext`, `ToastContext`)
- **JSON Server** (API fake)
- **axios** (consumo da API)
- **React-Bootstrap + Bootstrap 5** (estilização e responsividade)

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

---

## 🗺️ Principais rotas do sistema

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Pública | Login simulado |
| `/admin` | Administrador | Painel estatístico (extra) |
| `/admin/eventos` | Administrador | Cadastro/listagem de eventos, encerrar apostas, lançar resultado |
| `/admin/bonus` | Administrador | Concessão de bônus (extra) |
| `/dashboard` | Jogador | Resumo, saldo e extrato |
| `/eventos` | Jogador | Eventos disponíveis + filtro + apostar |
| `/historico` | Jogador | Histórico de apostas |
| `/ranking` | Jogador | Ranking de jogadores (extra) |

---

## 🧩 Organização do código

```
src/
├── components/   # Componentes reutilizáveis (Navbar, EventoCard, ApostaModal, etc.)
├── contexts/     # Context API (AuthContext, ToastContext)
├── pages/        # Páginas (admin/ e user/) + Login
├── services/     # Consumo da API com axios (usuarios, eventos, apostas)
├── routes/       # Rotas e controle de acesso (PrivateRoute, RoleRoute)
├── styles/       # CSS complementar
├── App.jsx
└── main.jsx
```

### Como o Context API e os Hooks foram usados
- **AuthContext** guarda o usuário logado, persiste a sessão no `localStorage` e expõe
  `login`, `logout` e `atualizarUsuario` (mantém o saldo sincronizado). Consumido pelo
  hook `useAuth()`.
- **ToastContext** centraliza as notificações da aplicação via hook `useToast()`.
- Hooks como `useEffect` carregam os dados da API; `useMemo` otimiza o filtro de eventos.

---

## 🖼️ Principais telas

- **Login** — formulário de acesso com usuários de teste.
- **Painel do Administrador** — cards e gráficos de resumo da plataforma.
- **Gerenciamento de Eventos** — formulário de cadastro + tabela com ações (encerrar/resultado/excluir).
- **Painel do Jogador** — saldo, estatísticas e extrato de movimentações.
- **Eventos Disponíveis** — cards de eventos com filtro por esporte e modal de aposta.
- **Histórico de Apostas** — tabela com status atualizado após o resultado.
- **Ranking** — classificação dos jogadores pelo saldo.

> Substitua esta seção por prints reais das telas na entrega.

---

## 🚧 Dificuldades encontradas

- Sincronizar o saldo do JSON Server com o estado global após cada aposta/prêmio.
- Processar o resultado de um evento atualizando todas as apostas e creditando os ganhadores.
- Garantir o controle de acesso por perfil nas rotas.

> Ajuste conforme a experiência real da dupla.

---

## 🔮 Melhorias futuras

- Autenticação real com token (JWT) e back-end próprio.
- Hash de senhas (atualmente são fictícias e em texto puro, apenas para simulação).
- Paginação e busca nos eventos e no histórico.
- Apostas múltiplas e diferentes mercados além de vencedor.
