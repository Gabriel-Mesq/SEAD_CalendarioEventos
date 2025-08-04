import './App.css'
import EventCalendarForm from './components/EventCalendarForm.tsx'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>SEAD - Calendário de Eventos</h1>
      </header>
      <main className="app-main">
        <EventCalendarForm />
      </main>
    </div>
  )
}

export default App
