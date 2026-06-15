import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

// Componente raiz: barra de navegacao fixa + area de rotas + rodape.
// Layout em coluna para manter o footer sempre ao final da pagina.
export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="app-main container py-4 fade-in-up">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}
