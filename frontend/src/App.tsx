import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './components/Home'
import Header from './components/Header'
import Frotas from './pages/Frotas';
import EventoPage from './pages/EventoPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home onSelectModule={(module) => {
              if (module === 'eventos') {
                window.location.href = '/eventos';
              } else if (module === 'frotas') {
                window.location.href = '/frotas';
              }
            }} />} />
            <Route path="/eventos" element={<EventoPage />} />
            <Route path="/consolidation" element={<EventoPage />} />
            <Route path="/frotas" element={<Frotas />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
