import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  user: {
    name: string;
    username: string;
    role: string;
  } | null;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { displayUsernameInHeader } = useAuth();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Logo />
        </Box>
        {user && <Typography sx={{ mr: 2 }}>Welcome, {displayUsernameInHeader ? user.username : user.name}!</Typography>}
        <Button color="inherit" onClick={handleProfileClick}>Profile</Button>
        {user?.role === 'ADMIN' && (
          <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
        )}
        <Button color="inherit" onClick={onLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
