import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { updateUserManhwa } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';

interface UpdateManhwaModalProps {
  open: boolean;
  handleClose: () => void;
  manhwaId: string;
  currentEpisode: number;
  onManhwaUpdated: () => void;
}

const UpdateManhwaModal: React.FC<UpdateManhwaModalProps> = ({ open, handleClose, manhwaId, currentEpisode, onManhwaUpdated }) => {
  const { token } = useAuth();
  const [newEpisode, setNewEpisode] = useState(currentEpisode);

  const handleUpdate = async () => {
    if (token) {
      try {
        await updateUserManhwa(token, manhwaId, { last_episode_read: newEpisode });
        onManhwaUpdated();
        handleClose();
      } catch (error) {
        console.error('Failed to update manhwa', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Manhwa</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the last episode you have read for this manhwa.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Last Episode Read"
          type="number"
          fullWidth
          variant="standard"
          value={newEpisode}
          onChange={(e) => setNewEpisode(parseInt(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateManhwaModal;
