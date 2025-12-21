import { useEffect, useState } from 'react';
import * as manhwaService from '../services/manhwa';
import { Manhwa } from '../types/manhwa';
import { Card, CardMedia, Typography, CircularProgress, Box, useTheme } from '@mui/material';

export function RandomManhwas() {
  const [manhwas, setManhwas] = useState<Manhwa[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Mapear categorias para cores
  const getCategoryColor = (category?: string) => {
    if (!category) return theme.palette.mode === 'dark' ? '#60a5fa' : '#3b82f6'; // blue padrão

    const colors: { [key: string]: string } = {
      'action': theme.palette.mode === 'dark' ? '#60a5fa' : '#2563eb',
      'fantasy': theme.palette.mode === 'dark' ? '#c084fc' : '#9333ea',
      'system': theme.palette.mode === 'dark' ? '#2dd4bf' : '#0d9488',
      'adventure': theme.palette.mode === 'dark' ? '#f87171' : '#dc2626',
      'thriller': theme.palette.mode === 'dark' ? '#fb923c' : '#f97316',
      'supernatural': theme.palette.mode === 'dark' ? '#818cf8' : '#6366f1',
      'martial arts': theme.palette.mode === 'dark' ? '#4ade80' : '#16a34a',
      'manhua': theme.palette.mode === 'dark' ? '#22d3ee' : '#06b6d4',
      'manhwa': theme.palette.mode === 'dark' ? '#22d3ee' : '#06b6d4',
    };

    return colors[category.toLowerCase()] || (theme.palette.mode === 'dark' ? '#60a5fa' : '#2563eb');
  };

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
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
      gap: '1.5rem', // gap-6 = 24px / 16 = 1.5rem
    }}>
      {manhwas.map((manhwa) => (
        <Box
          key={manhwa.id}
          className="group relative cursor-pointer"
          sx={{
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <Card
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0.75rem', // rounded-xl = 12px / 16 = 0.75rem
              aspectRatio: '2/3', // aspect-[2/3]
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-in-out',
              bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              },
            }}
          >
            <CardMedia
              component="img"
              image={manhwa.coverImage || 'https://via.placeholder.com/300/cccccc/ffffff?text=No+Image'}
              alt={manhwa.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1)',
                transition: 'transform 0.5s ease-in-out',
                '.group:hover &': {
                  transform: 'scale(1.1)',
                },
              }}
            />

            {/* Gradient overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
                opacity: 0.8,
                transition: 'opacity 0.3s ease-in-out',
                '.group:hover &': {
                  opacity: 0.9,
                },
              }}
            />

            {/* Badge "HOT" para manhwas populares */}
            {manhwa.id === '1' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8, // top-2 = 8px
                  right: 8, // right-2 = 8px
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '0.625rem', // text-[10px] = 10px / 16 = 0.625rem
                  fontWeight: 'bold',
                  px: 0.5, // px-2 = 8px / 16 = 0.5rem
                  py: 0.25, // py-1 = 4px / 16 = 0.25rem
                  borderRadius: '0.25rem', // rounded = 4px / 16 = 0.25rem
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                  zIndex: 10,
                }}
              >
                HOT
              </Box>
            )}

            {/* Content overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                p: 1, // p-4 = 16px / 16 = 1rem
                width: '100%',
                zIndex: 5,
              }}
            >
              {/* Category badge */}
              <Typography
                component="span"
                sx={{
                  fontSize: '0.625rem', // text-[10px] = 10px / 16 = 0.625rem
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  color: getCategoryColor(manhwa.genre[0]),
                  mb: 0.25, // mb-1 = 4px / 16 = 0.25rem
                  display: 'inline-block',
                  letterSpacing: '0.05em', // tracking-wider
                  backgroundColor: 'rgba(0, 0, 0, 1)', // fundo totalmente preto
                  padding: '2px 6px', // espaçamento interno
                  borderRadius: '4px', // bordas mais arredondadas para parecer tag
                }}
              >
                {manhwa.genre[0] || 'Action'}
              </Typography>

              {/* Manhwa title */}
              <Typography
                component="h3"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.125rem', // text-lg = 18px / 16 = 1.125rem
                  lineHeight: 1.25, // leading-tight
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)', // drop-shadow-md
                }}
              >
                {manhwa.name}
              </Typography>
            </Box>
          </Card>
        </Box>
      ))}
    </Box>
  );
}
