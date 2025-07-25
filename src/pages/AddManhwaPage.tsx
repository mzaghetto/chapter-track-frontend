import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import ManhwaSearch from '../components/ManhwaSearch';
import ProfileHeader from '../components/ProfileHeader'; // Reusing ProfileHeader for simplicity
import { useAuth } from '../contexts/AuthContext';

const AddManhwaPage = () => {
  const { logout } = useAuth();

  const handleManhwaAdded = () => {
    // Optionally, navigate back to dashboard or show a success message
    console.log('Manhwa added successfully from AddManhwaPage');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ProfileHeader onLogout={logout} />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Manhwa
        </Typography>
        <ManhwaSearch onManhwaAdded={handleManhwaAdded} />
      </Container>
    </Box>
  );
};

export default AddManhwaPage;
