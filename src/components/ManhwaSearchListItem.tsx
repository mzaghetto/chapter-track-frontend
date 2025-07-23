import React, { useState, useEffect, useRef } from 'react';
import { Box, ListItem, ListItemText, IconButton, Typography, Chip, Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ManhwaSearchListItemProps {
  manhwa: {
    manhwaId: number;
    manhwaName: string;
    coverImage: string | null;
    lastEpisodeReleased?: number;
    genre: string | null;
    status: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null;
  };
  onAdd: (manhwa: any) => void;
}

const ManhwaSearchListItem: React.FC<ManhwaSearchListItemProps> = ({ manhwa, onAdd }) => {
  const [isGenreExpanded, setIsGenreExpanded] = useState(false);
  const genreRef = useRef<HTMLDivElement>(null);
  const [showExpandButton, setShowExpandButton] = useState(false);

  useEffect(() => {
    if (genreRef.current) {
      setShowExpandButton(genreRef.current.scrollHeight > genreRef.current.clientHeight);
    }
  }, [manhwa.genre]);

  const parseGenres = (genres: string | null) => {
    if (!genres) return [];
    try {
      const parsed = JSON.parse(genres);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      return genres.split(',').map(g => g.trim());
    }
  };

  return (
    <ListItem
      key={manhwa.manhwaId.toString()}
      secondaryAction={
        <IconButton edge="end" aria-label="add" onClick={() => onAdd(manhwa)}>
          <AddIcon />
        </IconButton>
      }
      sx={{ display: 'flex', alignItems: 'center', mb: 1, border: '1px solid #e0e0e0', borderRadius: '4px', p: 1 }}
    >
      <Box sx={{ mr: 2, boxShadow: 3, borderRadius: 1, overflow: 'hidden' }}>
        <img src={manhwa.coverImage || 'https://via.placeholder.com/80x120/cccccc/ffffff?text=No+Image'} alt={manhwa.manhwaName} style={{ width: 80, height: 120, objectFit: 'cover', display: 'block' }} />
      </Box>
      <ListItemText 
        primary={
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {manhwa.manhwaName}
          </Typography>
        }
        secondary={
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1, fontWeight: 'bold', mt: '6px' }}>Genre:</Typography>
              {manhwa.genre && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box ref={genreRef} sx={{ overflow: 'hidden', maxHeight: isGenreExpanded ? 'none' : '24px' }}>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {parseGenres(manhwa.genre).map((g: string) => (
                        <Chip key={g} label={g} size="small" color="primary" />
                      ))}
                    </Stack>
                  </Box>
                  {showExpandButton && (
                    <Button size="small" onClick={() => setIsGenreExpanded(!isGenreExpanded)} sx={{ mt: 0.5 }}>
                      {isGenreExpanded ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1, fontWeight: 'bold' }}>Status:</Typography>
              {manhwa.status && (
                <Chip label={manhwa.status} size="small" color="secondary" />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              Last Episode: <Typography component="span" variant="body2" color="text.primary">{manhwa.lastEpisodeReleased || 'N/A'}</Typography>
            </Typography>
          </Box>
        }
        sx={{ flex: 1, mr: 2 }}
        secondaryTypographyProps={{ component: 'div' }}
      />
    </ListItem>
  );
};

export default ManhwaSearchListItem;