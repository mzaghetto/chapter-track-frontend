import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/auth';

interface UserInformationProps {
  onShowSnackbar: (message: string) => void;
}

const UserInformation: React.FC<UserInformationProps> = ({ onShowSnackbar }) => {
  const { user, token, refreshUserProfile, displayUsernameInHeader, setDisplayUsernameInHeader } = useAuth();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user?.username]);

  const handleSaveUsername = async () => {
    if (token && user) {
      setLoading(true);
      try {
        await updateProfile(token, { username });
        await refreshUserProfile();
        onShowSnackbar('Username updated successfully!');
        setIsEditingUsername(false);
      } catch (error) {
        console.error('Failed to update username', error);
        onShowSnackbar('Failed to update username.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">User Information</Typography>
      <Typography sx={{ mr: 2 }}>Welcome, {displayUsernameInHeader ? user?.username : user?.name}!</Typography>
      <Typography><strong>Email:</strong> {user?.email}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography><strong>Username:</strong></Typography>
        {isEditingUsername ? (
          <TextField
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ ml: 1 }}
          />
        ) : (
          <Typography sx={{ ml: 1 }}>{user?.username}</Typography>
        )}
        {isEditingUsername ? (
          <Button
            variant="outlined"
            size="small"
            sx={{ ml: 2 }}
            onClick={handleSaveUsername}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            sx={{ ml: 2 }}
            onClick={() => setIsEditingUsername(true)}
          >
            Edit
          </Button>
        )}
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={displayUsernameInHeader}
            onChange={(e) => setDisplayUsernameInHeader(e.target.checked)}
          />
        }
        label="Show username in header instead of name"
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default UserInformation;
