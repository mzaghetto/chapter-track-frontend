import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../services/auth';
import { Button, TextField, Container, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, token, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((response) => {
          const fetchedUser = response.data.user;
          setName(fetchedUser.name || '');
          setUsername(fetchedUser.username || '');
          setEmail(fetchedUser.email || '');
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch profile', error);
          setLoading(false);
          setSnackbarMessage('Failed to load profile.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
    }
  }, [token, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      try {
        const response = await updateProfile(token, { name, username, email });
        // Optionally, refresh the user context after update
        login(response.data.token); // Re-login to update user context with new token/data
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error: any) {
        console.error('Failed to update profile', error);
        setSnackbarMessage(error.response?.data?.message || 'Failed to update profile.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          User Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Profile
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1, mb: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;