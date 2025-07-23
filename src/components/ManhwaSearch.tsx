import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Box, Snackbar, Alert, Pagination } from '@mui/material';
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
  lastEpisodeReleased?: number;
  author: string | null;
  genre: string | null;
  description: string | null;
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null;
}

const ManhwaSearch: React.FC<ManhwaSearchProps> = ({ onManhwaAdded }) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ManhwaSearchResult[]>([]);
  const [searched, setSearched] = useState(false); // New state to track if a search has been performed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManhwa, setSelectedManhwa] = useState<{ id: number; name: string; coverImage: string | null } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(parseInt(process.env.REACT_APP_SEARCH_PAGE_SIZE || '3')); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [totalItems, setTotalItems] = useState(0);

  const handleSearch = useCallback(async () => {
    if (token) {
      try {
        const response = await filterManhwa(token, searchTerm, page, pageSize);
        setSearchResults(response.data.items);
        setTotalItems(response.data.totalItems);
        setSearched(true); // Set to true after a search
      } catch (error) {
        console.error('Failed to search for manhwas', error);
        setSearchResults([]); // Clear results on error
        setTotalItems(0);
        setSearched(true); // Still set to true to show no results message
      }
    }
  }, [token, searchTerm, page, pageSize]);

  useEffect(() => {
    if (searched) {
      handleSearch();
    }
  }, [page, handleSearch, searched]);

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
    setTotalItems(0);
    setPage(1);
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
              <ListItemText 
                primary={manhwa.manhwaName}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Author: {manhwa.author || 'N/A'}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.primary">
                      Genre: {manhwa.genre || 'N/A'}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.primary">
                      Status: {manhwa.status || 'N/A'}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.primary">
                      Last Episode: {manhwa.lastEpisodeReleased || 'N/A'}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
      {totalItems > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(totalItems / pageSize)} // Assuming 10 items per page for search results
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
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