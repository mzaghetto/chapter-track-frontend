
import React from 'react';
import { Card, CardContent, CardActions, Skeleton, Box } from '@mui/material';

const ManhwaCardSkeleton = () => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={250} />
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={80} sx={{ ml: 1 }} />
        </Box>
        <Box>
          <Skeleton variant="circular" width={32} height={32} sx={{ ml: 1 }} />
          <Skeleton variant="circular" width={32} height={32} sx={{ ml: 1 }} />
        </Box>
      </CardActions>
    </Card>
  );
};

export default ManhwaCardSkeleton;
