import axios from 'axios'

// Instancia central do axios (biblioteca de requisicoes HTTP) apontando para o
// JSON Server, nossa "API fake" que serve o db.json.
// Com o baseURL definido aqui, os services so precisam passar o caminho
// (ex.: api.get('/eventos')) em vez da URL completa. Centralizar a config
// num unico lugar facilita trocar o endereco do servidor depois.
//
// O endereco vem da variavel de ambiente VITE_API_URL (definida na Vercel para
// apontar para o backend hospedado no Render). Se ela nao existir - como no
// desenvolvimento local - usa o localhost:3001 do "npm run api".
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
})

export default api
