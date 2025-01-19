import { CircularProgress, Container, Typography, useTheme } from '@mui/material';
import React from 'react'
import useSWR from 'swr';
import Sidebar from './sidebar';
import PaginatedResponse from '@/interfaces/paginatedResponse';
import ThreadCard from './threadCard';
import { Thread } from '@/interfaces/thread';

export type ThreadListResponse = PaginatedResponse<Thread>

const fetcher = (url: string) => fetch(url).then(response => response.json())

const ThreadList = ({ threads }: { threads: ThreadListResponse}) => {
    const theme = useTheme();
  
    return (
      <>
        <Container sx={{  
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing(1),
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
          paddingTop: '0 !important',
          paddingBottom: theme.spacing(4),
        }}>
          {
            threads.response  
            ? threads.response.map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            )) 
            : <div><Typography>No threads are found.</Typography></div>
          }
        </Container>
      </>
    )
}

export default ThreadList;