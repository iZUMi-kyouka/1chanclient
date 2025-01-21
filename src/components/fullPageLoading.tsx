import { Box, CircularProgress } from '@mui/material';

const FullPageSpinner = () => {
  return (
    <Box
      display={'flex'}
      minHeight={'calc(100vh - 64px)'}
      justifyContent={'center'}
      alignItems={'center'}
      width={'100%'}
      height={'100%'}
    >
      <CircularProgress />
    </Box>
  );
};

export default FullPageSpinner;
