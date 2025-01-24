import { Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';

const ColFlexBox = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={theme.spacing(2)}
      flexGrow={1}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {children}
    </Box>
  );
};

export default ColFlexBox;
