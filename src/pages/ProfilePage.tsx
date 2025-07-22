
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateTelegramLinkingToken, resetTelegramLinking, updateTelegramNotificationStatus } from '../services/notification';
import { Container, Typography, Button, Box, Switch, FormControlLabel, Paper, CircularProgress, Snackbar } from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, token, logout, refreshUserProfile } = useAuth();
  const [telegramToken, setTelegramToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' });
  const navigate = useNavigate();

  const handleGenerateToken = async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await generateTelegramLinkingToken(token);
        setTelegramToken(response.data.telegramLinkingToken);
        setSnackbar({ open: true, message: 'Token generated successfully!' });
        refreshUserProfile(); // Refresh user data after generating token
      } catch (error) {
        console.error('Failed to generate token', error);
        setSnackbar({ open: true, message: 'Failed to generate token.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetLinking = async () => {
    if (token) {
      setLoading(true);
      try {
        await resetTelegramLinking(token);
        setTelegramToken(null);
        refreshUserProfile(); // Refresh user data after resetting linking
        setSnackbar({ open: true, message: 'Telegram linking reset successfully!' });
      } catch (error) {
        console.error('Failed to reset linking', error);
        setSnackbar({ open: true, message: 'Failed to reset linking.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTelegramNotificationToggle = async (isEnabled: boolean) => {
    if (token) {
      try {
        await updateTelegramNotificationStatus(token, isEnabled);
        refreshUserProfile(); // Refresh user data after updating notification status
        setSnackbar({ open: true, message: `Telegram notifications ${isEnabled ? 'enabled' : 'disabled'}` });
      } catch (error: any) {
        console.error('Failed to update notification status', error);
        let errorMessage = 'Failed to update notification status.';
        if (error.response && error.response.data && error.response.data.message === 'Telegram ID is required when the user hasn\'t registered one.') {
          errorMessage = 'Please link your Telegram account first to enable notifications.';
        }
        setSnackbar({ open: true, message: errorMessage });
      }
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    MangaToRead
                </Typography>
                <Button color="inherit" onClick={handleDashboardClick}>Dashboard</Button>
                <Button color="inherit" onClick={logout}>Logout</Button>
            </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Profile
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">User Information</Typography>
                    <Typography><strong>Name:</strong> {user?.name}</Typography>
                    <Typography><strong>Email:</strong> {user?.email}</Typography>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Telegram Integration</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={user?.telegramActive || false}
                                onChange={(e) => handleTelegramNotificationToggle(e.target.checked)}
                            />
                        }
                        label="Enable Telegram Notifications"
                    />
                    <Box sx={{ my: 2 }}>
                        {user?.telegramId ? (
                            <Typography>
                                Your account is linked to Telegram (ID: {user.telegramId}).
                            </Typography>
                        ) : (
                            <Typography>
                                Your account is not linked to Telegram.
                            </Typography>
                        )}
                    </Box>
                    {telegramToken && !user?.telegramId && (
                        <Box my={2}>
                            <Typography>Your Telegram Linking Token:</Typography>
                            <Typography sx={{ fontFamily: 'monospace', bgcolor: 'grey.200', p: 1, borderRadius: 1 }}>
                                {telegramToken}
                            </Typography>
                            <Typography variant="caption">
                                To link your account, follow these steps:
                                <ol>
                                    <li>Open Telegram and search for the bot: <strong><a href="https://t.me/manhwa_notification_bot" target="_blank" rel="noopener noreferrer">@manhwa_notification_bot</a></strong></li>
                                    <li>Start a chat with the bot.</li>
                                    <li>Send the following command to the bot: <code>/start {telegramToken}</code></li>
                                    <li>You will receive a confirmation message from the bot once your account is linked.</li>
                                </ol>
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleGenerateToken}
                            disabled={loading || !!user?.telegramId}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Get Linking Token'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleResetLinking}
                            disabled={loading || !user?.telegramId}
                        >
                            Reset Linking
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbar.message}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
    </Box>
  );
};

export default ProfilePage;
