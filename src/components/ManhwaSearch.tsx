import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { filterManhwa, addManhwaToUser } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';

interface ManhwaSearchProps {
  onManhwaAdded: () => void;
}

interface ManhwaSearchResult {
  manhwaId: string;
  manhwaName: string;
}

const ManhwaSearch: React.FC<ManhwaSearchProps> = ({ onManhwaAdded }) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ManhwaSearchResult[]>([]);
  const [searched, setSearched] = useState(false); // New state to track if a search has been performed

  const handleSearch = async () => {
    if (token) {
      try {
        const response = await filterManhwa(token, searchTerm);
        setSearchResults(response.data.items);
        setSearched(true); // Set to true after a search
      } catch (error) {
        console.error('Failed to search for manhwas', error);
        setSearchResults([]); // Clear results on error
        setSearched(true); // Still set to true to show no results message
      }
    }
  };

  const handleAddManhwa = async (manhwaId: string) => {
    if (token) {
      try {
        await addManhwaToUser(token, { 
          manhwa_id: manhwaId,
          manhwa_position: 0, // This will be handled by the backend
          last_episode_read: 0,
          read_url: [],
          notify_telegram: false,
          notification_website: false,
        });
        onManhwaAdded();
      } catch (error) {
        console.error('Failed to add manhwa', error);
      }
    }
  };

  return (
    <Box>
      <TextField
        label="Search for a manhwa"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSearch} fullWidth>
        Search
      </Button>
      
      {searched && searchResults.length === 0 && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          No manhwas found.
        </Typography>
      )}

      {searchResults.length > 0 && (
        <List sx={{ mt: 2 }}>
          {searchResults.map((manhwa) => (
            <ListItem 
              key={manhwa.manhwaId}
              secondaryAction={
                <IconButton edge="end" aria-label="add" onClick={() => handleAddManhwa(manhwa.manhwaId)}>
                  <AddIcon />
                </IconButton>
              }
            >
              <ListItemText primary={manhwa.manhwaName} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ManhwaSearch;