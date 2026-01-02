import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Container, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme } from '@mui/material';
import { Menu, DarkMode, LightMode, Logout, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';
import Logo from './Logo';

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
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuOpen = () => setMobileMenuOpen(true);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);

  return (
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

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
              {/* Welcome message */}
              {user && (
                <Box sx={{ typography: 'body2', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                  Welcome, <Box component="span" sx={{ color: '#93c5fd', fontWeight: 600 }}>{displayUsernameInHeader ? user.username : user.name}</Box>!
                </Box>
              )}

              {/* Profile Link */}
              <Button
                onClick={() => navigate('/profile')}
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  minWidth: 'auto',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              >
                Profile
              </Button>

              {/* Add Manhwa Button */}
              <Button
                onClick={() => navigate('/add-manhwa')}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  px: 2,
                  py: 0.625,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  borderRadius: '0.5rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                startIcon={<Add sx={{ fontSize: '1.125rem' }} />}
              >
                Add Manhwa
              </Button>

              {/* Admin Link (only for ADMIN users) */}
              {user?.role === 'ADMIN' && (
                <Button
                  onClick={() => navigate('/admin')}
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                >
                  Admin
                </Button>
              )}

              {/* Logout Button */}
              <IconButton
                onClick={onLogout}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  p: 0.75,
                  borderRadius: '0.5rem',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                title="Logout"
              >
                <Logout sx={{ fontSize: '1.25rem' }} />
              </IconButton>

              {/* Dark mode toggle */}
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: 'white',
                  p: 1,
                  ml: 0.5,
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
              {/* Welcome message */}
              {user && (
                <Box sx={{ mb: 2, px: 1, typography: 'body2', fontWeight: 500, color: theme.palette.mode === 'dark' ? 'white' : 'text.primary' }}>
                  Welcome, <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{displayUsernameInHeader ? user.username : user.name}</Box>!
                </Box>
              )}

              <List>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate('/profile');
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
                      primary="Profile"
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
                      navigate('/add-manhwa');
                      handleMobileMenuClose();
                    }}
                    sx={{
                      borderRadius: 1,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiTypography-root': {
                        fontWeight: 600,
                      },
                    }}
                  >
                    <ListItemText
                      primary="Add Manhwa"
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: 'Inter, system-ui, sans-serif',
                          color: 'white',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {user?.role === 'ADMIN' && (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => {
                        navigate('/admin');
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
                        primary="Admin"
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
                )}
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      toggleTheme();
                      // Don't close menu on theme toggle
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
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onLogout();
                      handleMobileMenuClose();
                    }}
                    sx={{
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                      },
                    }}
                  >
                    <ListItemText
                      primary="Logout"
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontWeight: 500,
                          color: '#ef4444',
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
  );
};

export default DashboardHeader;
