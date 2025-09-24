import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Malla from './components/malla'
import Detalle from './components/detalle'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1 style={{ textAlign: 'center', margin: 24 }}>Malla Curricular</h1>
        <Routes>
          <Route path="/" element={<Malla />} />
          <Route path="/curso/:id" element={<Detalle />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}


export default App


