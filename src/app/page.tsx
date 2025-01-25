'use client';

import RefreshButton from '@/components/button/refreshButton';
import FullPageSpinner from '@/components/loading/fullPageLoading';
import InfiniteScrollLoading from '@/components/loading/infiniteScrollLoading';
import ThreadList from '@/components/thread/threadList';
import ThreadListFilterDropdown from '@/components/thread/threadListFilterDialog';
import RowFlexBox from '@/components/wrapper/rowFlexContainer';
import PaginatedResponse from '@/interfaces/paginatedResponse';
import { Thread } from '@/interfaces/thread';
import { generalFetch } from '@/utils/customFetch';
import { makeQueriedThreadListURL } from '@/utils/makeUrl';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import useSWRInfinite from 'swr/infinite';

export default function Home() {
  const theme = useTheme();

  const listParams = useSearchParams();
  const sortParam = listParams.get('sort_by');
  const sortDir = listParams.get('order');

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
      pageIndex: pageIndex + 1,
    });
  };

  const { ref, inView } = useInView({ threshold: 0.5 });
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    getKey,
    generalFetch(),
    {
      revalidateFirstPage: false,
    }
  );

  useEffect(() => {
    setSize(size + 1);
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
            if (isLoading) {
              return <FullPageSpinner />;
            }

            if (error) {
              return (
                <RowFlexBox>
                  <Typography>
                    Failed to fetch threads. Sort parameters may be invalid.
                  </Typography>
                </RowFlexBox>
              );
            }

            if (data) {
              const threads: PaginatedResponse<Thread>[] = [];
              data.forEach((threadViewResponse) =>
                threads.push(threadViewResponse)
              );

              return (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={theme.spacing(2)}
                  paddingBottom={theme.spacing(4)}
                  sx={{
                    [theme.breakpoints.down('lg')]: {
                      width: '100%',
                    },
                  }}
                >
                  <Container
                    sx={{ margin: '0 !important', padding: '0 !important' }}
                  >
                    {threads.length > 0 && threads[0].response ? (
                      <Box display={'flex'} gap={theme.spacing(1)}>
                        <ThreadListFilterDropdown disableRelevance />
                        <RefreshButton onClick={() => mutate(undefined)} />
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Container>
                  <ThreadList threads={threads} />
                  <InfiniteScrollLoading
                    ref={ref}
                    pagination={data[data.length - 1].pagination}
                  />
                </Box>
              );
            }
          })()}
        </Container>
      {/* </Box> */}
    </>
  );
}
