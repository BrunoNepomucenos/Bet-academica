import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/custom.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'

// Ponto de entrada: envolve a aplicacao com Router e os Providers de Context.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
