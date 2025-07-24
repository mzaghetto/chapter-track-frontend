import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Card, CardContent } from '@mui/material';
import { TrackChanges, Notifications, Explore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { RandomManhwas } from '../components/RandomManhwas';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Box>
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Chapter Track!
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Track your favorite manhwas and never miss an update.
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>Features:</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 4, my: 4 }}>
            {[{
              title: 'Personalized Tracking',
              description: 'Keep track of your reading progress for all your manhwas.',
              icon: <TrackChanges sx={{ fontSize: 40, color: 'primary.main' }} />
            }, {
              title: 'Notifications',
              description: 'Get notified when new chapters are released.',
              icon: <Notifications sx={{ fontSize: 40, color: 'primary.main' }} />
            }, {
              title: 'Discover New Manhwas',
              description: 'Explore a vast collection of manhwas and find your next read.',
              icon: <Explore sx={{ fontSize: 40, color: 'primary.main' }} />
            }].map((feature, index) => (
              <Card key={index} sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  {feature.icon}
                  <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ mt: 1.5 }} color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Discover Your Next Read
        </Typography>
        <RandomManhwas />
      </Container>
    </Box>
  );
};

export default HomePage;