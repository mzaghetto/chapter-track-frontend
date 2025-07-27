import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, List, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Stack, Pagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ManhwaListItemWithGenre from './ManhwaListItemWithGenre';
import { useAuth } from '../contexts/AuthContext';
import { filterManhwa, getManhwaById } from '../services/manhwa';
import { createManhwa, updateManhwa, deleteManhwa } from '../services/admin';

interface ManhwaListItem {
  manhwaId: number;
  manhwaName: string;
  coverImage: string | null;
  lastEpisodeReleased?: number;
  genre: string | null;
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null;
}

interface ManhwaDetails {
  id: number;
  name: string;
  author: string | null;
  coverImage: string | null;
  description: string | null;
  genre: string | null;
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null;
  alternativeNames?: string[];
}

const ManhwaManagement = () => {
  const { token } = useAuth();
  const [manhwas, setManhwas] = useState<ManhwaListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(parseInt(process.env.REACT_APP_ADMIN_MANHWAS_PER_PAGE || '10', 10));
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [manhwaToDeleteId, setManhwaToDeleteId] = useState<number | null>(null);
  const [currentManhwa, setCurrentManhwa] = useState<ManhwaDetails | null>(null);
  const [manhwaName, setManhwaName] = useState('');
  const [manhwaAuthor, setManhwaAuthor] = useState('');
  const [manhwaCoverImage, setManhwaCoverImage] = useState('');
  const [manhwaDescription, setManhwaDescription] = useState('');
  const [manhwaStatus, setManhwaStatus] = useState<'ONGOING' | 'COMPLETED' | 'HIATUS' | null>(null);
  const [manhwaGenres, setManhwaGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [manhwaAlternativeNames, setManhwaAlternativeNames] = useState<string[]>([]);
  const [newAlternativeName, setNewAlternativeName] = useState('');

  const fetchManhwas = useCallback(async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await filterManhwa(token, searchTerm, page, pageSize);
        setManhwas(response.data.items);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch manhwas', error);
      } finally {
        setLoading(false);
      }
    }
  }, [token, searchTerm, page, pageSize]);

  useEffect(() => {
    fetchManhwas();
  }, [fetchManhwas]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleOpenCreateDialog = () => {
    setCurrentManhwa(null);
    setManhwaName('');
    setManhwaAuthor('');
    setManhwaCoverImage('');
    setManhwaDescription('');
    setManhwaStatus(null);
    setManhwaGenres([]);
    setManhwaAlternativeNames([]);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = async (manhwa: ManhwaListItem) => {
    if (token) {
      try {
        const response = await getManhwaById(token, manhwa.manhwaId.toString());
        const fullManhwaDetails = response.data.manhwa;
        setCurrentManhwa(fullManhwaDetails);
        setManhwaName(fullManhwaDetails.name);
        setManhwaAuthor(fullManhwaDetails.author || '');
        setManhwaCoverImage(fullManhwaDetails.coverImage || '');
        setManhwaDescription(fullManhwaDetails.description || '');
        setManhwaStatus(fullManhwaDetails.status);

        if (fullManhwaDetails.genre) {
          if (Array.isArray(fullManhwaDetails.genre)) {
            setManhwaGenres(fullManhwaDetails.genre);
          } else if (typeof fullManhwaDetails.genre === 'string') {
            try {
              setManhwaGenres(JSON.parse(fullManhwaDetails.genre));
            } catch (e) {
              setManhwaGenres(fullManhwaDetails.genre.split(',').map((g: string) => g.trim()));
            }
          } else {
            setManhwaGenres([]);
          }
        } else {
          setManhwaGenres([]);
        }

        if (fullManhwaDetails.alternativeNames) {
          setManhwaAlternativeNames(fullManhwaDetails.alternativeNames);
        } else {
          setManhwaAlternativeNames([]);
        }

        setOpenDialog(true);
      } catch (error) {
        console.error('Failed to fetch manhwa details', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    if (token) {
      try {
        const manhwaData = {
          name: manhwaName,
          author: manhwaAuthor,
          coverImage: manhwaCoverImage,
          description: manhwaDescription,
          status: manhwaStatus,
          genre: manhwaGenres,
          alternativeNames: manhwaAlternativeNames,
        };

        if (currentManhwa) {
          await updateManhwa(token, currentManhwa.id.toString(), manhwaData);
        } else {
          await createManhwa(token, manhwaData);
        }
        fetchManhwas();
        handleCloseDialog();
      } catch (error) {
        console.error('Failed to save manhwa', error);
      }
    }
  };

  const handleDelete = (manhwaId: number) => {
    setManhwaToDeleteId(manhwaId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (token && manhwaToDeleteId) {
      try {
        await deleteManhwa(token, manhwaToDeleteId.toString());
        fetchManhwas();
        setOpenConfirmDialog(false);
        setManhwaToDeleteId(null);
      } catch (error) {
        console.error('Failed to delete manhwa', error);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setManhwaToDeleteId(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAddGenre = () => {
    if (newGenre && !manhwaGenres.includes(newGenre)) {
      setManhwaGenres([...manhwaGenres, newGenre]);
      setNewGenre('');
    }
  };

  const handleDeleteGenre = (genreToDelete: string) => {
    setManhwaGenres(manhwaGenres.filter((genre) => genre !== genreToDelete));
  };

  const handleAddAlternativeName = () => {
    if (newAlternativeName && !manhwaAlternativeNames.includes(newAlternativeName)) {
      setManhwaAlternativeNames([...manhwaAlternativeNames, newAlternativeName]);
      setNewAlternativeName('');
    }
  };

  const handleDeleteAlternativeName = (nameToDelete: string) => {
    setManhwaAlternativeNames(manhwaAlternativeNames.filter((name) => name !== nameToDelete));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Manhwas"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '70%' }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
          Add Manhwa
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List>
            {manhwas.map((manhwa) => (
              <ManhwaListItemWithGenre
                key={manhwa.manhwaId.toString()}
                manhwa={manhwa}
                handleOpenEditDialog={handleOpenEditDialog}
                handleDelete={handleDelete}
              />
            ))}
          </List>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} />
            </Box>
          )}
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentManhwa ? 'Edit Manhwa' : 'Add New Manhwa'}</DialogTitle>
        <DialogContent>
          {manhwaCoverImage && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <img src={manhwaCoverImage} alt="Cover Preview" style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }} />
            </Box>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={manhwaName}
            onChange={(e) => setManhwaName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Author"
            type="text"
            fullWidth
            variant="standard"
            value={manhwaAuthor}
            onChange={(e) => setManhwaAuthor(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Cover Image URL"
            type="text"
            fullWidth
            variant="standard"
            value={manhwaCoverImage}
            onChange={(e) => setManhwaCoverImage(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={manhwaDescription}
            onChange={(e) => setManhwaDescription(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={manhwaStatus || ''}
              onChange={(e) => setManhwaStatus(e.target.value as 'ONGOING' | 'COMPLETED' | 'HIATUS' | null)}
            >
              <MenuItem value={"ONGOING"}>Ongoing</MenuItem>
              <MenuItem value={"COMPLETED"}>Completed</MenuItem>
              <MenuItem value={"HIATUS"}>Hiatus</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Genres</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1, gap: 1 }}>
              {manhwaGenres.map((genre) => (
                <Chip key={genre} label={genre} onDelete={() => handleDeleteGenre(genre)} />
              ))}
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Add Genre"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                size="small"
              />
              <Button onClick={handleAddGenre} size="small" sx={{ ml: 1 }}>Add</Button>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Alternative Names</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1, gap: 1 }}>
              {manhwaAlternativeNames.map((name) => (
                <Chip key={name} label={name} onDelete={() => handleDeleteAlternativeName(name)} />
              ))}
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Add Alternative Name"
                value={newAlternativeName}
                onChange={(e) => setNewAlternativeName(e.target.value)}
                size="small"
              />
              <Button onClick={handleAddAlternativeName} size="small" sx={{ ml: 1 }}>Add</Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{currentManhwa ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this manhwa? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManhwaManagement;
