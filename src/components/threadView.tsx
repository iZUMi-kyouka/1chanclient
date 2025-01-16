import { Container, useTheme } from '@mui/material'
import React from 'react'

const threadView = () => {
  const theme = useTheme();

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: theme.spacing(1),
        gap: theme.spacing(1),
        paddingBottom: theme.spacing(8),
      }}
    >
      
    </Container>
  )
}

export default threadView