import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Malla from './components/malla'
import Detalle from './components/detalle'
import Login from './components/login'
import Register from './components/Register'
import loginService from './services/login'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const init = async () => {
      const user = await loginService.restoreLogin()
      setUser(user)
    }
    init()
  }, [])

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    setShowRegister(false) // Volver a Login, no Register
  }

  return (
    <BrowserRouter>
      <div>
        <h1 style={{ textAlign: 'center', margin: 24 }}>Malla Curricular</h1>
        
        {!user ? (
          showRegister ? (
            <Register onRegisterSuccess={setUser} />
          ) : (
            <Login onLoginSuccess={setUser} onShowRegister={() => setShowRegister(true)} />
          )
        ) : (
          <div>
            <p>
              {user.username} logueado 
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


