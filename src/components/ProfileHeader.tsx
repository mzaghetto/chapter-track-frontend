import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProfileHeaderProps {
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Logo />
        </Box>
        <Button color="inherit" onClick={handleDashboardClick}>Dashboard</Button>
        {user?.role === 'ADMIN' && (
          <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
        )}
        <Button color="inherit" onClick={onLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default ProfileHeader;
