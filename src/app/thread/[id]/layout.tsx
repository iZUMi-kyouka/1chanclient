'use client';

import Sidebar from '@/components/sidebar'
import { Box, Container, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode}) => {
  
  return (
    <>
    <Box sx={{ display: 'flex', overflow: 'hidden'}}>
      <Sidebar />
      {children}
    </Box>
    </>
  )
}

export default layout