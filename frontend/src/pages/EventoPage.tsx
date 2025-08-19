import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import EventCalendarForm from '../components/EventCalendarForm';
import ProtectedConsolidation from '../components/ProtectedConsolidation';

const EventoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define qual botão está ativo baseado na rota
  const activeButton = location.pathname === '/eventos' ? 'eventos' : 'consolidation';

  return (
    <div>
      <div className="event-calendar-nav">
        <Stack direction="row" spacing={2} justifyContent="center" className="app-nav" sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color={activeButton === 'eventos' ? 'primary' : 'inherit'}
            className={activeButton === 'eventos' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => navigate('/eventos')}
          >
            Novo Evento
          </Button>
          <Button
            variant="contained"
            color={activeButton === 'consolidation' ? 'primary' : 'inherit'}
            className={activeButton === 'consolidation' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => navigate('/consolidation')}
          >
            Consolidação
          </Button>
        </Stack>
      </div>
      {activeButton === 'eventos' ? <EventCalendarForm /> : <ProtectedConsolidation />}
    </div>
  );
};

export default EventoPage;