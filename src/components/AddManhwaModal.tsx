import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { addManhwaToUser, getManhwaProviders } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';

enum UserManhwaStatus {
  READING = 'READING',
  TO_READ = 'TO_READ',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  DROPPED = 'DROPPED',
}

interface AddManhwaModalProps {
  open: boolean;
  handleClose: () => void;
  manhwaId: number;
  manhwaName: string;
  coverImage: string | null;
  onManhwaAdded: () => void;
  setSnackbar: (snackbar: { open: boolean, message: string, severity: 'success' | 'error' }) => void;
}

interface ManhwaProvider {
  id: number;
  providerName: string;
  providerId: number;
  lastEpisodeReleased: number | null;
}

const AddManhwaModal: React.FC<AddManhwaModalProps> = ({ open, handleClose, manhwaId, manhwaName, coverImage, onManhwaAdded, setSnackbar }) => {
  const { token } = useAuth();
  const [lastEpisodeRead, setLastEpisodeRead] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [status, setStatus] = useState<UserManhwaStatus>(UserManhwaStatus.READING);
  const [providers, setProviders] = useState<ManhwaProvider[]>([]);

  useEffect(() => {
    if (open && token) {
      getManhwaProviders(token, manhwaId)
        .then(response => {
          setProviders(response.data.manhwaProviders);
          // Optionally pre-select the first provider if available
          if (response.data.manhwaProviders.length > 0) {
            setSelectedProvider(response.data.manhwaProviders[0].providerId);
          }
        })
        .catch(error => {
          console.error('Failed to fetch manhwa providers', error);
        });
    }
  }, [open, token, manhwaId]);

  const handleAdd = async () => {
    if (token) {
      try {
        await addManhwaToUser(token, {
          manhwaId,
          providerId: selectedProvider,
          status,
          lastEpisodeRead,
          order: 0, // Default order, backend will handle actual ordering
        });
        onManhwaAdded();
        handleClose();
      } catch (error: any) {
        console.error('Failed to add manhwa', error);
        let errorMessage = 'Failed to add manhwa.';
        if (error.response && error.response.data && error.response.data.message === 'Manhwa already exists.') {
          errorMessage = 'This manhwa is already in your list.';
        }
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add {manhwaName}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <img src={coverImage || 'https://via.placeholder.com/150/cccccc/ffffff?text=No+Image'} alt={manhwaName} style={{ width: 150, height: 200, objectFit: 'cover', borderRadius: 4 }} />
          <DialogContentText sx={{ mt: 2 }}>
            Select a provider and set the last episode read for this manhwa.
          </DialogContentText>
        </Box>
        <FormControl fullWidth margin="dense">
          <InputLabel id="provider-select-label">Provider</InputLabel>
          <Select
            labelId="provider-select-label"
            id="provider-select"
            value={selectedProvider || ''}
            onChange={(e) => setSelectedProvider(e.target.value as number)}
          >
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.providerId}>
                {provider.providerName} {provider.lastEpisodeReleased ? `(Last Episode: ${provider.lastEpisodeReleased})` : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          id="last-episode-read"
          label="Last Episode Read"
          type="number"
          fullWidth
          variant="standard"
          value={lastEpisodeRead}
          onChange={(e) => setLastEpisodeRead(parseInt(e.target.value))}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserManhwaStatus)}
          >
            {Object.values(UserManhwaStatus).map((s) => (
              <MenuItem key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddManhwaModal;
