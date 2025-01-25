import { Box, useTheme } from '@mui/material';
import { forwardRef } from 'react';

const RowFlexBox = forwardRef<HTMLDivElement, React.ComponentProps<typeof Box>>(
  ({ children, ...props }, ref) => {
    const theme = useTheme();

    return (
      <Box
        ref={ref}
        display="flex"
        gap={theme.spacing(1)}
        alignItems="center"
        {...props}
      >
        {children}
      </Box>
    );
  }
);

RowFlexBox.displayName = 'RowFlexBox';

export default RowFlexBox;
