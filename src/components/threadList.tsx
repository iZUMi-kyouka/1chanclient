import { CircularProgress, Container, Typography, useTheme } from '@mui/material';
import React from 'react'
import useSWR from 'swr';
import Sidebar from './sidebar';
import ThreadCard, { ThreadListResponse } from './threadCard';

const fetcher = (url: string) => fetch(url).then(response => response.json())

const ThreadList = ({ category }: { category?: number}) => {
    const theme = useTheme();
    const { data, error, isLoading} = useSWR<ThreadListResponse>(`http://localhost:8080/api/v1/threads/list${category ? `?tag=${category}` : ""}`, fetcher);
    if (isLoading) {
      return <CircularProgress />
    }
  
    if (error) {
      throw new Error(`Failed to fetch threads: ${error}`);
    }
  
    if (data) {
      return (
        <>
          <Container sx={{  
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: theme.spacing(1),
            paddingLeft: '300px !important',
            gap: theme.spacing(1),
            paddingBottom: theme.spacing(8),
          }}>
            {
              data && data.threads 
              ? data.threads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              )) 
              : <div><Typography>No threads are found.</Typography></div>
            }
          </Container>
        </>
      )
    }
}

export default ThreadList;