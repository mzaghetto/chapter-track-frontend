import React, { useState } from 'react';
import { Box, Typography, Container, AppBar, Toolbar, Button, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ManhwaManagement from '../components/ManhwaManagement';
import ProviderManagement from '../components/ProviderManagement';
import ManhwaProviderManagement from '../components/ManhwaProviderManagement';
import ManhwaProviderList from '../components/ManhwaProviderList';

const AdminPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MangaToRead Admin
          </Typography>
          <Button color="inherit" onClick={handleDashboardClick}>Dashboard</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Manhwa Management" />
            <Tab label="Provider Management" />
            <Tab label="Manhwa-Provider Management" />
            <Tab label="Manhwa-Provider List" />
          </Tabs>
        </Box>
        {selectedTab === 0 && (
          <Box sx={{ p: 3 }}>
            <ManhwaManagement />
          </Box>
        )}
        {selectedTab === 1 && (
          <Box sx={{ p: 3 }}>
            <ProviderManagement />
          </Box>
        )}
        {selectedTab === 2 && (
          <Box sx={{ p: 3 }}>
            <ManhwaProviderManagement />
          </Box>
        )}
        {selectedTab === 3 && (
          <Box sx={{ p: 3 }}>
            <ManhwaProviderList />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminPage;
