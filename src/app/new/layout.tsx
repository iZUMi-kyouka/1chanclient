'use client';

import { Container, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'
import '@mdxeditor/editor/style.css'

const layout = ({ children }: { children: ReactNode}) => {
  const theme = useTheme();

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      {children}
    </Container>
  )
}

export default layout