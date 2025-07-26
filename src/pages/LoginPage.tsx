import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { login, googleSSO } from '../services/auth';
import { Button, TextField, Container, Typography, Box, AppBar, Toolbar, Snackbar, Alert } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Logo from '../components/Logo';

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

const LoginPage = () => {
  const { login: authLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'success' | 'info'>('error');
  const [shakeButton, setShakeButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted.');
    try {
      const response = await login({ email, password });
      authLogin(response.data.token);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error: any) {
      console.error('Login failed', error);
      setSnackbarMessage(error.response?.data?.message || 'Login failed. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setShakeButton(true);
      setTimeout(() => setShakeButton(false), 500); // Animation duration
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const response = await googleSSO(credentialResponse.credential);
        authLogin(response.data.token);
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Google SSO failed', error);
        setSnackbarMessage(error.response?.data?.message || 'Google login failed. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setShakeButton(true);
        setTimeout(() => setShakeButton(false), 500); // Animation duration
      }
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    setSnackbarMessage('Google login failed. Please try again.');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    setShakeButton(true);
    setTimeout(() => setShakeButton(false), 500); // Animation duration
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Box>
        </Toolbar>
      </AppBar>
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
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, animation: shakeButton ? `${shake} 0.5s ease-in-out` : 'none' }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/register')}
              sx={{ mb: 2 }}
            >
              Don't have an account? Register
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </Box>
        </Box>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;