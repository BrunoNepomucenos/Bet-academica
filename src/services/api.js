import axios from 'axios'

// Instancia central do axios (biblioteca de requisicoes HTTP) apontando para o
// JSON Server, nossa "API fake" que serve o db.json em http://localhost:3001.
// Com o baseURL definido aqui, os services so precisam passar o caminho
// (ex.: api.get('/eventos')) em vez da URL completa. Centralizar a config
// num unico lugar facilita trocar o endereco do servidor depois.
const api = axios.create({
  baseURL: 'http://localhost:3001',
})

export default api
