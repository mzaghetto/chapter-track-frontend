import React, { useState, useCallback } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ManhwaSearch from '../components/ManhwaSearch';
import DashboardHeader from '../components/DashboardHeader';
import ManhwaStatusFilter from '../components/ManhwaStatusFilter';
import UserManhwaSection from '../components/UserManhwaSection';
import UpdateManhwaModal from '../components/UpdateManhwaModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { DetailedUserManhwa } from '../types/manhwa';
import { removeManhwaFromUser } from '../services/manhwa';

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [status, setStatus] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [selectedManhwa, setSelectedManhwa] = useState<DetailedUserManhwa | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [manhwaToRemove, setManhwaToRemove] = useState<number | null>(null);

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, newStatus: string) => {
    setStatus(newStatus);
  };

  const handleManhwaAdded = useCallback(() => {
    setRefresh(prev => !prev);
  }, []);

  const handleOpenModal = (manhwa: DetailedUserManhwa) => {
    setSelectedManhwa(manhwa);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedManhwa(null);
    setModalOpen(false);
  };

  const handleManhwaUpdated = () => {
    setRefresh(prev => !prev);
    handleCloseModal();
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
        setRefresh(prev => !prev);
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
        <ManhwaSearch onManhwaAdded={handleManhwaAdded} />
        <ManhwaStatusFilter status={status} onStatusChange={handleStatusChange} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Your Manhwas
        </Typography>
        <UserManhwaSection userStatus="READING" statusFilter={status} refresh={refresh} onEdit={handleOpenModal} onConfirmDelete={handleOpenConfirmDialog} />
        <UserManhwaSection userStatus="PAUSED" statusFilter={status} refresh={refresh} onEdit={handleOpenModal} onConfirmDelete={handleOpenConfirmDialog} />
        <UserManhwaSection userStatus="DROPPED" statusFilter={status} refresh={refresh} onEdit={handleOpenModal} onConfirmDelete={handleOpenConfirmDialog} />
        <UserManhwaSection userStatus="COMPLETED" statusFilter={status} refresh={refresh} onEdit={handleOpenModal} onConfirmDelete={handleOpenConfirmDialog} />
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