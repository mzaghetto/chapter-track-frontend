import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Paper,
  Chip,
  IconButton,
  useTheme
} from '@mui/material';
import { useThemeMode } from '../contexts/ThemeContext';
import {
  TrackChanges,
  Notifications,
  Explore,
  ArrowForward,
  DarkMode,
  LightMode,
  AutoStories
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { RandomManhwas } from '../components/RandomManhwas';

const HomePage = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();

  const features = [
    {
      icon: <TrackChanges sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Personalized Tracking',
      description: 'Keep effortless track of your reading progress for all your manhwas. Mark chapters as read with a single click.',
    },
    {
      icon: <Notifications sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Instant Notifications',
      description: 'Get notified the moment new chapters are released for titles in your library. Never be the last to know.',
    },
    {
      icon: <Explore sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Discover New Manhwas',
      description: 'Explore a vast collection of manhwas tailored to your taste. Find your next obsession with our smart recommendations.',
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Fixed Blue Header */}
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
            {/* Logo section */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Logo
                color="white"
                size="medium"
              />
            </Box>

            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                onClick={() => navigate('/login')}
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
                LOGIN
              </Button>

              <Button
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: '#1976d2',
                  px: 2.5, // px-5 = 20px / 8 = 2.5
                  py: 0.5,  // py-2 = 8px / 16 = 0.5
                  fontWeight: 700, // font-bold
                  fontSize: '0.875rem', // text-sm
                  textTransform: 'uppercase',
                  borderRadius: '9999px', // rounded-full
                  fontFamily: 'Inter, system-ui, sans-serif',
                  minWidth: 'auto',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // shadow-sm
                  '&:hover': {
                    bgcolor: '#f1f5f9', // hover:bg-slate-100
                    transform: 'scale(1.05)', // hover:scale-105
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
                  p: 1, // p-2 = 8px / 8 = 1
                  ml: 1, // ml-2 = 8px / 8 = 1
                  borderRadius: '9999px', // rounded-full
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'colors 0.2s ease-in-out',
                  fontSize: '1.125rem', // text-lg = 18px
                }}
              >
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: '6rem', // padding-top: 6rem = 96px
          pb: '8rem', // padding-bottom: 8rem = 128px
          px: { xs: 1, sm: 0 }, // px-4 = 1rem
          bgcolor: theme.palette.mode === 'dark'
            ? '#1e293b'  // slate-800 - fundo cinza escuro
            : '#f8fafc', // slate-50 - fundo cinza claro
        }}
      >
        {/* Background decorative elements - efeito sutil como index.html */}
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
          {/* Gradient azul (top-left) - mais visível */}
          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${
                theme.palette.mode === 'dark'
                  ? 'rgba(59, 130, 246, 0.08)'  // Mais visível no dark
                  : 'rgba(96, 165, 250, 0.12)'  // Mais visível no light
              } 0%, transparent 70%)`,
              filter: 'blur(4rem)', // blur-3xl
            }}
          />

          {/* Gradient roxo (bottom-right) - efeito de esfumaçado */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '-10%',
              right: '-10%',
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${
                theme.palette.mode === 'dark'
                  ? 'rgba(139, 92, 246, 0.06)'  // Mais visível no dark
                  : 'rgba(168, 85, 247, 0.08)'  // Mais visível no light
              } 0%, transparent 60%)`,
              filter: 'blur(4rem)', // blur-3xl
            }}
          />
        </Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Chip "The Ultimate Tracker" com animate-pulse */}
            <Chip
              label="The Ultimate Tracker"
              size="small"
              sx={{
                mb: 1.5, // mb-6 = 24px / 16 = 1.5rem
                py: 0.25, // py-1 = 4px / 16 = 0.25rem
                px: 0.75, // px-3 = 12px / 16 = 0.75rem
                borderRadius: '9999px',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.3)' : '#e3f2fd', // dark:bg-blue-900/30 / bg-blue-100
                color: theme.palette.mode === 'dark' ? '#93c5fd' : 'primary.main', // dark:text-blue-300 / text-primary
                fontWeight: 'bold',
                fontSize: '0.75rem', // text-xs = 12px
                textTransform: 'uppercase',
                letterSpacing: '0.05em', // tracking-wider
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 },
                },
              }}
            />

            {/* Título principal - "Welcome to" + "Chapter Track!" */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.25rem', md: '3.75rem' }, // text-4xl = 36px/16=2.25rem, md:text-6xl = 60px/16=3.75rem
                fontWeight: 800, // font-extrabold
                mb: 1.5, // mb-6 = 24px / 16 = 1.5rem
                letterSpacing: '-0.025em', // tracking-tight
                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary', // dark:text-white / text-slate-900
                lineHeight: 1.25, // leading-tight
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Welcome to{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Chapter Track!
              </Box>
            </Typography>

            {/* Subtítulo/descrição */}
            <Typography
              variant="h6"
              component="p"
              sx={{
                fontSize: { xs: '1.125rem', md: '1.25rem' }, // text-lg = 18px/16=1.125rem, md:text-xl = 20px/16=1.25rem
                color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b', // dark:text-slate-400 / text-slate-600
                maxWidth: '42rem', // max-w-2xl = 672px / 16 = 42rem
                mx: 'auto',
                mb: 2.5, // mb-10 = 40px / 16 = 2.5rem
                lineHeight: 1.75, // leading-relaxed
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Track your favorite manhwas, manga, and novels in one place. Never miss a chapter update again with our personalized reading lists.
            </Typography>

            {/* Botões CTA */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, justifyContent: 'center' }}>
              {/* Start Tracking Free */}
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  width: { xs: '100%', sm: 'auto' }, // w-full sm:w-auto
                  px: 2, // px-8 = 32px / 16 = 2rem
                  py: 0.875, // py-3.5 = 14px / 16 = 0.875rem
                  bgcolor: 'primary.main', // bg-primary
                  color: 'white',
                  fontWeight: 600, // font-semibold
                  fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
                  borderRadius: '0.75rem', // rounded-xl = 12px / 16 = 0.75rem
                  textTransform: 'none',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)', // shadow-lg shadow-blue-500/30
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: '#1d4ed8', // hover:bg-blue-700
                    transform: 'translateY(-2px)', // transform hover:-translate-y-1 = -4px / 2 = -2px
                    boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
                  },
                }}
              >
                Start Tracking Free
              </Button>

              {/* Explore Library */}
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                sx={{
                  width: { xs: '100%', sm: 'auto' }, // w-full sm:w-auto
                  px: 2, // px-8 = 32px / 16 = 2rem
                  py: 0.875, // py-3.5 = 14px / 16 = 0.875rem
                  bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : 'white', // dark:bg-slate-800 / bg-white
                  borderColor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0', // dark:border-slate-700 / border-slate-200
                  color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155', // dark:text-slate-200 / text-slate-700
                  fontWeight: 600, // font-semibold
                  fontSize: '0.875rem', // text-sm
                  borderRadius: '0.75rem', // rounded-xl = 12px / 16 = 0.75rem
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#f8fafc', // dark:hover:bg-slate-700 / hover:bg-slate-100
                    borderColor: theme.palette.mode === 'dark' ? '#475569' : '#cbd5e1',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Explore Library
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: '4rem', // padding-top e bottom: 4rem = 64px
          pb: '6rem', // padding-bottom extra para acomodar hover effects: 6rem = 96px
          bgcolor: theme.palette.mode === 'dark'
            ? '#0f172a'  // slate-900 - fundo escuro puro
            : '#ffffff', // white - fundo branco puro
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0',
          overflow: 'visible', // permite que hover effects fiquem visíveis
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: '4rem' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Why use Chapter Track?
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b', // dark:text-slate-400 / text-slate-600
                maxWidth: '42rem', // max-w-xl = 672px / 16 = 42rem
                mx: 'auto',
                lineHeight: 1.6,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Everything you need to manage your reading habits efficiently in a modern, easy-to-use interface.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, maxWidth: '100%', mx: 'auto' }}>
            {features.map((feature, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  p: 2, // padding reduzido para 32px = 2rem
                  textAlign: 'left', // card inteiro alinhado à esquerda
                  height: '100%',
                  borderRadius: '1rem', // rounded-2xl = 16px / 16 = 1rem
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0', // dark:border-slate-700 / border-slate-100
                  bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc', // dark:bg-slate-800 / bg-slate-50
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // hover:shadow-xl
                    '& .icon-container': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Icon container com cores específicas */}
                  <Box
                    className="icon-container"
                    sx={{
                      width: '3.5rem', // w-14 = 56px / 16 = 3.5rem
                      height: '3.5rem',
                      borderRadius: '0.75rem', // rounded-xl = 12px / 16 = 0.75rem
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5, // ajustado para 1.5rem = 24px
                      ml: 0, // forçar alinhamento à esquerda para o card inteiro
                      transition: 'transform 0.3s ease-in-out',
                      ...(index === 0 && { // Personalized Tracking - azul
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.5)' : '#dbeafe', // dark:bg-blue-900/50 / bg-blue-100
                        color: 'primary.main',
                      }),
                      ...(index === 1 && { // Instant Notifications - roxo
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(147, 51, 234, 0.5)' : '#f3e8ff', // dark:bg-purple-900/50 / bg-purple-100
                        color: '#9333ea', // purple-600
                      }),
                      ...(index === 2 && { // Discover New Manhwas - teal
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(20, 184, 166, 0.5)' : '#ccfbf1', // dark:bg-teal-900/50 / bg-teal-100
                        color: '#0d9488', // teal-600
                      }),
                    }}
                  >
                    <Typography sx={{ fontSize: '1.875rem' }}> {/* text-3xl = 30px / 16 = 1.875rem */}
                      {index === 0 && <TrackChanges sx={{ color: 'primary.main' }} />} {/* text-primary */}
                      {index === 1 && <Notifications sx={{ color: theme.palette.mode === 'dark' ? '#a78bfa' : '#9333ea' }} />} {/* text-purple-400 dark / text-purple-600 light */}
                      {index === 2 && <Explore sx={{ color: theme.palette.mode === 'dark' ? '#2dd4bf' : '#0d9488' }} />} {/* text-teal-400 dark / text-teal-600 light */}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700, // font-bold
                      mb: 1.5, // mb-3 = 12px / 4 = 3rem, ajustado para 24px / 16 = 1.5rem
                      fontSize: '1.25rem', // text-xl = 20px / 16 = 1.25rem
                      color: theme.palette.mode === 'dark' ? 'white' : 'text.primary', // dark:text-white / text-slate-900
                      fontFamily: 'Inter, system-ui, sans-serif',
                      textAlign: 'left', // alinhado à esquerda
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b', // dark:text-slate-400 / text-slate-600
                      lineHeight: 1.75, // leading-relaxed
                      fontFamily: 'Inter, system-ui, sans-serif',
                      textAlign: 'left', // alinhado à esquerda
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Discovery Section */}
      <Box
        sx={{
          py: '5rem', // padding-top e bottom: 5rem = 80px
          bgcolor: theme.palette.mode === 'dark'
            ? '#0f172a'  // background-dark = slate-900 (mesmo do body)
            : '#f8fafc', // background-light = slate-50 (mesmo do body)
        }}
      >
            <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700, // font-bold
                mb: 2, // mb-2 = 8px / 4 = 2rem (ajustado para 8px = 0.5rem)
                fontSize: { xs: '1.875rem', md: '2.25rem' }, // text-3xl = 30px/16=1.875rem
                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary', // dark:text-white / text-slate-900
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Discover Your Next Read
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b', // dark:text-slate-400 / text-slate-500
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Trending manhwas this week
            </Typography>
          </Box>
          <Button
            onClick={() => navigate('/dashboard')}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 0.25, // gap-1 = 4px / 16 = 0.25rem
              color: 'primary.main',
              fontWeight: 500, // font-medium
              textTransform: 'none',
              fontFamily: 'Inter, system-ui, sans-serif',
              '&:hover': {
                color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1d4ed8', // hover:text-blue-400 / hover:text-blue-700
              },
              transition: 'color 0.2s ease-in-out',
            }}
            endIcon={<ArrowForward sx={{ fontSize: '1.125rem' }} />} // text-lg = 18px / 16 = 1.125rem
          >
            View all
          </Button>
        </Box>

        <RandomManhwas />

        <Box sx={{ mt: 2, textAlign: { xs: 'center', sm: 'none' } }}>
          <Button
            onClick={() => navigate('/dashboard')}
            sx={{
              display: { xs: 'inline-flex', sm: 'none' },
              alignItems: 'center',
              gap: 0.25, // gap-1 = 4px / 16 = 0.25rem
              color: 'primary.main',
              fontWeight: 500, // font-medium
              textTransform: 'none',
              fontFamily: 'Inter, system-ui, sans-serif',
              '&:hover': {
                color: theme.palette.mode === 'dark' ? '#60a5fa' : '#1d4ed8', // hover:text-blue-400 / hover:text-blue-700
              },
              transition: 'color 0.2s ease-in-out',
            }}
            endIcon={<ArrowForward sx={{ fontSize: '1.125rem' }} />} // text-lg = 18px / 16 = 1.125rem
          >
            View all
          </Button>
        </Box>
        </Container>
      </Box>

      {/* CTA Section - Mesmo background do body para continuidade */}
      <Box
        sx={{
          py: '5rem', // padding-top e bottom: 5rem = 80px
          bgcolor: theme.palette.mode === 'dark'
            ? '#0f172a'  // background-dark = slate-900 (mesmo do body)
            : '#f8fafc', // background-light = slate-50 (mesmo do body)
        }}
      >
        <Container maxWidth="xl">
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              borderRadius: '1.5rem', // rounded-3xl = 24px / 16 = 1.5rem
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(40px)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-100px',
                left: '-100px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(40px)',
              },
            }}
          >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Ready to start your reading journey?
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.6,
              }}
            >
              Join thousands of readers who are tracking their progress and discovering new worlds every day.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                background: 'white',
                color: 'primary.main',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '2rem', // rounded-full = 32px / 16 = 2rem
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)', // shadow-lg
                '&:hover': {
                  background: '#f1f5f9', // hover:bg-slate-100
                  transform: 'translateY(-2px)', // transform hover:-translate-y-1 = -2px
                  boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Create Free Account
            </Button>
          </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white', // dark:bg-slate-900 / bg-white
          borderTop: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0', // dark:border-slate-800 / border-slate-200
          pt: '4rem', // pt-16 = 4rem = 64px
          pb: '2rem', // pb-8 = 2rem = 32px
        }}
      >
        <Container maxWidth="xl" sx={{ px: '1rem' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: '2rem', // mb-8 = 2rem = 32px
          }}>
            {/* Logo section */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem', // gap-2 = 0.5rem = 8px
              mb: { xs: '1rem', md: 0 }, // mb-4 md:mb-0 = 1rem = 16px
            }}>
              <AutoStories
                sx={{
                  fontSize: '1.5rem', // text-2xl = 24px / 16 = 1.5rem
                  color: 'primary.main',
                }}
              />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem', // text-xl = 20px / 16 = 1.25rem
                  color: theme.palette.mode === 'dark' ? 'white' : 'text.primary', // dark:text-white
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                ChapterTrack
              </Typography>
            </Box>

            {/* Navigation links */}
            <Box sx={{
              display: 'flex',
              gap: '2rem', // gap-8 = 2rem = 32px
              color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b', // dark:text-slate-500 / text-slate-500
              fontSize: '0.875rem', // text-sm = 14px / 16 = 0.875rem
            }}>
              <Button
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                About
              </Button>
              <Button
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                Features
              </Button>
              <Button
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                Privacy
              </Button>
              <Button
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                Terms
              </Button>
            </Box>
          </Box>

          {/* Copyright */}
          <Box sx={{
            textAlign: 'center',
            color: theme.palette.mode === 'dark' ? '#64748b' : '#94a3b8', // dark:text-slate-600 / text-slate-400
            fontSize: '0.75rem', // text-xs = 12px / 16 = 0.75rem
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            © {new Date().getFullYear()} ChapterTrack. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;