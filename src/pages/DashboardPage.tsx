import React, { useCallback, useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import { useAuth } from '../contexts/AuthContext';
import { getUserManhwas, removeManhwaFromUser, updateUserManhwa } from '../services/manhwa';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Switch, Card, CardMedia, CardContent, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Chip, Divider, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ManhwaSearch from '../components/ManhwaSearch';
import { useNavigate } from 'react-router-dom';
import ProviderFilter from '../components/ProviderFilter';
import { registerManhwaNotification } from '../services/notification';
import UpdateManhwaModal from '../components/UpdateManhwaModal';
import ManhwaCardSkeleton from '../components/ManhwaCardSkeleton';
import Logo from '../components/Logo';

import { DetailedUserManhwa } from '../types/manhwa';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 165, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0);
  }
`;

const DashboardPage = () => {
  const { user, token, logout, displayUsernameInHeader } = useAuth();
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
      const filtered = manhwas.filter(manhwa => manhwa.providerId.toString() === providerId.toString());
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

  const handleEpisodeChange = async (manhwaId: string, newEpisode: number) => {
    if (token) {
      try {
        const updatedManhwas = manhwas.map((m) =>
          m.id === manhwaId ? { ...m, lastEpisodeRead: newEpisode } : m,
        );
        setManhwas(updatedManhwas);
        setFilteredManhwas(updatedManhwas);

        // Call backend to update
        await updateUserManhwa(token, manhwaId, { lastEpisodeRead: newEpisode });
      } catch (error) {
        console.error('Failed to update last episode read', error);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Box>
          {user && <Typography sx={{ mr: 2 }}>Welcome, {displayUsernameInHeader ? user.username : user.name}!</Typography>}
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
              <Card
                key={manhwa.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead
                    ? '2px solid orange'
                    : 'none',
                  animation: manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead
                    ? `${pulse} 1.5s infinite`
                    : 'none',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={manhwa.coverImage || 'https://via.placeholder.com/250/cccccc/ffffff?text=No+Image'} // Placeholder if no image
                    alt={manhwa.manhwaName}
                    sx={{ objectFit: 'cover' }}
                  />
                  {manhwa.lastEpisodeReleasedAllProviders !== null && manhwa.lastEpisodeReleased !== null && manhwa.lastEpisodeReleasedAllProviders > manhwa.lastEpisodeReleased && (
                    <Tooltip title={`Newer episodes available from other providers! (Latest: ${manhwa.lastEpisodeReleasedAllProviders})`} arrow>
                      <InfoOutlinedIcon
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          color: 'info.main',
                          fontSize: 30,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%',
                          p: 0.5,
                        }}
                      />
                    </Tooltip>
                  )}
                  {manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead && (
                    <Tooltip title={`New Episode Available! (${manhwa.lastEpisodeReleased})` + (manhwa.lastEpisodeReleasedAllProviders !== manhwa.lastEpisodeReleased ? ` (Latest: ${manhwa.lastEpisodeReleasedAllProviders})` : '')} arrow>
                      <InfoOutlinedIcon
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'warning.main',
                          fontSize: 30,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%',
                          p: 0.5,
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, px: 2, pt: 2 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        mb: 0,
                        flexGrow: 1,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.86rem', // Equivalent to 2 lines of 1.1rem font-size with 1.3 line-height
                      }}
                      title={manhwa.manhwaName}
                    >
                      {manhwa.manhwaName}
                    </Typography>
                    <Chip label={manhwa.providerName} size="small" sx={{ ml: 1 }} />
                  </Box>
                  <Divider sx={{ my: 1, width: '100%' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 2 }}>
                    Last Episode Read:
                    <IconButton
                      size="small"
                      onClick={() => handleEpisodeChange(manhwa.id, (manhwa.lastEpisodeRead || 0) - 1)}
                      disabled={(manhwa.lastEpisodeRead || 0) <= 0}
                      sx={{ ml: 1 }}
                    >
                      <RemoveIcon fontSize="inherit" />
                    </IconButton>
                    <Typography variant="body2" component="span" sx={{ mx: 0.5 }}>
                      {manhwa.lastEpisodeRead}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleEpisodeChange(manhwa.id, (manhwa.lastEpisodeRead || 0) + 1)}
                    >
                      <AddIcon fontSize="inherit" />
                    </IconButton>
                  </Typography>
                  
                  
                  
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Switch
                      edge="start"
                      onChange={(e) => handleNotificationChange(parseInt(manhwa.manhwaId), e.target.checked)}
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
                    <IconButton aria-label="delete" onClick={() => handleOpenConfirmDialog(parseInt(manhwa.manhwaId))} size="small">
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
