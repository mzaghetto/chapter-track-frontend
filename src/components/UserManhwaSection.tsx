import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, Pagination, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DetailedUserManhwa } from '../types/manhwa';
import { getUserManhwas } from '../services/manhwa';
import { useAuth } from '../contexts/AuthContext';
import ManhwaCard from './ManhwaCard';

interface UserManhwaSectionProps {
  userStatus: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED';
  onEdit: (manhwa: DetailedUserManhwa) => void;
  onConfirmDelete: (manhwaId: number) => void;
  manhwaName: string;
}

const statusLabels: Record<string, string> = {
  READING: 'Currently Reading',
  PAUSED: 'On Pause',
  DROPPED: 'Dropped',
  COMPLETED: 'Completed',
};

const UserManhwaSection: React.FC<UserManhwaSectionProps> = ({ userStatus, onEdit, onConfirmDelete, manhwaName }) => {
  const { token } = useAuth();
  const [manhwas, setManhwas] = useState<DetailedUserManhwa[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalManhwas, setTotalManhwas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasFetchedOnce = useRef(false);

  const pageSize = parseInt(process.env.REACT_APP_MANHWAS_PER_PAGE || '8');

  const fetchManhwas = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getUserManhwas(token, page, pageSize, undefined, userStatus, manhwaName);
      const total = response.data.total;
      setManhwas(response.data.userManhwas);
      setTotalManhwas(total);
      setTotalPages(Math.ceil(total / pageSize));

      if (!hasFetchedOnce.current) {
        setIsExpanded(total > 0);
        hasFetchedOnce.current = true;
      }
    } catch (error) {
      console.error(`Failed to fetch ${userStatus} manhwas`, error);
    } finally {
      setLoading(false);
    }
  }, [token, page, pageSize, userStatus, manhwaName]);

  useEffect(() => {
    fetchManhwas();
  }, [fetchManhwas]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAccordionChange = (event: React.SyntheticEvent, newExpanded: boolean) => {
    setIsExpanded(newExpanded);
  };

  return (
    <Accordion expanded={isExpanded} onChange={handleAccordionChange} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{statusLabels[userStatus]} ({totalManhwas})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading && !hasFetchedOnce.current ? (
          <CircularProgress />
        ) : (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
              {manhwas.map((manhwa) => (
                <ManhwaCard key={manhwa.id} manhwa={manhwa} onEdit={onEdit} onConfirmDelete={onConfirmDelete} />
              ))}
            </Box>
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} />
              </Box>
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default UserManhwaSection;
