import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Switch,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Remove,
  Add,
  Notifications,
  NotificationsOff,
  Edit,
  Delete,
  OpenInNew,
} from '@mui/icons-material';
import { DetailedUserManhwa } from '../types/manhwa';
import { updateUserManhwa } from '../services/manhwa';
import { registerManhwaNotification } from '../services/notification';
import { useAuth } from '../contexts/AuthContext';

interface ManhwaCardProps {
  manhwa: DetailedUserManhwa;
  onEdit: (manhwa: DetailedUserManhwa) => void;
  onConfirmDelete: (manhwaId: number) => void;
  onChapterUpdated?: () => void;
}

const ManhwaCard: React.FC<ManhwaCardProps> = ({
  manhwa,
  onEdit,
  onConfirmDelete,
  onChapterUpdated,
}) => {
  const { token } = useAuth();
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  const [localManhwa, setLocalManhwa] = useState(manhwa);

  const handleChapterChange = async (newChapter: number) => {
    if (token && newChapter >= 0) {
      try {
        await updateUserManhwa(token, manhwa.id, { lastEpisodeRead: newChapter });
        setLocalManhwa((prev: DetailedUserManhwa) => ({
          ...prev,
          lastEpisodeRead: newChapter,
        }));
        if (onChapterUpdated) {
          onChapterUpdated();
        }
      } catch (error) {
        console.error('Failed to update chapter', error);
      }
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (token) {
      try {
        await registerManhwaNotification(token, parseInt(manhwa.manhwaId), 'TELEGRAM', enabled);
        setLocalManhwa((prev: DetailedUserManhwa) => ({
          ...prev,
          isTelegramNotificationEnabled: enabled,
        }));
      } catch (error) {
        console.error('Failed to update notification status', error);
      }
    }
  };

  const getStatusLabel = () => {
    const totalChapters = localManhwa.lastEpisodeReleasedAllProviders;
    const currentChapter = localManhwa.lastEpisodeRead || 0;

    if (totalChapters && currentChapter >= totalChapters) {
      return { text: 'Completed', color: '#10B981' };
    }
    if (totalChapters && currentChapter >= totalChapters * 0.9) {
      return { text: 'Catching Up', color: '#10B981' };
    }
    return { text: 'Ongoing', color: '#2563EB' };
  };

  const handleChapterIncrement = () => {
    const totalChapters = localManhwa.lastEpisodeReleasedAllProviders;
    const currentChapter = localManhwa.lastEpisodeRead || 0;

    if (!totalChapters || currentChapter < totalChapters) {
      handleChapterChange(currentChapter + 1);
    }
  };

  const handleChapterDecrement = () => {
    const currentChapter = localManhwa.lastEpisodeRead || 0;
    if (currentChapter > 0) {
      handleChapterChange(currentChapter - 1);
    }
  };

  const status = getStatusLabel();
  const currentChapter = localManhwa.lastEpisodeRead || 0;
  const totalChapters = localManhwa.lastEpisodeReleasedAllProviders;

  return (
    <Card
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#FFFFFF',
        borderRadius: '1rem',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          borderColor: theme.palette.mode === 'dark' ? '#3B82F6' : '#93C5FD',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Cover Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '192px',
          bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
        }}
      >
        {!imageError && localManhwa.coverImage ? (
          <Box
            component="img"
            src={localManhwa.coverImage}
            alt={`${localManhwa.manhwaName} cover`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              opacity: 0.9,
              transition: 'opacity 0.3s',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F3F4F6',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
              {localManhwa.manhwaName.charAt(0)}
            </Typography>
          </Box>
        )}

        {/* Provider Badge */}
        {localManhwa.providerName && (
          <Box
            sx={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              px: 0.5,
              py: 0.25,
              borderRadius: '0.25rem',
            }}
          >
            {localManhwa.providerName}
          </Box>
        )}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '96px',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
          }}
        />

        {/* Title Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '1.125rem',
              lineHeight: 1.25,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {localManhwa.manhwaName}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* Chapter Control */}
        <Box sx={{ mb: 1.25 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {totalChapters ? 'Progress' : 'Last Read'}
            </Typography>
            <Chip
              label={status.text}
              size="small"
              sx={{
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? `${status.color}20`
                    : `${status.color}20`,
                color: status.color,
                fontSize: '0.75rem',
                fontWeight: 600,
                height: '20px',
                borderRadius: '0.25rem',
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#F9FAFB',
              borderRadius: '0.75rem',
              p: '0.375rem',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
            }}
          >
            <IconButton
              size="small"
              onClick={handleChapterDecrement}
              disabled={currentChapter <= 0}
              sx={{
                width: '2rem',
                height: '2rem',
                p: 0,
                color: '#9CA3AF',
                bgcolor: 'transparent',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#FFFFFF',
                },
                '&.Mui-disabled': {
                  color: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                  bgcolor: 'transparent',
                },
              }}
            >
              <Remove sx={{ fontSize: '1.25rem' }} />
            </IconButton>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#111827',
                }}
              >
                {currentChapter}
              </Typography>
              {totalChapters && (
                <>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: theme.palette.mode === 'dark' ? '#6B7280' : '#9CA3AF',
                    }}
                  >
                    / {totalChapters}
                  </Typography>
                </>
              )}
            </Box>

            <IconButton
              size="small"
              onClick={handleChapterIncrement}
              disabled={totalChapters ? currentChapter >= totalChapters : false}
              sx={{
                width: '2rem',
                height: '2rem',
                p: 0,
                color: '#9CA3AF',
                bgcolor: 'transparent',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#FFFFFF',
                },
                '&.Mui-disabled': {
                  color: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                  bgcolor: 'transparent',
                },
              }}
            >
              <Add sx={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 'auto',
            pt: '1rem',
            borderTop: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
          }}
        >
          {/* Notification Toggle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Switch
              checked={localManhwa.isTelegramNotificationEnabled || false}
              onChange={(e) => handleNotificationToggle(e.target.checked)}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase': {
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                  '&.Mui-checked + .MuiSwitch-track': {
                    bgcolor: 'primary.main',
                  },
                },
                '& .MuiSwitch-track': {
                  bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#D1D5DB',
                },
              }}
            />
            {localManhwa.isTelegramNotificationEnabled ? (
              <Notifications
                sx={{
                  fontSize: '0.875rem',
                  color: 'primary.main',
                }}
              />
            ) : (
              <NotificationsOff
                sx={{
                  fontSize: '0.875rem',
                  color: '#9CA3AF',
                }}
              />
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(localManhwa)}
                sx={{
                  p: '0.375rem',
                  color: '#9CA3AF',
                  '&:hover': {
                    color: '#F59E0B',
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(245, 158, 11, 0.1)'
                        : '#FEF3C7',
                  },
                }}
              >
                <Edit sx={{ fontSize: '1.125rem' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onConfirmDelete(parseInt(localManhwa.manhwaId))}
                sx={{
                  p: '0.375rem',
                  color: '#9CA3AF',
                  '&:hover': {
                    color: '#EF4444',
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : '#FEE2E2',
                  },
                }}
              >
                <Delete sx={{ fontSize: '1.125rem' }} />
              </IconButton>
            </Tooltip>

            {localManhwa.manhwaUrlProvider && (
              <Tooltip title="Go to Website">
                <IconButton
                  size="small"
                  onClick={() => window.open(localManhwa.manhwaUrlProvider, '_blank')}
                  sx={{
                    ml: '0.25rem',
                    p: '0.375rem',
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(37, 99, 235, 0.1)'
                        : 'rgba(37, 99, 235, 0.1)',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  <OpenInNew sx={{ fontSize: '1.125rem' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ManhwaCard;
