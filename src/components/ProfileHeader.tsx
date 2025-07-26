import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProfileHeaderProps {
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setDrawerOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setDrawerOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setDrawerOpen(false);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem component="button" onClick={handleDashboardClick}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {user?.role === 'ADMIN' && (
          <ListItem component="button" onClick={handleAdminClick}>
            <ListItemText primary="Admin" />
          </ListItem>
        )}
        <ListItem component="button" onClick={handleLogoutClick}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Logo />
        </Box>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={handleDashboardClick}>Dashboard</Button>
            {user?.role === 'ADMIN' && (
              <Button color="inherit" onClick={handleAdminClick}>Admin</Button>
            )}
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ProfileHeader;
