'use client';

import Sidebar from '@/components/layout/sidebar';
import RowFlexBox from '@/components/wrapper/rowFlexContainer';
import '@mdxeditor/editor/style.css';
import { Container, useTheme } from '@mui/material';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode}) => {
  const theme = useTheme();

  return (
    <RowFlexBox>
      <Sidebar sx={{
        [theme.breakpoints.down(900)]: {
          display: 'none'
        }
      }}/>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2),
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2)
          // justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        {children}
      </Container>
    </RowFlexBox>
  )
}

export default Layout;