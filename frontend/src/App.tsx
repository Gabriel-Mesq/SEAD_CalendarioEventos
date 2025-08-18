import { useState } from 'react'
import './App.css'
import EventCalendarForm from './components/EventCalendarForm.tsx'
import ProtectedConsolidation from './components/ProtectedConsolidation.tsx'
import Home from './components/Home'
import Header from './components/Header'
import { Button, Stack } from '@mui/material'
import Frotas from './pages/Frotas' // Adicione esta linha

type ActiveView = 'home' | 'eventos' | 'consolidation' | 'frotas';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');

  return (
    <div className="app">
      <Header onHomeClick={() => setActiveView('home')} />
      <main className="app-main">
        {activeView === 'home' && (
          <Home onSelectModule={setActiveView} />
        )}
        {activeView === 'eventos' && (
          <div>
            <Stack direction="row" spacing={2} justifyContent="center" className="app-nav" sx={{ mb: 3 }}>
              <Button 
                variant="contained"
                color="success"
                onClick={() => setActiveView('eventos')}
              >
                Novo Evento
              </Button>
              <Button 
                variant="contained"
                color="secondary"
                onClick={() => setActiveView('consolidation')}
              >
                Consolidação
              </Button>
            </Stack>
            <EventCalendarForm />
          </div>
        )}
        {activeView === 'consolidation' && (
          <div>
            <Stack direction="row" spacing={2} justifyContent="center" className="app-nav" sx={{ mb: 3 }}>
              <Button 
                variant="contained"
                color="success"
                onClick={() => setActiveView('eventos')}
              >
                Novo Evento
              </Button>
              <Button 
                variant="contained"
                color="secondary"
                onClick={() => setActiveView('consolidation')}
              >
                Consolidação
              </Button>
            </Stack>
            <ProtectedConsolidation />
          </div>
        )}
        {activeView === 'frotas' && (
          <Frotas /> 
        )}
      </main>
    </div>
  )
}

export default App
