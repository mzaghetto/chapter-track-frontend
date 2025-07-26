import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Switch, Box, Chip, Divider, Tooltip, Button } from '@mui/material';
import { keyframes } from '@emotion/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinkIcon from '@mui/icons-material/Link';
import { DetailedUserManhwa } from '../types/manhwa';
import { updateUserManhwa } from '../services/manhwa';
import { registerManhwaNotification } from '../services/notification';
import { useAuth } from '../contexts/AuthContext';

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

interface ManhwaCardProps {
  manhwa: DetailedUserManhwa;
  onEdit: (manhwa: DetailedUserManhwa) => void;
  onConfirmDelete: (manhwaId: number) => void;
}

const ManhwaCard: React.FC<ManhwaCardProps> = ({ manhwa, onEdit, onConfirmDelete }) => {
  const { token } = useAuth();

  const handleEpisodeChange = async (newEpisode: number) => {
    if (token) {
      try {
        await updateUserManhwa(token, manhwa.id, { lastEpisodeRead: newEpisode });
      } catch (error) {
        console.error('Failed to update last episode read', error);
      }
    }
  };

  const handleNotificationChange = async (isEnabled: boolean) => {
    if (token) {
      try {
        await registerManhwaNotification(token, parseInt(manhwa.manhwaId), 'TELEGRAM', isEnabled);
      } catch (error) {
        console.error('Failed to update notification status', error);
      }
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead
          ? '2px solid orange'
          : '1px solid rgba(0, 0, 0, 0.12)',
        animation: manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead
          ? `${pulse} 1.5s infinite`
          : 'none',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="250"
          image={manhwa.coverImage || 'https://via.placeholder.com/250'}
          alt={manhwa.manhwaName}
        />
        {manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead && (
          <Tooltip title={`New Episode Available! (${manhwa.lastEpisodeReleased})`}>
            <InfoOutlinedIcon
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'warning.main',
              }}
            />
          </Tooltip>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 0 }}>
        <Box sx={{ pt: 2, px: 2, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 1, flexGrow: 1, minHeight: '4em', display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div" title={manhwa.manhwaName} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {manhwa.manhwaName}
            </Typography>
          </Box>
          <Chip label={manhwa.providerName} size="small" />
        </Box>
        <Box sx={{ py: 1 }}>
          <Divider />
        </Box>
        <Box sx={{ px: 2, pb: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Last Episode Read:
            <IconButton size="small" onClick={() => handleEpisodeChange((manhwa.lastEpisodeRead || 0) - 1)} disabled={(manhwa.lastEpisodeRead || 0) <= 0}>
              <RemoveIcon />
            </IconButton>
            {manhwa.lastEpisodeRead}
            <IconButton size="small" onClick={() => handleEpisodeChange((manhwa.lastEpisodeRead || 0) + 1)}>
              <AddIcon />
            </IconButton>
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch
            checked={manhwa.isTelegramNotificationEnabled || false}
            onChange={(e) => handleNotificationChange(e.target.checked)}
          />
          <Typography variant="caption">Notifications</Typography>
        </Box>
        <Box>
          <IconButton onClick={() => onEdit(manhwa)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onConfirmDelete(parseInt(manhwa.manhwaId))}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
      <Button
        variant="contained"
        color="primary"
        startIcon={<LinkIcon />}
        href={manhwa.manhwaUrlProvider}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ my: 1, mx: 1 }}
      >
        Go to Website
      </Button>
    </Card>
  );
};

export default ManhwaCard;
