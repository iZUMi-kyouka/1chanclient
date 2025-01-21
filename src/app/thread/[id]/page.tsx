"use client";

import { BASE_API_URL } from '@/app/layout'
import theme from '@/app/theme';
import FullPageSpinner from '@/components/fullPageLoading';
import ThreadOpenView from '@/components/threadOpenView';
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
    return <FullPageSpinner />;
  }

  if (error) {
    throw new Error(error);
  }

  if (data) {
    return (
        <ThreadOpenView threadViewResponse={data}/>
    )
  }

}

export default page