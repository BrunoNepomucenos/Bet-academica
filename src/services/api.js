import axios from 'axios'

// Instancia central do axios (biblioteca de requisicoes HTTP) apontando para o
// JSON Server, nossa "API fake" que serve o db.json.
// Com o baseURL definido aqui, os services so precisam passar o caminho
// (ex.: api.get('/eventos')) em vez da URL completa.

// Backend de producao (json-server hospedado no Render). Mantenha igual ao nome
// do servico no render.yaml: "bet-academica-api".
const API_PRODUCAO = 'https://bet-academica-api.onrender.com'

// Estamos rodando na maquina do desenvolvedor (npm run dev)?
const ehLocal =
  typeof window !== 'undefined' &&
  /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)

// Define o endereco do backend, nesta ordem de prioridade:
// 1) VITE_API_URL  -> se definida (e nao vazia) na Vercel/ambiente;
// 2) localhost:3001 -> em desenvolvimento local (npm run api);
// 3) Render        -> em producao, mesmo sem variavel de ambiente configurada.
// O .replace remove uma eventual barra final para nao gerar URLs com "//".
const baseURL = (
  import.meta.env.VITE_API_URL ||
  (ehLocal ? 'http://localhost:3001' : API_PRODUCAO)
).replace(/\/+$/, '')

const api = axios.create({ baseURL })

export default api
