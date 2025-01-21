import { CircularProgress, Container } from '@mui/material'

/**
 * A loading screen wrapped in a flexbox that takes up all available space and centralise the spinner
 * @returns {ReactNode}
 */
const WrappedLoading = () => {
  return (
    <Container
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1
    }}
  >
    <CircularProgress />
  </Container>
  )
}

export default WrappedLoading