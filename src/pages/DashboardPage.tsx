import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserManhwas, removeManhwaFromUser } from '../services/manhwa';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, CircularProgress, Switch, Card, CardMedia, CardContent, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ManhwaSearch from '../components/ManhwaSearch';
import { useNavigate } from 'react-router-dom';
import ProviderFilter from '../components/ProviderFilter';
import { registerManhwaNotification } from '../services/notification';
import UpdateManhwaModal from '../components/UpdateManhwaModal';
import ManhwaCardSkeleton from '../components/ManhwaCardSkeleton';

interface DetailedUserManhwa {
  id: number;
  manhwaId: number;
  manhwaName: string;
  coverImage: string | null;
  providerId: number | null;
  providerName: string | null;
  lastEpisodeReleased: number | null;
  manhwaUrlProvider: string | null;
  statusReading: 'READING' | 'TO_READ' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED';
  statusManhwa: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null;
  lastEpisodeRead: number | null;
  lastNotifiedEpisode: number | null;
  isTelegramNotificationEnabled?: boolean; // Added this field
  order: number;
  lastUpdated: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [manhwas, setManhwas] = useState<DetailedUserManhwa[]>([]);
  const [filteredManhwas, setFilteredManhwas] = useState<DetailedUserManhwa[]>([]);
  const [selectedManhwa, setSelectedManhwa] = useState<DetailedUserManhwa | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loadingManhwas, setLoadingManhwas] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [manhwaToRemove, setManhwaToRemove] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(parseInt(process.env.REACT_APP_MANHWAS_PER_PAGE || '8')); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [totalManhwas, setTotalManhwas] = useState(0);
  const navigate = useNavigate();

  const fetchManhwas = useCallback(() => {
    setLoadingManhwas(true);
    if (token) {
      getUserManhwas(token, page, pageSize)
        .then((response) => {
          setManhwas(response.data.userManhwas);
          setFilteredManhwas(response.data.userManhwas);
          setTotalManhwas(response.data.total);
        })
        .catch((error) => {
          console.error('Failed to fetch manhwas', error);
        })
        .finally(() => {
          setLoadingManhwas(false);
        });
    }
  }, [token, page, pageSize]);

  useEffect(() => {
    fetchManhwas();
  }, [fetchManhwas]);

  const handleRemoveManhwa = async (manhwaId: number) => {
    if (token) {
      try {
        await removeManhwaFromUser(token, [manhwaId.toString()]);
        fetchManhwas();
      } catch (error) {
        console.error('Failed to remove manhwa', error);
      }
    }
  };

  const handleOpenModal = (manhwa: DetailedUserManhwa) => {
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

  const handleProviderChange = (providerId: number | '') => {
    if (providerId === '') {
      setFilteredManhwas(manhwas);
    } else {
      const filtered = manhwas.filter(manhwa => manhwa.providerId === providerId);
      setFilteredManhwas(filtered);
    }
  };

  const handleNotificationChange = async (manhwaId: number, isEnabled: boolean) => {
    if (token) {
      try {
        const response = await registerManhwaNotification(token, manhwaId, 'TELEGRAM', isEnabled);
        const updatedManhwa = response.data.userNotification;

        const updatedManhwas = manhwas.map(m =>
          m.manhwaId === updatedManhwa.manhwaId ? { ...m, isTelegramNotificationEnabled: updatedManhwa.isEnabled } : m
        );
        setManhwas(updatedManhwas);
        setFilteredManhwas(updatedManhwas);

      } catch (error) {
        console.error('Failed to update notification status', error);
      }
    }
  };

  const handleOpenConfirmDialog = (manhwaId: number) => {
    setManhwaToRemove(manhwaId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setManhwaToRemove(null);
    setOpenConfirmDialog(false);
  };

  const handleConfirmRemove = () => {
    if (manhwaToRemove) {
      handleRemoveManhwa(manhwaToRemove);
    }
    handleCloseConfirmDialog();
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
          {user?.role === 'ADMIN' && (
            <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
          )}
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 4 }}>
        <ManhwaSearch onManhwaAdded={fetchManhwas} />
        <Box sx={{ mt: 2 }}>
          <ProviderFilter onProviderChange={handleProviderChange} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Your Manhwas
        </Typography>
        {loadingManhwas ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
            {Array.from(new Array(pageSize)).map((_, index) => (
              <ManhwaCardSkeleton key={index} />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
            {filteredManhwas.map((manhwa) => (
              <Card key={manhwa.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={manhwa.coverImage || 'https://via.placeholder.com/250/cccccc/ffffff?text=No+Image'} // Placeholder if no image
                  alt={manhwa.manhwaName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
                    {manhwa.manhwaName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Provider: {manhwa.providerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Episode Read: {manhwa.lastEpisodeRead}
                  </Typography>
                  {manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead && (
                    <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                      New Episode Available! ({manhwa.lastEpisodeReleased})
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Switch
                      edge="start"
                      onChange={(e) => handleNotificationChange(manhwa.manhwaId, e.target.checked)}
                      checked={manhwa.isTelegramNotificationEnabled || false}
                      inputProps={{ 'aria-label': 'toggle telegram notifications' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Notifications
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton aria-label="edit" onClick={() => handleOpenModal(manhwa)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleOpenConfirmDialog(manhwa.manhwaId)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
        {totalManhwas > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Pagination
              count={Math.ceil(totalManhwas / pageSize)}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Container>
      <UpdateManhwaModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        manhwa={selectedManhwa}
        onManhwaUpdated={fetchManhwas}
      />
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this manhwa from your list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmRemove} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
