import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { login, googleSSO } from '../services/auth';
import { Button, TextField, Container, Typography, Box, AppBar, Toolbar, Snackbar, Alert, IconButton, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { DarkMode, LightMode, Email, Lock, Login as LoginIcon, Menu } from '@mui/icons-material';
import Logo from '../components/Logo';
import { useThemeMode } from '../contexts/ThemeContext';

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

const rotateBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const LoginPage = () => {
  const { login: authLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'success' | 'info'>('error');
  const [shakeButton, setShakeButton] = useState(false);
  const [fromRegister, setFromRegister] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();

  const handleMobileMenuOpen = () => setMobileMenuOpen(true);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Check if user came from registration
    if (location.state?.fromRegister) {
      setFromRegister(true);
      setSnackbarMessage('Registration successful! Please use your email and password to sign in.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      // Clear the state to avoid showing message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

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
        setTimeout(() => setShakeButton(false), 500);
      }
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    setSnackbarMessage('Google login failed. Please try again.');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    setShakeButton(true);
    setTimeout(() => setShakeButton(false), 500);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      {/* Fixed Blue Header - igual ao HomePage */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          height: 64,
        }}
      >
        <Container maxWidth="xl" sx={{ px: '1rem', height: '100%' }}>
          <Toolbar sx={{
            py: 0,
            minHeight: '64px !important',
            height: '100%',
            px: 0,
          }}>
            {/* Logo section */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Logo
                color="white"
                size="medium"
              />
            </Box>

            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mobile menu icon - only visible on mobile */}
              <IconButton
                edge="end"
                onClick={handleMobileMenuOpen}
                sx={{
                  color: 'white',
                  display: { xs: 'flex', sm: 'none' },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Menu />
              </IconButton>

              <Button
                onClick={() => navigate('/')}
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  minWidth: 'auto',
                  px: 0,
                  py: 1,
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'transparent',
                  },
                  transition: 'color 0.2s ease-in-out',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                HOME
              </Button>

              <Button
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: '#1976d2',
                  px: 2.5,
                  py: 0.5,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  borderRadius: '9999px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  minWidth: 'auto',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  display: { xs: 'none', sm: 'block' },
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                REGISTER
              </Button>

              {/* Dark mode toggle */}
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: 'white',
                  p: 1,
                  ml: 1,
                  borderRadius: '9999px',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'colors 0.2s ease-in-out',
                  fontSize: '1.125rem',
                }}
              >
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={handleMobileMenuClose}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': {
                  width: 280,
                  bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : 'white',
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                <List>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => {
                        navigate('/');
                        handleMobileMenuClose();
                      }}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemText
                        primary="Home"
                        sx={{
                          '& .MuiTypography-root': {
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 500,
                            color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => {
                        navigate('/register');
                        handleMobileMenuClose();
                      }}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemText
                        primary="Register"
                        sx={{
                          '& .MuiTypography-root': {
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 500,
                            color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        toggleTheme();
                        handleMobileMenuClose();
                      }}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        sx={{
                          '& .MuiTypography-root': {
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 500,
                            color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Main content - Login form section */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: '3rem', // py-12 = 48px / 16 = 3rem
          px: '1rem', // px-4 sm:px-6 lg:px-8
          position: 'relative',
          bgcolor: theme.palette.mode === 'dark' ? '#111827' : '#F3F4F6', // background-light / background-dark
          minHeight: 'calc(100vh - 64px)', // menos a altura do header
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            opacity: theme.palette.mode === 'dark' ? 0.2 : 0.4,
          }}
        >
          {/* Gradient azul (top-left) */}
          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              bgcolor: theme.palette.mode === 'dark' ? '#1e3a8a' : '#dbeafe',
              filter: 'blur(4rem)', // blur-3xl
              opacity: 0.3,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.3 },
                '50%': { opacity: 0.1 },
                '100%': { opacity: 0.3 },
              },
            }}
          />
          {/* Gradient indigo (bottom-right) */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: '30%',
              height: '30%',
              borderRadius: '50%',
              bgcolor: theme.palette.mode === 'dark' ? '#312e81' : '#e0e7ff',
              filter: 'blur(4rem)', // blur-3xl
              opacity: 0.3,
            }}
          />
        </Box>

        <Container maxWidth="md">
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '28rem', // max-w-md = 28rem = 448px
              }}
            >
              {/* Login Card */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#FFFFFF', // surface-dark / surface-light
                  p: { xs: '2rem', sm: '2.5rem' }, // p-8 sm:p-10 = 32px / 40px
                  borderRadius: '1rem', // rounded-2xl = 16px
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-xl
                  border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`, // border-gray-700 / border-gray-100
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: '2rem' }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontWeight: 800, // font-extrabold
                      fontSize: '1.875rem', // text-3xl = 30px / 16 = 1.875rem
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#111827', // dark:text-white / gray-900
                      letterSpacing: '-0.025em', // tracking-tight
                      mb: 0.5, // mt-2 = 8px / 16 = 0.5rem
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                      color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280', // dark:text-gray-400 / text-gray-500
                      mt: 0.5, // mt-2 = 8px / 16 = 0.5rem
                    }}
                  >
                    Sign in to continue tracking your reading journey
                  </Typography>

                  {/* Success message from registration */}
                  {fromRegister && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: '0.5rem',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.1)' : '#dcfce7',
                        border: '1px solid #22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: '#22c55e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            lineHeight: 1,
                          }}
                        >
                          ✓
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: theme.palette.mode === 'dark' ? '#86efac' : '#166534',
                          textAlign: 'left',
                        }}
                      >
                        Account created! Use your credentials to sign in.
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Form Fields */}
                <Box sx={{ mt: '2rem', spaceY: '1rem' }}>
                  {/* Email Field */}
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="email-address"
                      sx={{
                        display: 'block',
                        fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                        fontWeight: 500, // font-medium
                        color: theme.palette.mode === 'dark' ? '#d1d5db' : '#374151', // dark:text-gray-300 / text-gray-700
                        mb: 0.25, // mb-1 = 4px / 16 = 0.25rem
                      }}
                    >
                      Email Address
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '0.875rem', // Ajustado para 14px
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          pointerEvents: 'none',
                        }}
                      >
                        <Email
                          sx={{
                            fontSize: '1.125rem', // 18px
                            color: '#9ca3af'
                          }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            pl: '1.8rem', // Espaço para o ícone
                            pr: 0, // Sem padding right
                            py: 0, // Sem padding top e bottom
                            fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                            lineHeight: '1.25rem', // leading-5 = 20px / 16 = 1.25rem
                            height: 'auto', // Altura automática baseada no conteúdo
                            bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                            border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#d1d5db'}`, // input-border-dark / input-border-light
                            borderRadius: '0.5rem', // rounded-lg = 8px / 16 = 0.5rem
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#111827',
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused': {
                              borderColor: 'primary.main',
                              boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '0.875rem', // text-sm
                            lineHeight: '1.25rem', // leading-5
                            py: '0.75rem', // py-3 = 12px / 16 = 0.75rem para altura interna
                            '&::placeholder': {
                              color: '#9ca3af', // placeholder-gray-400
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Password Field */}
                  <Box sx={{ position: 'relative', mt: '1rem' }}>
                    <Typography
                      component="label"
                      htmlFor="password"
                      sx={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: theme.palette.mode === 'dark' ? '#d1d5db' : '#374151',
                        mb: 0.25,
                      }}
                    >
                      Password
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '0.875rem', // Ajustado para 14px
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          pointerEvents: 'none',
                        }}
                      >
                        <Lock
                          sx={{
                            fontSize: '1.125rem', // 18px
                            color: '#9ca3af'
                          }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            pl: '1.8rem', // Espaço para o ícone
                            pr: 0, // Sem padding right
                            py: 0, // Sem padding top e bottom
                            fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                            lineHeight: '1.25rem', // leading-5 = 20px / 16 = 1.25rem
                            height: 'auto', // Altura automática baseada no conteúdo
                            bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                            border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#d1d5db'}`, // input-border-dark / input-border-light
                            borderRadius: '0.5rem', // rounded-lg = 8px / 16 = 0.5rem
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#111827',
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused': {
                              borderColor: 'primary.main',
                              boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: '0.875rem', // text-sm
                            lineHeight: '1.25rem', // leading-5
                            py: '0.75rem', // py-3 = 12px / 16 = 0.75rem para altura interna
                            '&::placeholder': {
                              color: '#9ca3af', // placeholder-gray-400
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Forgot Password */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '1rem' }}>
                    <Button
                      onClick={() => navigate('/forgot-password')}
                      sx={{
                        fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                        fontWeight: 500, // font-medium
                        color: 'primary.main',
                        textTransform: 'none',
                        py: 0,
                        minWidth: 'auto',
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: '#1d4ed8', // primaryHover
                        },
                      }}
                    >
                      Forgot your password?
                    </Button>
                  </Box>
                </Box>

                {/* Sign In Button */}
                <Box sx={{ mt: '1rem' }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={shakeButton}
                    sx={{
                      p: '0.75rem', // padding = 12px / 16 = 0.75rem
                      fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                      fontWeight: 700, // font-bold
                      borderRadius: '0.5rem', // rounded-lg = 8px / 16 = 0.5rem
                      textTransform: 'none',
                      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)', // shadow-lg
                      position: 'relative',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: '#1d4ed8', // primaryHover
                        transform: 'translateY(-2px)', // hover:-translate-y-0.5 = -8px / 16 = -0.5rem
                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)', // shadow-glow
                      },
                      animation: shakeButton ? `${shake} 0.5s ease-in-out` : 'none',
                    }}
                  >
                    {/* Icon */}
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        pl: 1, // Aumentado para 16px de espaçamento na esquerda
                      }}
                    >
                        <LoginIcon
                          sx={{
                            width: '1.5rem', // 24px
                            height: '1.5rem', // 24px
                            color: '#93c5fd', // text-blue-300
                            transition: 'color 0.2s ease-in-out',
                          }}
                        />
                    </Box>
                    SIGN IN
                  </Button>
                </Box>

                {/* Divider */}
                <Box sx={{ position: 'relative', my: '1.5rem' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '1px',
                        bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb', // border-gray-700 / border-gray-200
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        px: '0.5rem', // px-2 = 8px / 16 = 0.5rem
                        fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                        color: theme.palette.mode === 'dark' ? '#6b7280' : '#9ca3af', // dark:text-gray-400 / text-gray-500
                        bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#FFFFFF', // surface-dark / surface-light
                      }}
                    >
                      Or continue with
                    </Typography>
                  </Box>
                </Box>

                {/* Google Login Button */}
                <Box>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signin_with"
                    locale="pt_BR"
                    shape="rectangular"
                    width="100%"
                    theme="filled_blue"
                  />
                </Box>

                {/* Register Link */}
                <Box sx={{ mt: '2rem', textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                      color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280', // dark:text-gray-400 / text-gray-600
                    }}
                  >
                    Don't have an account?{' '}
                    <Box
                      component="span"
                      onClick={() => navigate('/register')}
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 700, // font-bold
                        color: 'primary.main',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease-in-out, text-decoration 0.2s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#1d4ed8', // primaryHover
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Register now
                    </Box>
                  </Typography>
                </Box>
              </Box>

              {/* Copyright */}
              <Box
                sx={{
                  textAlign: 'center',
                  mt: '2rem',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem', // text-xs = 12px / 16 = 0.75rem
                    color: theme.palette.mode === 'dark' ? '#6b7280' : '#9ca3af', // dark:text-gray-500 / text-gray-400
                  }}
                >
                  © {new Date().getFullYear()} ChapterTrack. All rights reserved.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          top: '80px',
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            minWidth: '300px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;