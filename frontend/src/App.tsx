import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MallaView from './components/malla'
import Detalle from './components/detalle'
import Login from './components/login'
import Register from './components/register'
import ListaMallas from './components/listaMallas'
import CrearMalla from './components/crearMalla'
import { useUserStore } from './stores/userStore'
import './App.css'

function App() {
  const { user, isAuthenticated, restoreSession, logout } = useUserStore()
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  const handleLogout = () => {
    logout()
    setShowRegister(false)
  }

  return (
    <BrowserRouter>
      {}
      <div className="min-h-screen flex flex-col text-white">
        
        {/* --- Navbar Glassmorphism --- */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              
              {/* Logo / Título */}
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                  U
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  U-Ramos
                </span>
              </div>

              {/* Usuario / Logout */}
              {isAuthenticated && (
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="font-sans text-xl text-slate-300">
                      {user?.username}
                    </span>

                  </div>
                  
                  <div className="h-8 w-[1px] bg-slate-700 mx-1 hidden md:block"></div>

                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-white/10"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* --- Contenido Principal --- */}
        <main className="flex-1 relative">
          {/* Rutas */}
          {!isAuthenticated ? (
            <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
              {showRegister ? (
                <Register />
              ) : (
                <Login onShowRegister={() => setShowRegister(true)} />
              )}
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/mis-mallas" replace />} />
              <Route path="/mis-mallas" element={<ListaMallas />} />
              <Route path="/crear-malla" element={<CrearMalla />} />
              <Route path="/malla/:mallaId" element={<MallaView />} />
              <Route path="/curso/:id" element={<Detalle />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App