'use client';

import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'

const error = () => {
  const theme = useTheme();

  return (
    <Box display={'flex'} flexDirection={'column'} gap={theme.spacing(1)}>
      <Typography variant='h5' color='error'>An unexpected error has occurred.</Typography>
    </Box>
  )
}

export default error