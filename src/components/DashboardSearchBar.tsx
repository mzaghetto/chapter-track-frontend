import React from 'react';
import { Box, TextField, InputAdornment, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface DashboardSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

const DashboardSearchBar: React.FC<DashboardSearchBarProps> = ({ value, onChange, onSearch }) => {
  const theme = useTheme();

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: '28rem' },
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <TextField
        fullWidth
        placeholder="Search your library..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          '& .MuiOutlinedInput-root': {
            bgcolor: theme.palette.mode === 'dark' ? '#1F2937' : '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
            boxSizing: 'border-box',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? '#4B5563' : '#D1D5DB',
            },
            '&.Mui-focused': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
            },
            transition: 'all 0.2s ease-in-out',
          },
          '& .MuiOutlinedInput-input': {
            py: 1.125,
            px: 1.25,
            fontSize: '0.875rem',
            fontWeight: 400,
            color: theme.palette.mode === 'dark' ? '#F9FAFB' : '#111827',
            boxSizing: 'border-box',
            '&::placeholder': {
              color: '#9CA3AF',
              opacity: 1,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: 0.5 }}>
              <SearchIcon
                sx={{
                  fontSize: '1.25rem',
                  color: '#9CA3AF',
                }}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" sx={{ mr: 0.5 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? '#374151' : '#E5E7EB',
                  borderRadius: '0.375rem',
                  px: 0.75,
                  py: 0.25,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#9CA3AF',
                  fontFamily: 'monospace',
                }}
              >
                ⌘K
              </Box>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default DashboardSearchBar;
