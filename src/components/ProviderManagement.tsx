import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import { getProviders } from '../services/manhwa';
import { createProvider, updateProvider, deleteProvider } from '../services/admin';

interface Provider {
  id: number;
  name: string;
  url: string | null;
  isActive: boolean;
}

const ProviderManagement = () => {
  const { token } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [providerName, setProviderName] = useState('');
  const [providerUrl, setProviderUrl] = useState('');
  const [providerIsActive, setProviderIsActive] = useState(true);

  const fetchProviders = useCallback(async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await getProviders(token, searchTerm);
        setProviders(response.data.providers);
      } catch (error) {
        console.error('Failed to fetch providers', error);
      } finally {
        setLoading(false);
      }
    }
  }, [token, searchTerm]);

  useEffect(() => {
    fetchProviders();
  }, [token, fetchProviders]);

  const handleOpenCreateDialog = () => {
    setCurrentProvider(null);
    setProviderName('');
    setProviderUrl('');
    setProviderIsActive(true);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (provider: Provider) => {
    setCurrentProvider(provider);
    setProviderName(provider.name);
    setProviderUrl(provider.url || '');
    setProviderIsActive(provider.isActive);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    if (token) {
      try {
        if (currentProvider) {
          // Update Provider
          await updateProvider(token, currentProvider.id.toString(), {
            name: providerName,
            url: providerUrl,
            isActive: providerIsActive,
          });
        } else {
          // Create Provider
          await createProvider(token, {
            name: providerName,
            url: providerUrl,
            isActive: providerIsActive,
          });
        }
        fetchProviders();
        handleCloseDialog();
      } catch (error) {
        console.error('Failed to save provider', error);
      }
    }
  };

  const handleDelete = async (providerId: number) => {
    if (token && window.confirm('Are you sure you want to delete this provider?')) {
      try {
        await deleteProvider(token, providerId.toString());
        fetchProviders();
      } catch (error) {
        console.error('Failed to delete provider', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Providers"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '70%' }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
          Add Provider
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {providers.map((provider) => (
            <ListItem
              key={provider.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditDialog(provider)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(provider.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText primary={provider.name} secondary={provider.url} />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentProvider ? 'Edit Provider' : 'Add New Provider'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="URL"
            type="text"
            fullWidth
            variant="standard"
            value={providerUrl}
            onChange={(e) => setProviderUrl(e.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={providerIsActive}
                onChange={(e) => setProviderIsActive(e.target.checked)}
                name="isActive"
                color="primary"
              />
            }
            label="Is Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{currentProvider ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderManagement;
