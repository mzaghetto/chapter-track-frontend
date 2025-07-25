import React, { useState } from 'react';
import { Box, Typography, Button, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { generateTelegramLinkingToken, resetTelegramLinking, updateTelegramNotificationStatus } from '../services/notification';

interface TelegramIntegrationProps {
  onShowSnackbar: (message: string) => void;
}

const TelegramIntegration: React.FC<TelegramIntegrationProps> = ({ onShowSnackbar }) => {
  const { user, token, refreshUserProfile } = useAuth();
  const [telegramToken, setTelegramToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateToken = async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await generateTelegramLinkingToken(token);
        setTelegramToken(response.data.telegramLinkingToken);
        onShowSnackbar('Token generated successfully!');
        refreshUserProfile();
      } catch (error) {
        console.error('Failed to generate token', error);
        onShowSnackbar('Failed to generate token.');
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
        refreshUserProfile();
        onShowSnackbar('Telegram linking reset successfully!');
      } catch (error) {
        console.error('Failed to reset linking', error);
        onShowSnackbar('Failed to reset linking.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTelegramNotificationToggle = async (isEnabled: boolean) => {
    if (token) {
      try {
        await updateTelegramNotificationStatus(token, isEnabled);
        refreshUserProfile();
        onShowSnackbar(`Telegram notifications ${isEnabled ? 'enabled' : 'disabled'}`);
      } catch (error: any) {
        console.error('Failed to update notification status', error);
        let errorMessage = 'Failed to update notification status.';
        if (error.response && error.response.data && error.response.data.message === 'Telegram ID is required when the user hasn\'t registered one.') {
          errorMessage = 'Please link your Telegram account first to enable notifications.';
        }
        onShowSnackbar(errorMessage);
      }
    }
  };

  return (
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
  );
};

export default TelegramIntegration;
