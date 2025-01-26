'use client';

import InfiniteScrollLoading from '@/components/loading/infiniteScrollLoading';
import WrappedLoading from '@/components/loading/wrappedLoading';
import ThreadList, { ThreadListResponse } from '@/components/thread/threadList';
import ThreadListFilterDropdown from '@/components/thread/threadListFilterDialog';
import RowFlexBox from '@/components/wrapper/rowFlexContainer';
import PaginatedResponse from '@/interfaces/paginatedResponse';
import { Thread } from '@/interfaces/thread';
import { generalFetch } from '@/utils/customFetch';
import { makeQueriedThreadListURL } from '@/utils/makeUrl';
import { splitCustomTags, splitTags } from '@/utils/tagsSplitter';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Fetcher } from 'swr';
import useSWRInfinite from 'swr/infinite';

export default function Home() {
  const theme = useTheme();
  const listParams = useSearchParams();
  const sortParam = listParams.get('sort_by');
  const sortDir = listParams.get('order');
  const tags = listParams.get('tags');
  const customTags = listParams.get('custom_tags');

  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<Thread>
  ) => {
    if (
      previousPageData &&
      previousPageData.pagination.current_page ===
        previousPageData.pagination.last_page
    )
      return null;
    return makeQueriedThreadListURL({
      apiPath: '/threads/search',
      sortDir: sortDir || undefined,
      sortParam: sortParam || undefined,
      customTags: customTags !==  null ? splitCustomTags(customTags) : undefined,
      tags: tags !== null ? splitTags(tags) : undefined,
      pageIndex: pageIndex + 1,
    });
  };

  const { ref, inView } = useInView({ threshold: 0.2 });
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    getKey,
    generalFetch() as Fetcher<ThreadListResponse, string>,
    {
      revalidateFirstPage: false,
    }
  );
  
  const handleRefresh = () => mutate(undefined);

  useEffect(() => {
    setSize(size + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      {/* <Box sx={{ display: 'flex' }}> */}
        {/* <Sidebar /> */}
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            paddingTop: theme.spacing(2),
            minHeight: 'calc(100vh - 96px)',
          }}
        >
          {(() => {
              const threads: PaginatedResponse<Thread>[] = [];
              data?.forEach((threadViewResponse) =>
                threads.push(threadViewResponse)
              );

              return (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={theme.spacing(2)}
                  paddingBottom={theme.spacing(4)}
                  width={'925px'}
                  sx={{
                    [theme.breakpoints.down('lg')]: {
                      width: '100%',
                    },
                  }}
                >
                    <Box display={'flex'} gap={theme.spacing(1)} flexGrow={1} alignItems={'center'}>
                      <ThreadListFilterDropdown disabled={isLoading} disableRelevance onRefresh={handleRefresh} />
                    </Box>
                  {error && (
                    <RowFlexBox>
                      <Typography>
                        Failed to fetch threads. Sort parameters may be invalid.
                      </Typography>
                    </RowFlexBox>
                  )}

                  {data ? (
                    <>
                      <ThreadList mutateHook={mutate} threads={data} />
                      <InfiniteScrollLoading
                        ref={ref}
                        pagination={data[data.length - 1].pagination}
                      />
                    </>
                  ) : (
                    isLoading && <WrappedLoading />
                  )}
                </Box>
              );
          })()}
        </Container>
      {/* </Box> */}
    </>
  );
}
