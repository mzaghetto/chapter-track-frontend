import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  useTheme,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Close, BookmarkBorder, ExpandLess, ExpandMore, Public } from '@mui/icons-material';
import { updateUserManhwa, getManhwaProviders } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';
import { DetailedUserManhwa } from '../types/manhwa';

interface ManhwaProvider {
  id: number;
  providerName: string;
  providerId: number;
}

interface UpdateManhwaModalProps {
  open: boolean;
  handleClose: () => void;
  manhwa: DetailedUserManhwa | null;
  onManhwaUpdated: (updatedManhwa?: any) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  READING: { label: 'Currently Reading', color: '#2563EB' },
  PAUSED: { label: 'On Pause', color: '#EAB308' },
  DROPPED: { label: 'Dropped', color: '#EF4444' },
  COMPLETED: { label: 'Completed', color: '#10B981' },
};

const UpdateManhwaModal: React.FC<UpdateManhwaModalProps> = ({
  open,
  handleClose,
  manhwa,
  onManhwaUpdated,
}) => {
  const { token } = useAuth();
  const theme = useTheme();
  const [lastEpisodeRead, setLastEpisodeRead] = useState(manhwa?.lastEpisodeRead || 0);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(manhwa?.providerId || null);
  const [status, setStatus] = useState(manhwa?.statusReading || 'READING');
  const [providers, setProviders] = useState<ManhwaProvider[]>([]);

  useEffect(() => {
    setLastEpisodeRead(manhwa?.lastEpisodeRead || 0);
    setStatus(manhwa?.statusReading || 'READING');
    if (token && manhwa) {
      getManhwaProviders(token, parseInt(manhwa.manhwaId))
        .then((response) => {
          setProviders(response.data.manhwaProviders);

          const matchingManhwaProvider = response.data.manhwaProviders.find(
            (mp: any) => mp.providerId === manhwa.providerId
          );
          if (matchingManhwaProvider) {
            setSelectedProvider(matchingManhwaProvider.providerId);
          } else {
            setSelectedProvider(null);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch manhwa providers', error);
        });
    }
  }, [manhwa, token]);

  const handleUpdate = async () => {
    if (token && manhwa) {
      try {
        const response = await updateUserManhwa(token, manhwa.id.toString(), {
          lastEpisodeRead: lastEpisodeRead,
          providerId: selectedProvider,
          status: status,
        });
        onManhwaUpdated(response.data.userManhwa);
        handleClose();
      } catch (error) {
        console.error('Failed to update manhwa', error);
      }
    }
  };

  const handleIncrementEpisode = () => {
    setLastEpisodeRead((prev) => prev + 1);
  };

  const handleDecrementEpisode = () => {
    setLastEpisodeRead((prev) => Math.max(0, prev - 1));
  };

  const nextEpisode = manhwa?.lastEpisodeReleasedAllProviders
    ? lastEpisodeRead < manhwa.lastEpisodeReleasedAllProviders
      ? lastEpisodeRead + 1
      : null
    : null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '0.75rem',
          bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#FFFFFF',
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: '1.5rem',
          py: '1.25rem',
          borderBottom: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Update Manhwa
          </Typography>
          <Typography
            sx={{
              mt: '0.25rem',
              fontSize: '0.875rem',
              color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Update your progress for{' '}
            <Box
              component="span"
              sx={{
                fontWeight: 500,
                color: 'primary.main',
              }}
            >
              {manhwa?.manhwaName}
            </Box>
            .
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
            p: 0.5,
            '&:hover': {
              color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
            },
          }}
        >
          <Close sx={{ fontSize: '1.25rem' }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{
          px: '1.5rem',
          py: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Last Episode Read */}
        <Box>
          <Typography
            component="label"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
              mb: '0.25rem',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Last Episode Read
          </Typography>
          <Box
            sx={{
              position: 'relative',
              borderRadius: '0.375rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '0.75rem',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <BookmarkBorder
                sx={{
                  color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                  fontSize: '1.125rem',
                  width: '1.125rem',
                  height: '1.125rem',
                }}
              />
            </Box>
            <TextField
              fullWidth
              type="number"
              value={lastEpisodeRead}
              onChange={(e) => setLastEpisodeRead(parseInt(e.target.value) || 0)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F9FAFB',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  '& fieldset': {
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#4B5563' : '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
                  py: '0.625rem',
                  pl: '2.5rem',
                  pr: '3rem',
                  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                  '&[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '1px',
                bottom: '1px',
                right: '1px',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                zIndex: 1,
                overflow: 'hidden',
              }}
            >
              <IconButton
                disableRipple
                onClick={handleIncrementEpisode}
                sx={{
                  flex: 1,
                  px: '0.5rem',
                  py: 0,
                  minWidth: '2rem',
                  borderRadius: '0 0.375rem 0 0',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                  },
                }}
              >
                <ExpandLess sx={{ fontSize: '1rem' }} />
              </IconButton>
              <IconButton
                disableRipple
                onClick={handleDecrementEpisode}
                disabled={lastEpisodeRead <= 0}
                sx={{
                  flex: 1,
                  px: '0.5rem',
                  py: 0,
                  minWidth: '2rem',
                  borderRadius: '0 0 0.375rem 0',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                <ExpandMore sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Box>
          </Box>
          {nextEpisode && (
            <Typography
              sx={{
                mt: '0.25rem',
                fontSize: '0.75rem',
                color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Next chapter available:{' '}
              <Box component="span" sx={{ fontWeight: 500, color: 'primary.main' }}>
                {nextEpisode}
              </Box>
            </Typography>
          )}
        </Box>

        {/* Provider */}
        <Box>
          <Typography
            component="label"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
              mb: '0.25rem',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Provider
          </Typography>
          <Box sx={{ position: 'relative', mt: '0.25rem' }}>
            <FormControl fullWidth>
              <Select
                value={selectedProvider || ''}
                onChange={(e) => setSelectedProvider(e.target.value)}
                displayEmpty
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F9FAFB',
                  borderRadius: '0.375rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0.375rem',
                    py: '0.625rem',
                    pl: '0.75rem',
                    pr: '2.5rem',
                    fontSize: '0.875rem',
                    '& fieldset': {
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#4B5563' : '#D1D5DB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Public
                      sx={{
                        color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                        fontSize: '1.125rem',
                      }}
                    />
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {providers.find((p) => String(p.providerId) === String(value))?.providerName || ''}
                    </Box>
                  </Box>
                )}
              >
                {providers.map((provider) => (
                  <MenuItem key={provider.id} value={provider.providerId}>
                    {provider.providerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Status */}
        <Box>
          <Typography
            component="label"
            sx={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
              mb: '0.25rem',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Status
          </Typography>
          <Box sx={{ position: 'relative', mt: '0.25rem' }}>
            <FormControl fullWidth>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F9FAFB',
                  borderRadius: '0.375rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0.375rem',
                    py: '0.625rem',
                    pl: '0.75rem',
                    pr: '2.5rem',
                    fontSize: '0.875rem',
                    '& fieldset': {
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#4B5563' : '#D1D5DB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Box
                      sx={{
                        width: '0.625rem',
                        height: '0.625rem',
                        borderRadius: '50%',
                        bgcolor: statusConfig[value]?.color,
                      }}
                    />
                    <Box>{statusConfig[value]?.label}</Box>
                  </Box>
                )}
              >
                <MenuItem value="READING">Currently Reading</MenuItem>
                <MenuItem value="PAUSED">On Pause</MenuItem>
                <MenuItem value="DROPPED">Dropped</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.5)' : '#F9FAFB',
          px: '1.5rem',
          py: '1rem',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          borderTop: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            px: '1rem',
            py: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#FFFFFF',
            color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? '#4B5563' : '#F3F4F6',
            },
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          sx={{
            px: '1rem',
            py: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Update
        </Button>
      </Box>
    </Dialog>
  );
};

export default UpdateManhwaModal;
