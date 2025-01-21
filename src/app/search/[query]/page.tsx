'use client';

import { BASE_API_URL } from '@/app/layout'
import FullPageSpinner from '@/components/fullPageLoading';
import ThreadList from '@/components/threadList'
import ThreadListFilterDropdown from '@/components/threadListFilterDropdown';
import PaginatedResponse from '@/interfaces/paginatedResponse'
import { Thread, ThreadViewResponse } from '@/interfaces/thread'
import { generalFetch } from '@/utils/customFetch'
import { Box, CircularProgress, Container, Typography, useTheme } from '@mui/material'
import { Params } from 'next/dist/server/request/params'
import { useSearchParams } from 'next/navigation';
import React, { use } from 'react'
import useSWR from 'swr'

const page = ({ params }: { params: Promise<Params>}) => {
  const query = use(params).query as string
  const theme = useTheme();
  const searchParams = useSearchParams();

  const { data, error, isLoading } = useSWR<PaginatedResponse<Thread>>(`${BASE_API_URL}/threads/search?q=${query}&${searchParams.toString()}`, generalFetch());

  if (error) {
    throw new Error('failed to fetch search result');
  }

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (data) {
    return (
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={theme.spacing(2)} paddingTop={theme.spacing(2)}>
        <Typography variant='h5'>
          {`Search Result for "${query}"`}
        </Typography>
        <Container
          sx={{margin: '0 !important', padding: '0 !important'}}
        >
          {
            data.response ?
            <ThreadListFilterDropdown />
            : <></>
          }
        </Container>
        <ThreadList threads={data}/>
      </Box>
    )

  }

}

export default page