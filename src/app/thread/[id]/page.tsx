"use client";

import { BASE_API_URL } from '@/app/layout'
import theme from '@/app/theme';
import ThreadOpenView from '@/components/thradOpenView';
import PaginatedResponse from '@/interfaces/paginatedResponse';
import { ThreadViewResponse } from '@/interfaces/thread';
import { customFetch, generalFetch } from '@/utils/customFetch'
import { CircularProgress, Container, useTheme } from '@mui/material'
import { Params } from 'next/dist/server/request/params'
import React, { Suspense, use } from 'react'
import useSWR from 'swr'

const page = ({ params }: { params: Promise<Params>}) => {
  const threadID = use(params).id;
  const { data, error, isLoading } = useSWR<ThreadViewResponse>(`${BASE_API_URL}/threads/${threadID}`, generalFetch());
  const theme = useTheme();
  
  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    throw new Error(error);
  }

  if (data) {
    return (
      <Container
        sx={{
          height: 'calc(100vh - 96px) !important',
          marginTop: theme.spacing(2)
        }}
      >
        <ThreadOpenView threadViewResponse={data}/>
      </Container>
    )
  }

}

export default page