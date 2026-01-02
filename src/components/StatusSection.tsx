import React, { useState } from 'react';
import { Box, Typography, IconButton, useTheme, Collapse } from '@mui/material';
import { ExpandLess } from '@mui/icons-material';
import { ReactNode } from 'react';

interface StatusSectionProps {
  title: string;
  count: number;
  color: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  borderColor?: string;
}

const StatusSection: React.FC<StatusSectionProps> = ({
  title,
  count,
  color,
  children,
  defaultExpanded = true,
  borderColor,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      component="section"
      sx={{
        mb: '3rem',
        borderTop: '1px solid',
        borderColor: borderColor || (theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB'),
        pt: '3rem',
        '&:first-of-type': {
          borderTop: 'none',
          pt: 0,
        },
      }}
    >
      {/* Section Header */}
      <Box
        onClick={handleToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '1.5rem',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'transform 0.2s',
          '&:hover': {
            '& .expand-icon': {
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Color Bar */}
          <Box
            sx={{
              width: '0.25rem',
              height: '2rem',
              bgcolor: color,
              borderRadius: '9999px',
            }}
          />

          {/* Title */}
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#111827',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {title}
          </Typography>

          {/* Count Badge */}
          {count > 0 && (
            <Box
              component="span"
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? `${color}30` : `${color}20`,
                color: color,
                fontSize: '0.75rem',
                fontWeight: 700,
                px: 0.625,
                py: 0.125,
                borderRadius: '9999px',
              }}
            >
              {count}
            </Box>
          )}
        </Box>

        {/* Expand/Collapse Icon */}
        <IconButton
          className="expand-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          sx={{
            p: '0.25rem',
            color: '#9CA3AF',
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
            '&:hover': {
              color: theme.palette.mode === 'dark' ? '#E5E7EB' : '#4B5563',
            },
          }}
        >
          <ExpandLess sx={{ fontSize: '1.5rem' }} />
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={expanded} timeout={300} unmountOnExit>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: '1.5rem',
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default StatusSection;
