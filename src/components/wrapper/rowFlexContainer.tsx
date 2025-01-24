import { Box, useTheme } from '@mui/material';
import { forwardRef, ReactNode } from 'react';

interface RowFlexBoxProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow forwarding of any additional props
}

const RowFlexBox = forwardRef<HTMLDivElement, RowFlexBoxProps>(
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
