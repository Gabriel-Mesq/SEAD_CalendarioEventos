import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  onHomeClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      navigate('/');
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'success.main', cursor: 'pointer' }} elevation={3}>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          fontWeight={700}
          sx={{ flexGrow: 1 }}
          onClick={handleHomeClick}
        >
          HUB SEAD
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;