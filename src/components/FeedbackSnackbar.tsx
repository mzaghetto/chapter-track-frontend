import React from 'react';
import { Snackbar } from '@mui/material';

interface FeedbackSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const FeedbackSnackbar: React.FC<FeedbackSnackbarProps> = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
  );
};

export default FeedbackSnackbar;
