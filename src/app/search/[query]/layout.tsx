'use client';

import Sidebar from '@/components/sidebar'
import { Box, Container, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  const theme = useTheme();

  return (
    <Box display={'flex'}>
      <Sidebar />
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: theme.spacing(2), minHeight: 'calc(100vh - 96px)'}}>
        {children}
      </Container>
    </Box>
  )
}

export default layout