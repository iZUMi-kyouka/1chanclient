import { Box, CircularProgress } from '@mui/material';

/**
 * Shows a full spage loading spinner centered horizontally and vertically.
 * The container will try to fill up all available space for a better visual.
 * @returns 
 */
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
