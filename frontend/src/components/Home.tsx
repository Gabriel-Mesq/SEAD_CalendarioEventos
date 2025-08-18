import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Avatar, Stack } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

type HomeProps = {
  onSelectModule: (module: 'eventos' | 'frotas') => void;
};

const cardStyles = {
  minWidth: 270,
  maxWidth: 320,
  borderRadius: 3,
  boxShadow: 6,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.04)',
    boxShadow: 12,
  },
  background: 'linear-gradient(135deg, #e8f5e9 0%, #fff 100%)',
  border: '2px solid #43a047',
};

const iconStyles = {
  bgcolor: 'success.main',
  color: 'white',
  width: 56,
  height: 56,
  mb: 2,
  boxShadow: 2,
  border: '2px solid #388e3c',
};

const carIconStyles = {
  ...iconStyles,
  bgcolor: 'secondary.main',
  border: '2px solid #388e3c',
};

const Home: React.FC<HomeProps> = ({ onSelectModule }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mt: 6,
    }}
  >
    <Typography variant="h3" gutterBottom fontWeight={700} color="success.main">
      HUB SEAD
    </Typography>
    <Typography variant="body1" gutterBottom>
      Selecione o módulo que deseja acessar:
    </Typography>
    <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
      <Card sx={cardStyles}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={iconStyles}>
            <EventIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" gutterBottom fontWeight={600} color="success.dark">
            Calendário de Eventos
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Gerencie e visualize os eventos da SEAD com facilidade.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => onSelectModule('eventos')}
            fullWidth
            sx={{ fontWeight: 600, letterSpacing: 1 }}
          >
            Acessar
          </Button>
        </CardActions>
      </Card>
      <Card sx={cardStyles}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={carIconStyles}>
            <DirectionsCarIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" gutterBottom fontWeight={600} color="success.dark">
            Controle de Frotas
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Gerencie os veículos e reservas da frota SEAD de forma prática.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => onSelectModule('frotas')}
            fullWidth
            sx={{ fontWeight: 600, letterSpacing: 1 }}
          >
            Acessar
          </Button>
        </CardActions>
      </Card>
    </Stack>
  </Box>
);

export default Home;