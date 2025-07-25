import React, { useCallback, useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import { useAuth } from '../contexts/AuthContext';
import { getUserManhwas, removeManhwaFromUser, updateUserManhwa } from '../services/manhwa';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Switch, Card, CardMedia, CardContent, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Chip, Divider, Tooltip, ToggleButtonGroup, ToggleButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ManhwaSearch from '../components/ManhwaSearch';
import { useNavigate } from 'react-router-dom';
import { registerManhwaNotification } from '../services/notification';
import UpdateManhwaModal from '../components/UpdateManhwaModal';
import ManhwaCardSkeleton from '../components/ManhwaCardSkeleton';
import Logo from '../components/Logo';

import { DetailedUserManhwa } from '../types/manhwa';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 165, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0);
  }
`;

const DashboardPage = () => {
  const { user, token, logout, displayUsernameInHeader } = useAuth();
  const [manhwas, setManhwas] = useState<DetailedUserManhwa[]>([]);
  const [selectedManhwa, setSelectedManhwa] = useState<DetailedUserManhwa | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loadingManhwas, setLoadingManhwas] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [manhwaToRemove, setManhwaToRemove] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(parseInt(process.env.REACT_APP_MANHWAS_PER_PAGE || '8')); // eslint-disable-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  const [status, setStatus] = useState<'ONGOING' | 'COMPLETED' | 'HIATUS' | ''>('');
  // State for pagination of each user status group
  const [userStatusPages, setUserStatusPages] = useState<Record<string, number>>({
    'READING': 1,
    'PAUSED': 1,
    'DROPPED': 1,
    'COMPLETED': 1
  });
  // State for total items in each user status group
  const [userStatusTotals, setUserStatusTotals] = useState<Record<string, number>>({
    'READING': 0,
    'PAUSED': 0,
    'DROPPED': 0,
    'COMPLETED': 0
  });
  // State for manhwas in each user status group
  const [userStatusManhwas, setUserStatusManhwas] = useState<Record<string, DetailedUserManhwa[]>>({
    'READING': [],
    'PAUSED': [],
    'DROPPED': [],
    'COMPLETED': []
  });
  // State for collapsed status of each user status group
  const [userStatusCollapsed, setUserStatusCollapsed] = useState<Record<string, boolean>>({
    'READING': false,
    'PAUSED': false,
    'DROPPED': false,
    'COMPLETED': false
  });

  const fetchManhwas = useCallback(() => {
    setLoadingManhwas(true);
    if (token) {
      getUserManhwas(token, page, pageSize, status === '' ? undefined : status)
        .then((response) => {
          setManhwas(response.data.userManhwas);
        })
        .catch((error) => {
          console.error('Failed to fetch manhwas', error);
        })
        .finally(() => {
          setLoadingManhwas(false);
        });
    }
  }, [token, page, pageSize, status]);

  // Fetch manhwas for a specific user status group
  const fetchUserStatusManhwas = useCallback((userStatus: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED') => {
    if (token) {
      const currentPage = userStatusPages[userStatus] || 1;
      getUserManhwas(token, currentPage, pageSize, status === '' ? undefined : status, userStatus)
        .then((response) => {
          // Check if current page is still valid after getting the total
          const totalItems = response.data.total;
          const totalPages = Math.ceil(totalItems / pageSize);
          const validPage = totalItems > 0 ? Math.min(currentPage, Math.max(1, totalPages)) : 1;
          
          // If page was adjusted, update the page state and fetch the correct data
          if (validPage !== currentPage) {
            setUserStatusPages(prev => ({ ...prev, [userStatus]: validPage }));
            // Fetch data for the valid page
            if (totalItems > 0) {
              getUserManhwas(token, validPage, pageSize, status === '' ? undefined : status, userStatus)
                .then((response2) => {
                  setUserStatusManhwas(prev => ({
                    ...prev,
                    [userStatus]: response2.data.userManhwas
                  }));
                  setUserStatusTotals(prev => ({
                    ...prev,
                    [userStatus]: response2.data.total
                  }));
                })
                .catch((error) => {
                  console.error(`Failed to fetch ${userStatus} manhwas for valid page`, error);
                });
            } else {
              // If no items, set empty array
              setUserStatusManhwas(prev => ({
                ...prev,
                [userStatus]: []
              }));
              setUserStatusTotals(prev => ({
                ...prev,
                [userStatus]: 0
              }));
            }
          } else {
            // Page is valid, use the original response
            setUserStatusManhwas(prev => ({
              ...prev,
              [userStatus]: response.data.userManhwas
            }));
            setUserStatusTotals(prev => ({
              ...prev,
              [userStatus]: response.data.total
            }));
          }
        })
        .catch((error) => {
          console.error(`Failed to fetch ${userStatus} manhwas`, error);
        });
    }
  }, [token, userStatusPages, pageSize, status]);

  // Fetch all user status groups
  const fetchAllUserStatusManhwas = useCallback(() => {
    const statusOrder: ('READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED')[] = ['READING', 'PAUSED', 'DROPPED', 'COMPLETED'];
    statusOrder.forEach(status => {
      fetchUserStatusManhwas(status);
    });
  }, [fetchUserStatusManhwas]);

  useEffect(() => {
    fetchManhwas();
    fetchAllUserStatusManhwas();
  }, [fetchManhwas, fetchAllUserStatusManhwas]);

  const handleRemoveManhwa = async (manhwaId: number) => {
    if (token) {
      try {
        await removeManhwaFromUser(token, [manhwaId.toString()]);
        fetchManhwas();
        fetchAllUserStatusManhwas();
      } catch (error) {
        console.error('Failed to remove manhwa', error);
      }
    }
  };

  const handleOpenModal = (manhwa: DetailedUserManhwa) => {
    setSelectedManhwa(manhwa);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedManhwa(null);
    setModalOpen(false);
  };

  const handleManhwaUpdated = (updatedManhwa?: any) => {
    // Always refresh all status groups to ensure consistency
    fetchAllUserStatusManhwas();
    fetchManhwas();
  };

  const toggleStatusCollapse = (statusKey: string) => {
    setUserStatusCollapsed(prev => ({
      ...prev,
      [statusKey]: !prev[statusKey]
    }));
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, newStatus: 'ONGOING' | 'COMPLETED' | 'HIATUS' | '') => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when changing status filter
  };

  const handleNotificationChange = async (manhwaId: number, isEnabled: boolean) => {
    if (token) {
      try {
        const response = await registerManhwaNotification(token, manhwaId, 'TELEGRAM', isEnabled);
        const updatedManhwa = response.data.userNotification;

        const updatedManhwas = manhwas.map(m =>
          m.manhwaId === updatedManhwa.manhwaId ? { ...m, isTelegramNotificationEnabled: updatedManhwa.isEnabled } : m
        );
        setManhwas(updatedManhwas);

        // Also update the user status manhwas state
        setUserStatusManhwas(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(statusKey => {
            updated[statusKey] = updated[statusKey].map(m =>
              m.manhwaId === updatedManhwa.manhwaId ? { ...m, isTelegramNotificationEnabled: updatedManhwa.isEnabled } : m
            );
          });
          return updated;
        });

      } catch (error) {
        console.error('Failed to update notification status', error);
      }
    }
  };

  const handleOpenConfirmDialog = (manhwaId: number) => {
    setManhwaToRemove(manhwaId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setManhwaToRemove(null);
    setOpenConfirmDialog(false);
  };

  const handleConfirmRemove = () => {
    if (manhwaToRemove) {
      handleRemoveManhwa(manhwaToRemove);
    }
    handleCloseConfirmDialog();
  };

  const handleEpisodeChange = async (manhwaId: string, newEpisode: number) => {
    if (token) {
      try {
        const updatedManhwas = manhwas.map((m) =>
          m.id === manhwaId ? { ...m, lastEpisodeRead: newEpisode } : m,
        );
        setManhwas(updatedManhwas);

        // Also update the user status manhwas state
        setUserStatusManhwas(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(statusKey => {
            updated[statusKey] = updated[statusKey].map(m =>
              m.id === manhwaId ? { ...m, lastEpisodeRead: newEpisode } : m
            );
          });
          return updated;
        });

        // Call backend to update
        await updateUserManhwa(token, manhwaId, { lastEpisodeRead: newEpisode });
      } catch (error) {
        console.error('Failed to update last episode read', error);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Box>
          {user && <Typography sx={{ mr: 2 }}>Welcome, {displayUsernameInHeader ? user.username : user.name}!</Typography>}
          <Button color="inherit" onClick={handleProfileClick}>Profile</Button>
          {user?.role === 'ADMIN' && (
            <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
          )}
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 4 }}>
        <ManhwaSearch onManhwaAdded={fetchManhwas} />
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Filter by Status
          </Typography>
          <ToggleButtonGroup
            value={status}
            exclusive
            onChange={handleStatusChange}
            aria-label="manhwa status"
            size="small"
          >
            <ToggleButton value="" aria-label="all">
              All
            </ToggleButton>
            <ToggleButton value="ONGOING" aria-label="ongoing">
              Ongoing
            </ToggleButton>
            <ToggleButton value="COMPLETED" aria-label="completed">
              Completed
            </ToggleButton>
            <ToggleButton value="HIATUS" aria-label="hiatus">
              Hiatus
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Your Manhwas
        </Typography>
        {loadingManhwas ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
            {Array.from(new Array(pageSize)).map((_, index) => (
              <ManhwaCardSkeleton key={index} />
            ))}
          </Box>
        ) : (
          (() => {
            const statusOrder: ('READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED')[] = ['READING', 'PAUSED', 'DROPPED', 'COMPLETED'];
            const statusLabels: Record<string, string> = {
              'READING': 'Currently Reading',
              'PAUSED': 'On Pause',
              'DROPPED': 'Dropped',
              'COMPLETED': 'Completed'
            };

            return (
              <>
                {statusOrder.map((statusKey) => {
                  const manhwasInStatus = userStatusManhwas[statusKey] || [];
                  const totalItems = userStatusTotals[statusKey] || 0;
                  const currentPage = userStatusPages[statusKey] || 1;
                  const totalPages = Math.ceil(totalItems / pageSize);

                  // Always show all status blocks, even if empty

                  const isCollapsed = userStatusCollapsed[statusKey] || false;
                  // Auto-collapse empty sections
                  const shouldBeCollapsed = totalItems === 0 ? true : isCollapsed;
                  
                  return (
                    <Accordion 
                      key={statusKey} 
                      expanded={!shouldBeCollapsed}
                      onChange={() => toggleStatusCollapse(statusKey)}
                      sx={{ 
                        mb: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:before': { display: 'none' },
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <AccordionSummary
                        expandIcon={totalItems > 0 ? (shouldBeCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />) : null}
                        sx={{ 
                          backgroundColor: 'background.paper',
                          borderBottom: shouldBeCollapsed ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
                          minHeight: '64px !important',
                          '&.Mui-expanded': {
                            minHeight: '64px !important',
                          },
                          '& .MuiAccordionSummary-content': {
                            margin: '12px 0 !important',
                            '&.Mui-expanded': {
                              margin: '12px 0 !important',
                            },
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography variant="h6" component="h2" sx={{ flexGrow: 1, fontWeight: 600 }}>
                            {statusLabels[statusKey] || statusKey} 
                            <Typography component="span" sx={{ ml: 1, fontSize: '0.9rem', color: 'text.secondary' }}>
                              ({totalItems})
                            </Typography>
                          </Typography>
                          {totalItems === 0 && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                              No manhwas
                            </Typography>
                          )}
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: 0 }}>
                      {totalItems > 0 && (
                          <>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3, p: 3 }}>
                              {manhwasInStatus.map((manhwa) => (
                                <Card
                                  key={manhwa.id}
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead
                                      ? '2px solid orange'
                                      : '1px solid rgba(0, 0, 0, 0.12)',
                                    animation: manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead
                                      ? `${pulse} 1.5s infinite`
                                      : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                      transform: 'translateY(-2px)'
                                    }
                                  }}
                                >
                            <Box sx={{ position: 'relative' }}>
                              <CardMedia
                                component="img"
                                height="250"
                                image={manhwa.coverImage || 'https://via.placeholder.com/250/cccccc/ffffff?text=No+Image'} // Placeholder if no image
                                alt={manhwa.manhwaName}
                                sx={{ objectFit: 'cover' }}
                              />
                              {manhwa.lastEpisodeReleasedAllProviders !== null && manhwa.lastEpisodeReleased !== null && manhwa.lastEpisodeReleasedAllProviders > manhwa.lastEpisodeReleased && (
                                <Tooltip title={`Newer episodes available from other providers! (Latest: ${manhwa.lastEpisodeReleasedAllProviders})`} arrow>
                                  <InfoOutlinedIcon
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      left: 8,
                                      color: 'info.main',
                                      fontSize: 30,
                                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                      borderRadius: '50%',
                                      p: 0.5,
                                    }}
                                  />
                                </Tooltip>
                              )}
                              {manhwa.lastEpisodeReleased && typeof manhwa.lastEpisodeRead === 'number' && manhwa.lastEpisodeReleased > manhwa.lastEpisodeRead && (
                                <Tooltip title={`New Episode Available! (${manhwa.lastEpisodeReleased})` + (manhwa.lastEpisodeReleasedAllProviders !== manhwa.lastEpisodeReleased ? ` (Latest: ${manhwa.lastEpisodeReleasedAllProviders})` : '')} arrow>
                                  <InfoOutlinedIcon
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      right: 8,
                                      color: 'warning.main',
                                      fontSize: 30,
                                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                      borderRadius: '50%',
                                      p: 0.5,
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, px: 2, pt: 2 }}>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  sx={{
                                    fontSize: '1.1rem',
                                    lineHeight: 1.3,
                                    mb: 0,
                                    flexGrow: 1,
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    minHeight: '2.86rem', // Equivalent to 2 lines of 1.1rem font-size with 1.3 line-height
                                  }}
                                  title={manhwa.manhwaName}
                                >
                                  {manhwa.manhwaName}
                                </Typography>
                                <Chip label={manhwa.providerName} size="small" sx={{ ml: 1 }} />
                              </Box>
                              <Divider sx={{ my: 1, width: '100%' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 2 }}>
                                Last Episode Read:
                                <IconButton
                                  size="small"
                                  onClick={() => handleEpisodeChange(manhwa.id, (manhwa.lastEpisodeRead || 0) - 1)}
                                  disabled={(manhwa.lastEpisodeRead || 0) <= 0}
                                  sx={{ ml: 1 }}
                                >
                                  <RemoveIcon fontSize="inherit" />
                                </IconButton>
                                <Typography variant="body2" component="span" sx={{ mx: 0.5 }}>
                                  {manhwa.lastEpisodeRead}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEpisodeChange(manhwa.id, (manhwa.lastEpisodeRead || 0) + 1)}
                                >
                                  <AddIcon fontSize="inherit" />
                                </IconButton>
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Switch
                                  edge="start"
                                  onChange={(e) => handleNotificationChange(parseInt(manhwa.manhwaId), e.target.checked)}
                                  checked={manhwa.isTelegramNotificationEnabled || false}
                                  inputProps={{ 'aria-label': 'toggle telegram notifications' }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Notifications
                                </Typography>
                              </Box>
                              <Box>
                                <IconButton aria-label="edit" onClick={() => handleOpenModal(manhwa)} size="small">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => handleOpenConfirmDialog(parseInt(manhwa.manhwaId))} size="small">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </CardActions>
                          </Card>
                        ))}
                      </Box>
                    {totalPages > 1 && (
                              <Box sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}>
                                <Pagination
                                  count={totalPages}
                                  page={currentPage}
                                  onChange={(event, value) => {
                                    setUserStatusPages(prev => ({ ...prev, [statusKey]: value }));
                                    // Fetch new data for this page
                                    if (token) {
                                      getUserManhwas(token, value, pageSize, status === '' ? undefined : status, statusKey)
                                        .then((response) => {
                                          setUserStatusManhwas(prev => ({
                                            ...prev,
                                            [statusKey]: response.data.userManhwas
                                          }));
                                          setUserStatusTotals(prev => ({
                                            ...prev,
                                            [statusKey]: response.data.total
                                          }));
                                        })
                                        .catch((error) => {
                                          console.error(`Failed to fetch ${statusKey} manhwas for valid page`, error);
                                        });
                                    }
                                  }}
                                  color="primary"
                                  siblingCount={1}
                                  boundaryCount={1}
                                />
                              </Box>
                            )}
                          </>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </>
            );
          })()
        )}
      </Container>
      <UpdateManhwaModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        manhwa={selectedManhwa}
        onManhwaUpdated={handleManhwaUpdated}
      />
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this manhwa from your list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmRemove} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
