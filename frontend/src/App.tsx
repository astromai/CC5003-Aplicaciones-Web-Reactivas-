import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Malla from './components/malla'
import Detalle from './components/detalle'
import Login from './components/login'
import Register from './components/register'
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
    setShowRegister(false) // Volver a Login, no Register
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
            <p>
              {user?.username} logueado 
              <button onClick={handleLogout}>
                logout
              </button>
            </p>
            <Routes>
              <Route path="/" element={<Malla />} />
              <Route path="/curso/:id" element={<Detalle />} />
            </Routes>
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}


export default App


