import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

const CenteredFlexBox = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'flex-start'}
    >
      {children}
    </Box>
  );
};

export default CenteredFlexBox;
