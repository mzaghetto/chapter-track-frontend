import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, IconButton, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { DetailedUserManhwa } from '../types/manhwa';
import { getUserManhwas } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';
import ManhwaCard from './ManhwaCard';
import StatusSection from './StatusSection';

interface UserManhwaSectionProps {
  userStatus: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED';
  onEdit: (manhwa: DetailedUserManhwa) => void;
  onConfirmDelete: (manhwaId: number) => void;
  manhwaName: string;
  onManhwaUpdated?: (updated: DetailedUserManhwa) => void;
  updatedManhwa?: DetailedUserManhwa | null;
  onUpdatedProcessed?: () => void;
}

const statusConfig: Record<
  string,
  { title: string; color: string; defaultExpanded: boolean }
> = {
  READING: { title: 'Currently Reading', color: '#2563EB', defaultExpanded: true },
  PAUSED: { title: 'On Pause', color: '#EAB308', defaultExpanded: false },
  DROPPED: { title: 'Dropped', color: '#EF4444', defaultExpanded: false },
  COMPLETED: { title: 'Completed', color: '#10B981', defaultExpanded: false },
};

const UserManhwaSection: React.FC<UserManhwaSectionProps> = ({
  userStatus,
  onEdit,
  onConfirmDelete,
  manhwaName,
  onManhwaUpdated,
  updatedManhwa,
  onUpdatedProcessed,
}) => {
  const { token } = useAuth();
  const theme = useTheme();
  const [manhwas, setManhwas] = useState<DetailedUserManhwa[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalManhwas, setTotalManhwas] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = parseInt(process.env.REACT_APP_MANHWAS_PER_PAGE || '8');

  // Handle local update when a manhwa is updated
  useEffect(() => {
    if (updatedManhwa) {
      setManhwas((prev) => {
        const index = prev.findIndex((m) => m.id === updatedManhwa.id);
        if (index !== -1) {
          // Update the manhwa in the current list
          const updated = [...prev];
          updated[index] = updatedManhwa;
          return updated;
        }
        // If the updated manhwa moved to a different status, remove it from current list
        if (updatedManhwa.statusReading !== userStatus) {
          return prev.filter((m) => m.id !== updatedManhwa.id);
        }
        // If the updated manhwa moved to this status, add it
        if (updatedManhwa.statusReading === userStatus) {
          return [...prev, updatedManhwa];
        }
        return prev;
      });
      // Notify parent that update was processed
      if (onUpdatedProcessed) {
        onUpdatedProcessed();
      }
    }
  }, [updatedManhwa, userStatus, onUpdatedProcessed]);

  const fetchManhwas = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getUserManhwas(token, page, pageSize, undefined, userStatus, manhwaName);
      const total = response.data.total;
      setManhwas(response.data.userManhwas);
      setTotalManhwas(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (error) {
      console.error(`Failed to fetch ${userStatus} manhwas`, error);
    } finally {
      setLoading(false);
    }
  }, [token, page, pageSize, userStatus, manhwaName]);

  useEffect(() => {
    fetchManhwas();
  }, [fetchManhwas]);

  const handlePageChange = (event: React.ChangeEvent<unknown> | null, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const config = statusConfig[userStatus];

  return (
    <StatusSection
      title={config.title}
      count={totalManhwas}
      color={config.color}
      defaultExpanded={config.defaultExpanded}
    >
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : manhwas.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          No manhwas found in this category.
        </Box>
      ) : (
        <>
          {manhwas.map((manhwa) => (
            <ManhwaCard
              key={manhwa.id}
              manhwa={manhwa}
              onEdit={onEdit}
              onConfirmDelete={onConfirmDelete}
              onManhwaUpdated={onManhwaUpdated}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
                gridColumn: '1 / -1',
                gap: '0.5rem',
              }}
            >
              <IconButton
                onClick={() => handlePageChange(null, page - 1)}
                disabled={page === 1}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  width: '2rem',
                  height: '2rem',
                  p: 0,
                  color: '#6B7280',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F3F4F6',
                  },
                  '&.Mui-disabled': {
                    color: '#D1D5DB',
                  },
                }}
              >
                <ChevronLeft sx={{ fontSize: '0.875rem' }} />
              </IconButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <IconButton
                    key={pageNum}
                    onClick={(e) => handlePageChange(e, pageNum)}
                    sx={{
                      border: '1px solid',
                      borderColor: page === pageNum ? 'primary.main' : 'divider',
                      bgcolor: page === pageNum ? 'primary.main' : 'transparent',
                      color: page === pageNum ? 'white' : 'text.primary',
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontWeight: page === pageNum ? 600 : 400,
                      minWidth: '2rem',
                      height: '2rem',
                      p: 0,
                      '&:hover': {
                        bgcolor: page === pageNum ? 'primary.main' : (theme.palette.mode === 'dark' ? '#1F2937' : '#F3F4F6'),
                      },
                    }}
                    disableRipple
                  >
                    {pageNum}
                  </IconButton>
                )
              )}

              <IconButton
                onClick={() => handlePageChange(null, page + 1)}
                disabled={page === totalPages}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  width: '2rem',
                  height: '2rem',
                  p: 0,
                  color: '#6B7280',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F3F4F6',
                  },
                  '&.Mui-disabled': {
                    color: '#D1D5DB',
                  },
                }}
              >
                <ChevronRight sx={{ fontSize: '0.875rem' }} />
              </IconButton>
            </Box>
          )}
        </>
      )}
    </StatusSection>
  );
};

export default UserManhwaSection;
