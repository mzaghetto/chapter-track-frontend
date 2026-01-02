import React, { useState } from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

import DashboardHeader from '../components/DashboardHeader';
import DashboardSearchBar from '../components/DashboardSearchBar';
import UserManhwaSection from '../components/UserManhwaSection';
import UpdateManhwaModal from '../components/UpdateManhwaModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { DetailedUserManhwa } from '../types/manhwa';
import { removeManhwaFromUser } from '../services/manhwa';

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const theme = useTheme();
  const [manhwaName, setManhwaName] = useState('');
  const [displayedManhwaName, setDisplayedManhwaName] = useState('');
  const [manhwaListKey, setManhwaListKey] = useState(0);

  const [selectedManhwa, setSelectedManhwa] = useState<DetailedUserManhwa | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [manhwaToRemove, setManhwaToRemove] = useState<number | null>(null);

  const handleManhwaChange = () => {
    setManhwaListKey((prev) => prev + 1);
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

  const handleSearch = () => {
    setDisplayedManhwaName(manhwaName);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? '#111827' : '#F3F4F6',
        overflowX: 'hidden',
      }}
    >
      <DashboardHeader user={user} onLogout={logout} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          maxWidth: { xs: '100%', md: '80rem' },
          mx: 'auto',
          px: { xs: '1rem', sm: '1.5rem', md: '2rem', lg: '3rem' },
          py: 2,
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: { xs: '2rem', md: '6rem' },
            mb: '2.5rem',
          }}
        >
          {/* Title */}
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '1.875rem', md: '2.25rem' },
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#111827',
                mb: 0.5,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              My Library
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Track and manage your reading progress.
            </Typography>
          </Box>

          {/* Search Bar */}
          <DashboardSearchBar
            value={manhwaName}
            onChange={setManhwaName}
            onSearch={handleSearch}
          />
        </Box>

        {/* Manhwa Sections */}
        <UserManhwaSection
          key={`${manhwaListKey}-reading`}
          userStatus="READING"
          manhwaName={displayedManhwaName}
          onEdit={handleOpenModal}
          onConfirmDelete={handleOpenConfirmDialog}
          onChapterUpdated={handleManhwaChange}
        />
        <UserManhwaSection
          key={`${manhwaListKey}-paused`}
          userStatus="PAUSED"
          manhwaName={displayedManhwaName}
          onEdit={handleOpenModal}
          onConfirmDelete={handleOpenConfirmDialog}
          onChapterUpdated={handleManhwaChange}
        />
        <UserManhwaSection
          key={`${manhwaListKey}-dropped`}
          userStatus="DROPPED"
          manhwaName={displayedManhwaName}
          onEdit={handleOpenModal}
          onConfirmDelete={handleOpenConfirmDialog}
          onChapterUpdated={handleManhwaChange}
        />
        <UserManhwaSection
          key={`${manhwaListKey}-completed`}
          userStatus="COMPLETED"
          manhwaName={displayedManhwaName}
          onEdit={handleOpenModal}
          onConfirmDelete={handleOpenConfirmDialog}
          onChapterUpdated={handleManhwaChange}
        />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#FFFFFF',
          borderTop: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
          py: 2,
          mt: 'auto',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                © {new Date().getFullYear()} ChapterTrack. Keep reading.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Modals */}
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
