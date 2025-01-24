'use client';

import { Box, Typography, useTheme } from '@mui/material';

const Error = () => {
  const theme = useTheme();

  return (
    <Box display={'flex'} flexDirection={'column'} gap={theme.spacing(1)}>
      <Typography variant="h5" color="error">
        An unexpected error has occurred.
      </Typography>
    </Box>
  );
};

export default Error;
