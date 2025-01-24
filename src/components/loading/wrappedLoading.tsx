import { CircularProgress, Container } from '@mui/material';
import { forwardRef } from 'react';

/**
 * A loading screen wrapped in a flexbox that takes up all available space and centralise the spinner
 * @returns {ReactNode}
 */
const WrappedLoading = forwardRef<HTMLElement, React.ComponentProps<typeof CircularProgress>>((props, ref) => {
  return (
    <Container
      ref={ref}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
      }} // Pass down any additional props
    >
      <CircularProgress
        {...props}
      />
    </Container>
  );
});

WrappedLoading.displayName = 'WrappedLoading';

export default WrappedLoading;