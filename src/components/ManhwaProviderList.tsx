import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, TextField, List, ListItem, ListItemText, Pagination, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { getManhwaProviders, deleteManhwaProvider } from '../services/admin';
import { getProviders } from '../services/manhwa';

interface ManhwaProviderItem {
  id: number;
  manhwaId: number;
  manhwaName: string;
  providerId: number;
  providerName: string;
  lastEpisodeReleased: number | null;
  url: string | null;
}

interface Provider {
  id: number;
  name: string;
}

const ManhwaProviderList = () => {
  const { token } = useAuth();
  const [manhwaProviders, setManhwaProviders] = useState<ManhwaProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [manhwaNameFilter, setManhwaNameFilter] = useState('');
  const [providerIdFilter, setProviderIdFilter] = useState<number | ''>('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [pageSize] = useState(parseInt(process.env.REACT_APP_ADMIN_MANHWA_PROVIDER_PAGE_SIZE || '10', 10));

  const fetchManhwaProviders = useCallback(async () => {
    if (token) {
      setLoading(true);
      try {
        const params: { manhwaName?: string; providerId?: number; page: number; pageSize: number } = {
          page,
          pageSize,
        };

        if (manhwaNameFilter) {
          params.manhwaName = manhwaNameFilter;
        }

        if (providerIdFilter) {
          params.providerId = providerIdFilter as number;
        }

        const response = await getManhwaProviders(token, params.manhwaName || '', params.providerId || '', page, pageSize);
        setManhwaProviders(response.data.manhwaProviders);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch manhwa providers', error);
      } finally {
        setLoading(false);
      }
    }
  }, [token, manhwaNameFilter, providerIdFilter, page, pageSize]);

  const fetchProviders = useCallback(async () => {
    if (token) {
      try {
        const response = await getProviders(token, '');
        setProviders(response.data.providers);
      } catch (error) {
        console.error('Failed to fetch providers', error);
      }
    }
  }, [token]);

  useEffect(() => {
    fetchManhwaProviders();
  }, [fetchManhwaProviders]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDelete = async (id: number) => {
    if (token && window.confirm('Are you sure you want to delete this manhwa-provider relationship?')) {
      try {
        await deleteManhwaProvider(token, id.toString());
        fetchManhwaProviders();
      } catch (error) {
        console.error('Failed to delete manhwa-provider relationship', error);
      }
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Manhwa-Provider Relationships</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search by Manhwa Name"
          value={manhwaNameFilter}
          onChange={(e) => setManhwaNameFilter(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="provider-filter-label">Filter by Provider</InputLabel>
          <Select
            labelId="provider-filter-label"
            value={providerIdFilter}
            label="Filter by Provider"
            onChange={(e) => setProviderIdFilter(e.target.value as number)}
          >
            <MenuItem value="">All Providers</MenuItem>
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List>
            {manhwaProviders.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText 
                  primary={`${item.manhwaName} - ${item.providerName}`}
                  secondary={`Last Episode: ${item.lastEpisodeReleased || 'N/A'} | URL: ${item.url || 'N/A'}`}
                />
              </ListItem>
            ))}
          </List>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ManhwaProviderList;
