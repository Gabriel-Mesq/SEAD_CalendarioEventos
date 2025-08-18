import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

type HeaderProps = {
  onHomeClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => (
  <AppBar position="static" sx={{ bgcolor: 'success.main', cursor: 'pointer' }} elevation={3}>
    <Toolbar>
      <Typography
        variant="h5"
        component="div"
        fontWeight={700}
        sx={{ flexGrow: 1 }}
        onClick={onHomeClick}
      >
        HUB SEAD
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;