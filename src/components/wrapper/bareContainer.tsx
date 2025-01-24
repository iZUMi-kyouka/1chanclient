import { Container } from '@mui/material';
import React, { ReactNode } from 'react';

const BareContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Container
      sx={{
        margin: '0 !important',
        padding: '0 !important',
      }}
    >
      {children}
    </Container>
  );
};

export default BareContainer;
