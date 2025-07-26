import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import DashboardHeader from '../components/DashboardHeader';
import UserManhwaSection from '../components/UserManhwaSection';
import UpdateManhwaModal from '../components/UpdateManhwaModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { DetailedUserManhwa } from '../types/manhwa';
import { removeManhwaFromUser } from '../services/manhwa';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [manhwaName, setManhwaName] = useState('');
  const [displayedManhwaName, setDisplayedManhwaName] = useState('');
  const [manhwaListKey, setManhwaListKey] = useState(0); // Key to force re-render of UserManhwaSection
  
  const [selectedManhwa, setSelectedManhwa] = useState<DetailedUserManhwa | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [manhwaToRemove, setManhwaToRemove] = useState<number | null>(null);

  const handleManhwaChange = () => {
    setManhwaListKey(prev => prev + 1);
  };

    const handleOpenModal = (manhwa: DetailedUserManhwa) => {
    setSelectedManhwa(manhwa);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedManhwa(null);
    setModalOpen(false);
  };

  const handleManhwaUpdated = () => {
    handleCloseModal();
    handleManhwaChange();
  };

  const handleOpenConfirmDialog = (manhwaId: number) => {
    setManhwaToRemove(manhwaId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setManhwaToRemove(null);
    setOpenConfirmDialog(false);
  };

  const handleConfirmRemove = async () => {
    if (token && manhwaToRemove) {
      try {
        await removeManhwaFromUser(token, [manhwaToRemove.toString()]);
        handleManhwaChange();
      } catch (error) {
        console.error('Failed to remove manhwa', error);
      }
    }
    handleCloseConfirmDialog();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <DashboardHeader user={user} onLogout={logout} />
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Search Manhwas"
            variant="outlined"
            fullWidth
            value={manhwaName}
            onChange={(e) => setManhwaName(e.target.value)}
          />
          <Button variant="contained" onClick={() => setDisplayedManhwaName(manhwaName)}>
            Search
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
          <Typography variant="h4" component="h1">
            Your Manhwas
          </Typography>
          <Button variant="contained" onClick={() => navigate('/add-manhwa')}>
            Add New Manhwa
          </Button>
        </Box>
        <UserManhwaSection key={`${manhwaListKey}-reading`} userStatus="READING" manhwaName={displayedManhwaName} onEdit={handleOpenModal} onConfirmDelete={handleOpenConfirmDialog} />
        <UserManhwaSection key={`${manhwaListKey}-paused`} userStatus="PAUSED" manhwaName={displayedManhwaName} onEdit={handleOpenModal} onConfirmDelete={handleOpenConfirmDialog} />
        <UserManhwaSection key={`${manhwaListKey}-dropped`} userStatus="DROPPED" manhwaName={displayedManhwaName} onEdit={handleOpenModal} onConfirmDelete={handleOpenConfirmDialog} />
        <UserManhwaSection key={`${manhwaListKey}-completed`} userStatus="COMPLETED" manhwaName={displayedManhwaName} onEdit={handleOpenModal} onConfirmDelete={handleOpenConfirmDialog} />
      </Container>
      <UpdateManhwaModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        manhwa={selectedManhwa}
        onManhwaUpdated={handleManhwaUpdated}
      />
      <ConfirmationDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmRemove}
        title="Confirm Deletion"
        message="Are you sure you want to remove this manhwa from your list?"
      />
    </Box>
  );
};

export default DashboardPage;