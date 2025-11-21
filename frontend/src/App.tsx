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
      <div>
        <h1 style={{ textAlign: 'center', margin: 24 }}>Malla Curricular</h1>
        
        {!isAuthenticated ? (
          showRegister ? (
            <Register />
          ) : (
            <Login onShowRegister={() => setShowRegister(true)} />
          )
        ) : (
          <div>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              {user?.username} logueado 
              <button onClick={handleLogout} style={{ marginLeft: '12px' }}>
                logout
              </button>
            </p>
            <Routes>
              <Route path="/" element={<Navigate to="/mis-mallas" replace />} />
              <Route path="/mis-mallas" element={<ListaMallas />} />
              <Route path="/crear-malla" element={<CrearMalla />} />
              <Route path="/malla/:mallaId" element={<MallaView />} />
              <Route path="/curso/:id" element={<Detalle />} />
            </Routes>
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}


export default App


