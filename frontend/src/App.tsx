import { useState } from 'react'
import './App.css'
import EventCalendarForm from './components/EventCalendarForm.tsx'
import ProtectedConsolidation from './components/ProtectedConsolidation.tsx'

type ActiveView = 'form' | 'consolidation';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('form');

  return (
    <div className="app">
      <header className="app-header">
        <h1>SEAD - Calendário de Eventos</h1>
        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeView === 'form' ? 'active' : ''}`}
            onClick={() => setActiveView('form')}
          >
            Novo Evento
          </button>
          <button 
            className={`nav-btn ${activeView === 'consolidation' ? 'active' : ''}`}
            onClick={() => setActiveView('consolidation')}
          >
            Consolidação
          </button>
        </nav>
      </header>
      <main className="app-main">
        {activeView === 'form' && <EventCalendarForm />}
        {activeView === 'consolidation' && <ProtectedConsolidation />}
      </main>
    </div>
  )
}

export default App
