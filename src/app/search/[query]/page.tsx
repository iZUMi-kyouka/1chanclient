import { Container, Typography } from '@mui/material'
import { Params } from 'next/dist/server/request/params'
import React, { use } from 'react'

const page = ({ params }: { params: Promise<Params>}) => {
  const query = use(params).query as string

  const { data, err, isLoading } = 

  return (
    <Container>
      <Typography variant='h5'>
        `Search result for: ${query}`
      </Typography>

    </Container>
  )
}

export default page