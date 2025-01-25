import { Box, useTheme } from '@mui/material';
import { forwardRef } from 'react';

const ColFlexBox = forwardRef<HTMLDivElement, React.ComponentProps<typeof Box>>(
  ({ children, ...props }, ref) => {
    const theme = useTheme();

    return (
      <Box
        ref={ref}
        display={'flex'}
        flexDirection={'column'}
        gap={theme.spacing(2)}
        flexGrow={1}
        justifyContent={'center'}
        alignItems={'center'}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

ColFlexBox.displayName = 'RowFlexBox';

export default ColFlexBox;
