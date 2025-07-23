import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { filterManhwa, getProviders } from '../services/manhwa';
import { createManhwaProvider } from '../services/admin';

interface Manhwa {
  manhwaId: number;
  manhwaName: string;
}

interface Provider {
  id: number;
  name: string;
}

const ManhwaProviderManagement = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [manhwas, setManhwas] = useState<Manhwa[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedManhwaId, setSelectedManhwaId] = useState<number | ''>('');
  const [selectedProviderId, setSelectedProviderId] = useState<number | ''>('');
  const [lastEpisodeReleased, setLastEpisodeReleased] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const fetchManhwasAndProviders = useCallback(async () => {
    if (token) {
      setLoading(true);
      try {
        const manhwasResponse = await filterManhwa(token, '', 1, 1000); // Fetch all manhwas
        const providersResponse = await getProviders(token, ''); // Fetch all providers
        setManhwas(manhwasResponse.data.items.map((m: any) => ({ manhwaId: m.manhwaId, manhwaName: m.manhwaName })));
        setProviders(providersResponse.data.providers.map((p: any) => ({ id: p.id, name: p.name })));
      } catch (error) {
        console.error('Failed to fetch manhwas or providers', error);
      } finally {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    fetchManhwasAndProviders();
  }, [fetchManhwasAndProviders]);

  const handleSubmit = async () => {
    if (token && selectedManhwaId && selectedProviderId) {
      try {
        await createManhwaProvider(token, {
          manhwaId: selectedManhwaId as number,
          providerId: selectedProviderId as number,
          lastEpisodeReleased: lastEpisodeReleased ? parseFloat(lastEpisodeReleased) : undefined,
          url: url || undefined,
        });
        setSnackbarMessage('Manhwa-Provider relationship created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        // Reset form
        setSelectedManhwaId('');
        setSelectedProviderId('');
        setLastEpisodeReleased('');
        setUrl('');
      } catch (error) {
        console.error('Failed to create manhwa-provider relationship', error);
        setSnackbarMessage('Failed to create relationship.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Assign Manhwa to Provider</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="manhwa-select-label">Manhwa</InputLabel>
        <Select
          labelId="manhwa-select-label"
          value={selectedManhwaId}
          label="Manhwa"
          onChange={(e) => setSelectedManhwaId(e.target.value as number)}
        >
          {manhwas.map((manhwa) => (
            <MenuItem key={manhwa.manhwaId} value={manhwa.manhwaId}>
              {manhwa.manhwaName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="provider-select-label">Provider</InputLabel>
        <Select
          labelId="provider-select-label"
          value={selectedProviderId}
          label="Provider"
          onChange={(e) => setSelectedProviderId(e.target.value as number)}
        >
          {providers.map((provider) => (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        margin="normal"
        label="Last Episode Released"
        type="number"
        fullWidth
        value={lastEpisodeReleased}
        onChange={(e) => setLastEpisodeReleased(e.target.value)}
      />

      <TextField
        margin="normal"
        label="URL"
        type="url"
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Assign Manhwa to Provider
      </Button>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManhwaProviderManagement;
