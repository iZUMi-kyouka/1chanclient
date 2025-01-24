'use client';

import Sidebar from '@/components/layout/sidebar';
import { Box, Container, useTheme } from '@mui/material';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ display: 'flex', overflow: 'hidden' }}>
        <Sidebar />
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: theme.spacing(2),
            minHeight: 'calc(100vh - 96px)',
          }}
        >
          {children}
        </Container>
      </Box>
    </>
  );
};

export default Layout;
