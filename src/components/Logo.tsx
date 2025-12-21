import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AutoStories } from '@mui/icons-material';

interface LogoProps {
  height?: string;
  onClick?: () => void;
  color?: 'white' | 'dark';
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({
  height = 'auto',
  onClick,
  color = 'dark',
  size = 'medium'
}) => {
  const navigate = useNavigate();

  // Size configurations
  const sizeConfig = {
    small: {
      iconSize: 24,
      fontSize: '1rem',
      iconBoxSize: 24,
      spacing: 0.5,
    },
    medium: {
      iconSize: 20,
      fontSize: '1.25rem',
      iconBoxSize: 32,
      spacing: 1,
    },
    large: {
      iconSize: 28,
      fontSize: '1.5rem',
      iconBoxSize: 40,
      spacing: 1.5,
    }
  };

  const config = sizeConfig[size];
  const isWhite = color === 'white';

  const handleLogoClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        gap: config.spacing,
        '&:hover .logo-icon': {
          bgcolor: isWhite
            ? 'rgba(29, 78, 216, 0.8)'
            : 'rgba(255, 255, 255, 0.3)',
        }
      }}
      onClick={handleLogoClick}
    >
      <Box
        className="logo-icon"
        sx={{
          position: 'relative',
          width: config.iconBoxSize,
          height: config.iconBoxSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isWhite
            ? 'rgba(255, 255, 255, 0.2)'
            : 'transparent',
          borderRadius: '8px',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <AutoStories
          sx={{
            fontSize: config.iconSize,
            color: isWhite ? 'white' : 'text.primary',
          }}
        />
      </Box>

      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 700, // font-bold
          fontSize: config.fontSize,
          color: isWhite ? 'white' : 'text.primary',
          letterSpacing: '-0.025em', // tracking-tight equivalent
          fontFamily: 'Inter, system-ui, sans-serif',
          lineHeight: 1.2,
        }}
      >
        Chapter
        <Box component="span" sx={{ fontWeight: 400, opacity: 0.9 }}>
          Track
        </Box>
      </Typography>
    </Box>
  );
};

export default Logo;
