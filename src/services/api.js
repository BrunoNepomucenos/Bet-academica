import axios from 'axios'

// Instancia central do axios apontando para o JSON Server.
const api = axios.create({
  baseURL: 'http://localhost:3001',
})

export default api
