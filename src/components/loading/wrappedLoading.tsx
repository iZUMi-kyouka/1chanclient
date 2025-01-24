import { CircularProgress, Container } from '@mui/material';
import { forwardRef } from 'react';

/**
 * Shows a spinner that is wrapped in a container. The container will try to fill up all available horizontal space
 * while centering the spinner for a better visual.
 * @returns {ReactNode}
 */
const WrappedLoading = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CircularProgress>
>((props, ref) => {
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
      <CircularProgress {...props} />
    </Container>
  );
});

WrappedLoading.displayName = 'WrappedLoading';

export default WrappedLoading;
