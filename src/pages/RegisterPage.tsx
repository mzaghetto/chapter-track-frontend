import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  Paper,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Badge,
  Mail,
  Person,
  Lock,
  Menu
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useThemeMode } from '../contexts/ThemeContext';
import { DarkMode, LightMode } from '@mui/icons-material';
import { register } from '../services/auth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();

  const handleMobileMenuOpen = () => setMobileMenuOpen(true);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({ name, username, email, password });
      showSnackbar('Registration successful! Redirecting to login...', 'success');

      // Redirect after showing success message with state
      setTimeout(() => {
        navigate('/login', { state: { fromRegister: true } });
      }, 3000);
    } catch (error: any) {
      console.error('Registration failed', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Same Header as HomePage */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          height: 64,
        }}
      >
        <Container maxWidth="xl" sx={{ px: 4, height: '100%' }}>
          <Toolbar sx={{
            py: 0,
            minHeight: '64px !important',
            height: '100%',
            px: 0,
          }}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Logo color="white" size="medium" />
            </Box>

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
                onClick={() => navigate('/login')}
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
                LOGIN
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
                        navigate('/login');
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
                        primary="Login"
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

      {/* Main Content - styled like register-new.html */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
          position: 'relative',
          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f3f4f6',
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '2.5rem',
              left: '2.5rem',
              width: '18rem',
              height: '18rem',
              borderRadius: '50%',
              bgcolor: 'primary.main',
              opacity: theme.palette.mode === 'dark' ? 0.1 : 0.05,
              filter: 'blur(3rem)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '2.5rem',
              right: '2.5rem',
              width: '24rem',
              height: '24rem',
              borderRadius: '50%',
              bgcolor: '#60a5fa',
              opacity: theme.palette.mode === 'dark' ? 0.1 : 0.05,
              filter: 'blur(3rem)',
            }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            maxWidth: '28rem',
            width: '100%',
            p: { xs: 3, sm: 4 },
            borderRadius: '1rem',
            bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : 'white',
            border: snackbar.open && snackbar.severity === 'success'
              ? '2px solid #22c55e'
              : `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0'}`,
            boxShadow: snackbar.open && snackbar.severity === 'success'
              ? '0 0 20px rgba(34, 197, 94, 0.3)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            position: 'relative',
            zIndex: 1,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                mb: 1,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Create an account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Start tracking your reading journey today
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Name Field */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155',
                    mb: 0.5,
                    ml: 0.25,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Name <span style={{ color: '#ef4444' }}>*</span>
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge sx={{ color: '#94a3b8', fontSize: '1.25rem' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                      borderRadius: '0.5rem',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb',
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    },
                  }}
                />
              </Box>

              {/* Username Field */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155',
                    mb: 0.5,
                    ml: 0.25,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Username <span style={{ color: '#ef4444' }}>*</span>
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="username"
                  placeholder="johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#94a3b8', fontSize: '1.25rem' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                      borderRadius: '0.5rem',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb',
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    },
                  }}
                />
              </Box>

              {/* Email Field */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155',
                    mb: 0.5,
                    ml: 0.25,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail sx={{ color: '#94a3b8', fontSize: '1.25rem' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                      borderRadius: '0.5rem',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb',
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155',
                    mb: 0.5,
                    ml: 0.25,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Password <span style={{ color: '#ef4444' }}>*</span>
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#94a3b8', fontSize: '1.25rem' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: '#94a3b8' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                      borderRadius: '0.5rem',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb',
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                bgcolor: 'primary.main',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: '0.5rem',
                textTransform: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
                '&:hover': {
                  bgcolor: loading ? 'primary.main' : '#1d4ed8',
                  boxShadow: loading ? 'none' : '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <span>Creating account...</span>
                </Box>
              ) : (
                'Sign Up'
              )}
            </Button>

            {/* Divider */}
            <Box sx={{ position: 'relative', my: 3 }}>
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
                    borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0'}`,
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
                  variant="body2"
                  sx={{
                    px: 2,
                    bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : 'white',
                    color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Or
                </Typography>
              </Box>
            </Box>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                Already have an account?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    p: 0,
                    minWidth: 'auto',
                    textTransform: 'none',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    '&:hover': {
                      bgcolor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Login here
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
          borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#1e293b' : '#e2e8f0'}`,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: theme.palette.mode === 'dark' ? '#64748b' : '#94a3b8',
              fontSize: '0.75rem',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            © {new Date().getFullYear()} ChapterTrack. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={null}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          top: '80px',
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            minWidth: '300px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
