import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { updateUserManhwa, getManhwaProviders } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';

import { DetailedUserManhwa } from '../types/manhwa';

  interface ManhwaProvider {
    id: number;
    providerName: string;
    providerId: number;
  }

interface UpdateManhwaModalProps {
  open: boolean;
  handleClose: () => void;
  manhwa: DetailedUserManhwa | null;
  onManhwaUpdated: () => void;
}

const UpdateManhwaModal: React.FC<UpdateManhwaModalProps> = ({ open, handleClose, manhwa, onManhwaUpdated }) => {
  const { token } = useAuth();
  const [lastEpisodeRead, setLastEpisodeRead] = useState(manhwa?.lastEpisodeRead || 0);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(manhwa?.providerId || null);
  const [providers, setProviders] = useState<ManhwaProvider[]>([]);

  useEffect(() => {
    setLastEpisodeRead(manhwa?.lastEpisodeRead || 0);
    if (token && manhwa) {
        getManhwaProviders(token, parseInt(manhwa.manhwaId))
            .then(response => {
                setProviders(response.data.manhwaProviders);

                // Find the ManhwaProvider that matches the manhwa's providerId
                const matchingManhwaProvider = response.data.manhwaProviders.find(
                    (mp: any) => mp.providerId === manhwa.providerId
                );
                if (matchingManhwaProvider) {
                    setSelectedProvider(matchingManhwaProvider.providerId);
                } else {
                    setSelectedProvider(null);
                }
            })
            .catch(error => {
                console.error('Failed to fetch manhwa providers', error);
            });
    }
  }, [manhwa, token]);

  const handleUpdate = async () => {
    if (token && manhwa) {
      try {
        await updateUserManhwa(token, manhwa.id.toString(), { 
            lastEpisodeRead: lastEpisodeRead,
            providerId: selectedProvider
        });
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
          value={lastEpisodeRead}
          onChange={(e) => setLastEpisodeRead(parseInt(e.target.value))}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="provider-select-label">Provider</InputLabel>
          <Select
            labelId="provider-select-label"
            id="provider-select"
            value={selectedProvider || ''}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.providerId}>
                {provider.providerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateManhwaModal;
