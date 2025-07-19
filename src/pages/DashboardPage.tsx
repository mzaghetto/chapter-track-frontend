import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserManhwas, removeManhwaFromUser } from '../services/manhwa';
import { AppBar, Toolbar, Typography, Button, Container, Box, List, ListItem, ListItemText, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ManhwaSearch from '../components/ManhwaSearch';
import UpdateManhwaModal from '../components/UpdateManhwaModal';
import { useNavigate } from 'react-router-dom';

interface Manhwa {
  manhwa_id: string;
  manhwa_position: number;
  last_episode_read: number;
  read_url: string[];
  notify_telegram: boolean;
  notification_website: boolean;
}

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [manhwas, setManhwas] = useState<Manhwa[]>([]);
  const [selectedManhwa, setSelectedManhwa] = useState<Manhwa | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loadingManhwas, setLoadingManhwas] = useState(true); // New loading state
  const navigate = useNavigate();

  const fetchManhwas = () => {
    setLoadingManhwas(true); // Set loading to true when fetching starts
    if (token) {
      getUserManhwas(token)
        .then((response) => {
          setManhwas(response.data.userManhwa.manhwas);
        })
        .catch((error) => {
          console.error('Failed to fetch manhwas', error);
        })
        .finally(() => {
          setLoadingManhwas(false); // Set loading to false when fetching ends
        });
    }
  };

  useEffect(() => {
    fetchManhwas();
  }, [token]);

  const handleRemoveManhwa = async (manhwaId: string) => {
    if (token) {
      try {
        await removeManhwaFromUser(token, [manhwaId]);
        fetchManhwas(); // Refresh the list after removing a manhwa
      } catch (error) {
        console.error('Failed to remove manhwa', error);
      }
    }
  };

  const handleOpenModal = (manhwa: Manhwa) => {
    setSelectedManhwa(manhwa);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedManhwa(null);
    setModalOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MangaToRead
          </Typography>
          {user && <Typography sx={{ mr: 2 }}>Welcome, {user.name}!</Typography>}
          <Button color="inherit" onClick={handleProfileClick}>Profile</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <ManhwaSearch onManhwaAdded={fetchManhwas} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Your Manhwas
        </Typography>
        {loadingManhwas ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {manhwas.map((manhwa) => (
              <ListItem 
                key={manhwa.manhwa_id}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(manhwa)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveManhwa(manhwa.manhwa_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText 
                  primary={`Position: ${manhwa.manhwa_position}`}
                  secondary={`Last Episode Read: ${manhwa.last_episode_read}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;
