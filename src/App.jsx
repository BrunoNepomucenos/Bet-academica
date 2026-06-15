import Navbar from './components/Navbar.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

// Componente raiz: barra de navegacao fixa + area de rotas.
export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <AppRoutes />
      </main>
    </>
  )
}
