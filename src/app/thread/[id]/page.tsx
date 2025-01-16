"use client";

import { BASE_API_URL } from '@/app/layout'
import ThreadCard, { ThreadView } from '@/components/threadCard'
import { customFetch, generalFetch } from '@/utils/customFetch'
import { CircularProgress, Container } from '@mui/material'
import { Params } from 'next/dist/server/request/params'
import React, { Suspense, use } from 'react'
import useSWR from 'swr'

interface Pagination {
  current_page: number,
  last_page: number,
  page_size: number
}

interface Comment {
  id: number,
  thread_id: number,
  user_id: number,
  comment: string,
  creation_date: string,
  updated_date: string,
  like_count: number,
  dislike_count: number
}

interface PaginatedResponse<T> {
  response: T[],
  pagination: Pagination
}

interface ThreadViewResponse {
  thread: ThreadView,
  comments: PaginatedResponse<Comment>
}

const page = ({ params }: { params: Promise<Params>}) => {
  const threadID = use(params).id;
  const { data, error, isLoading } = useSWR<ThreadViewResponse>(`${BASE_API_URL}/threads/${threadID}`, generalFetch());
  
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
          marginLeft: '300px'
        }}
      >
        <ThreadCard thread={data.thread} />
      </Container>
    )
  }

}

export default page