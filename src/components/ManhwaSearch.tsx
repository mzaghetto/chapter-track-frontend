import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Box, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { filterManhwa } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';
import AddManhwaModal from './AddManhwaModal';

interface ManhwaSearchProps {
  onManhwaAdded: () => void;
}

interface ManhwaSearchResult {
  manhwaId: number;
  manhwaName: string;
  coverImage: string | null;
}

const ManhwaSearch: React.FC<ManhwaSearchProps> = ({ onManhwaAdded }) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ManhwaSearchResult[]>([]);
  const [searched, setSearched] = useState(false); // New state to track if a search has been performed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManhwa, setSelectedManhwa] = useState<{ id: number; name: string; coverImage: string | null } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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

  const handleOpenModal = (manhwaId: number, manhwaName: string, coverImage: string | null) => {
    setSelectedManhwa({ id: manhwaId, name: manhwaName, coverImage });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedManhwa(null);
  };

  const handleManhwaAdded = () => {
    onManhwaAdded();
    handleCloseModal();
    setSnackbar({ open: true, message: 'Manhwa added successfully!', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearched(false);
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
      <Button variant="outlined" onClick={handleClearSearch} fullWidth sx={{ mt: 1 }}>
        Clear Search
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
                <IconButton edge="end" aria-label="add" onClick={() => handleOpenModal(manhwa.manhwaId, manhwa.manhwaName, manhwa.coverImage)}>
                  <AddIcon />
                </IconButton>
              }
              sx={{ display: 'flex', alignItems: 'center', mb: 1, border: '1px solid #e0e0e0', borderRadius: '4px', p: 1 }}
            >
              <Box sx={{ mr: 2 }}>
                <img src={manhwa.coverImage || 'https://via.placeholder.com/50/cccccc/ffffff?text=No+Image'} alt={manhwa.manhwaName} style={{ width: 50, height: 70, objectFit: 'cover', borderRadius: 4 }} />
              </Box>
              <ListItemText primary={manhwa.manhwaName} />
            </ListItem>
          ))}
        </List>
      )}
      {selectedManhwa && (
        <AddManhwaModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          manhwaId={selectedManhwa.id}
          manhwaName={selectedManhwa.name}
          coverImage={selectedManhwa.coverImage}
          onManhwaAdded={handleManhwaAdded}
          setSnackbar={setSnackbar}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManhwaSearch;