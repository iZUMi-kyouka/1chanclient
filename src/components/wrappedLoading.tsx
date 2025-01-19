import { Container, CircularProgress } from '@mui/material'
import React from 'react'

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