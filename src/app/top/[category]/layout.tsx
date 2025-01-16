import Sidebar from '@/components/sidebar'
import { Container } from '@mui/material'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode}) => {
  return (
    <>
      <Sidebar />
      <Container sx={{paddingLeft: '300px !important',}}>
        {children}
      </Container>
    </>
  )
}

export default layout