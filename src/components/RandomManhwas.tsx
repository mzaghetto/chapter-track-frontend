import { useEffect, useState } from 'react';
import * as manhwaService from '../services/manhwa';
import { Manhwa } from '../types/manhwa';
import { Card, CardMedia, CardContent, Typography, CircularProgress, Box } from '@mui/material';

export function RandomManhwas() {
  const [manhwas, setManhwas] = useState<Manhwa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManhwas = async () => {
      try {
        const count = parseInt(process.env.REACT_APP_RANDOM_MANHWAS_COUNT || '8');
        const response = await manhwaService.getRandomManhwas(count);
        setManhwas(response.data.manhwas);
      } catch (error) {
        console.error('Error fetching random manhwas:', error);
      }
      setLoading(false);
    };

    fetchManhwas();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2, mt: 4 }}>
      {manhwas.map((manhwa) => (
        <Card key={manhwa.id}>
          <CardMedia
            component="img"
            height="300"
            image={manhwa.coverImage || 'https://via.placeholder.com/300/cccccc/ffffff?text=No+Image'}
            alt={manhwa.name}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {manhwa.name}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
