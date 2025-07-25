import React from 'react';
import { ToggleButtonGroup, ToggleButton, Typography, Box } from '@mui/material';

interface ManhwaStatusFilterProps {
  status: string;
  onStatusChange: (event: React.MouseEvent<HTMLElement>, newStatus: string) => void;
}

const ManhwaStatusFilter: React.FC<ManhwaStatusFilterProps> = ({ status, onStatusChange }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Filter by Status
      </Typography>
      <ToggleButtonGroup
        value={status}
        exclusive
        onChange={onStatusChange}
        aria-label="manhwa status"
        size="small"
      >
        <ToggleButton value="" aria-label="all">
          All
        </ToggleButton>
        <ToggleButton value="ONGOING" aria-label="ongoing">
          Ongoing
        </ToggleButton>
        <ToggleButton value="COMPLETED" aria-label="completed">
          Completed
        </ToggleButton>
        <ToggleButton value="HIATUS" aria-label="hiatus">
          Hiatus
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ManhwaStatusFilter;
