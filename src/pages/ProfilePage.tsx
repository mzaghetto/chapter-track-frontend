import React, { useState } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import UserInformation from '../components/UserInformation';
import TelegramIntegration from '../components/TelegramIntegration';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

const ProfilePage = () => {
  const { logout } = useAuth();
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' });

  const handleShowSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ProfileHeader onLogout={logout} />
      <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Profile
          </Typography>
          <UserInformation onShowSnackbar={handleShowSnackbar} />
          <TelegramIntegration onShowSnackbar={handleShowSnackbar} />
        </Paper>
      </Container>
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default ProfilePage;