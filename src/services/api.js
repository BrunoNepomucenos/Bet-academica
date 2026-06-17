import axios from 'axios'

// Instancia central do axios (biblioteca de requisicoes HTTP) apontando para o
// JSON Server, nossa "API fake" que serve o db.json.
// Com o baseURL definido aqui, os services so precisam passar o caminho
// (ex.: api.get('/eventos')) em vez da URL completa.

// Backend de producao (json-server hospedado no Render). Precisa ser igual ao
// nome do servico no render.yaml: "bet-academica-api".
const API_PRODUCAO = 'https://bet-academica-api.onrender.com'

// Estamos rodando na maquina do desenvolvedor (npm run dev / localhost)?
const ehLocal =
  typeof window !== 'undefined' &&
  /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)

// Endereco do backend:
// - desenvolvimento local -> localhost:3001 (npm run api);
// - producao              -> backend do Render (sempre o URL correto).
//
// Obs.: NAO usamos VITE_API_URL aqui de proposito. Uma variavel de ambiente
// mal configurada na Vercel (apontando para o URL errado do Render) era a causa
// do erro 404 ao apostar. Fixando o URL no codigo, a producao sempre acerta o
// backend, independentemente do que estiver configurado na Vercel.
const baseURL = ehLocal ? 'http://localhost:3001' : API_PRODUCAO

const api = axios.create({ baseURL })

export default api
