'use client';

import FullPageSpinner from '@/components/loading/fullPageLoading';
import ThreadList, { ThreadListResponse } from '@/components/thread/threadList';
import ThreadListFilterDropdown from '@/components/thread/threadListFilterDialog';
import { generalFetch } from '@/utils/customFetch';
import { Box, Container, useTheme } from '@mui/material';
import { Params } from 'next/dist/server/request/params';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import useSWR from 'swr';

const page = ({ params }: { params: Promise<Params> }) => {
  const theme = useTheme();
  const listParams = useSearchParams();
  const sortParam = listParams.get('sort_by');
  const sortDir = listParams.get('order')

  var categoryId: number | undefined;
  const categoryIdStr = use(params).category;
  if (categoryIdStr && typeof(categoryIdStr) === "string") {
    categoryId = parseInt(categoryIdStr)
  } else {
    categoryId = undefined
  }

  const { data, error, isLoading } = useSWR<ThreadListResponse>
    (`http://localhost:8080/api/v1/threads/list?${categoryId ? `tag=${categoryId}` : ""}${sortParam ? `&sort_by=${sortParam}` : ''}${sortDir ? `&order=${sortDir}` : '' }`, generalFetch());
  return (  
    <>
      {
      (() => {
        if (isLoading) {
          return <FullPageSpinner />
        }

        if (error) {
          throw new Error(error);
        }

        if (data) {
          return (
            <Box display='flex' flexDirection='column' gap={theme.spacing(2)}>
              <Container
                sx={{margin: '0 !important', padding: '0 !important'}}
              >
                {
                  data.response ?
                  <ThreadListFilterDropdown />
                  : <></>
                }

              </Container>
              <ThreadList threads={data} />
            </Box>
          )
        }

      })()
    }
    </>
  )
}

export default page;