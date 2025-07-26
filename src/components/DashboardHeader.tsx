import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleProfileClick = () => {
    navigate('/profile');
    setDrawerOpen(false);
  };

  const handleAddManhwaClick = () => {
    navigate('/add-manhwa');
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
        <ListItem component="button" onClick={handleProfileClick}>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem component="button" onClick={handleAddManhwaClick}>
          <ListItemText primary="Add Manhwa" />
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
            {user && <Typography sx={{ mr: 2 }}>Welcome, {displayUsernameInHeader ? user.username : user.name}!</Typography>}
            <Button color="inherit" onClick={handleProfileClick}>Profile</Button>
            <Button color="inherit" onClick={handleAddManhwaClick}>Add Manhwa</Button>
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

export default DashboardHeader;
