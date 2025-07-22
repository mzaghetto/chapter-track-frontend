import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getProviders } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';

interface Provider {
  id: number;
  name: string;
}

interface ProviderFilterProps {
  onProviderChange: (providerId: number | '') => void;
}

const ProviderFilter: React.FC<ProviderFilterProps> = ({ onProviderChange }) => {
  const { token } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<number | '' >('');

  useEffect(() => {
    if (token) {
      getProviders(token)
        .then((response) => {
          setProviders(response.data.providers);
        })
        .catch((error) => {
          console.error('Failed to fetch providers', error);
        });
    }
  }, [token]);

  const handleChange = (event: any) => {
    const providerId = event.target.value as number | ''
    setSelectedProvider(providerId);
    onProviderChange(providerId);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="provider-filter-label">Filter by Provider</InputLabel>
      <Select
        labelId="provider-filter-label"
        id="provider-filter"
        value={selectedProvider}
        label="Filter by Provider"
        onChange={handleChange}
      >
        <MenuItem value=""><em>All</em></MenuItem>
        {providers.map((provider) => (
          <MenuItem key={provider.id} value={provider.id}>
            {provider.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProviderFilter;
