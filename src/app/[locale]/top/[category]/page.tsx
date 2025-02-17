'use client';

import { postCategoriesDict } from '@/app/[locale]/categories';
import InfiniteScrollLoading from '@/components/loading/infiniteScrollLoading';
import WrappedLoading from '@/components/loading/wrappedLoading';
import ThreadList, { ThreadListResponse } from '@/components/thread/threadList';
import ThreadListFilterDropdown from '@/components/thread/threadListFilterDialog';
import ColFlexBox from '@/components/wrapper/colFlexContainer';
import RowFlexBox from '@/components/wrapper/rowFlexContainer';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { generalFetch } from '@/utils/customFetch';
import { makeQueriedThreadListURL } from '@/utils/makeUrl';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { Params } from 'next/dist/server/request/params';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { useInView } from 'react-intersection-observer';
import useSWRInfinite from 'swr/infinite';

const Page = ({ params }: { params: Promise<Params> }) => {
  const theme = useTheme();

  const listParams = useSearchParams();
  const sortParam = listParams.get('sort_by');
  const sortDir = listParams.get('order');

  let categoryId: number | undefined;
  const categoryIdStr = use(params).category;

  if (categoryIdStr !== undefined && typeof categoryIdStr === 'string') {
    categoryId = parseInt(categoryIdStr);
  } else {
    categoryId = undefined;
  }

  const getKey = (pageIndex: number, previousPageData: ThreadListResponse) => {
    if (
      previousPageData &&
      previousPageData.pagination.current_page ===
        previousPageData.pagination.last_page
    ) {
      return null;
    }

    return makeQueriedThreadListURL({
      apiPath: '/threads/search',
      sortDir: sortDir || undefined,
      sortParam: sortParam || undefined,
      pageIndex: pageIndex + 1,
      tags: categoryId !== undefined ? [categoryId] : undefined,
    });
  };

  const { ref, inView } = useInView({ threshold: 1 });
  const { data, error, isLoading, size, setSize, mutate } =
    useSWRInfinite<ThreadListResponse>(getKey, generalFetch());

  useInfiniteScroll(size, setSize, inView);

  if (
    categoryId === undefined ||
    postCategoriesDict[categoryId] === undefined
  ) {
    return (
      <ColFlexBox>
        <Typography>Invalid category.</Typography>
      </ColFlexBox>
    );
  }

  const handleRefresh = () => mutate(undefined);
  const threads: ThreadListResponse[] = [];
  data?.forEach((threadViewResponse) => threads.push(threadViewResponse));

  return (
    <>
      {error && (
        <ColFlexBox>
          <title>{`1chan | Thread`}</title>
          <Typography>Failed to fetch the list of threads.</Typography>
          <Typography>Please refresh the page.</Typography>
        </ColFlexBox>
      )}

      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={theme.spacing(2)}
        width={'925px'}
        paddingTop={theme.spacing(2)}
        
        sx={{
          [theme.breakpoints.down('lg')]: {
            width: '100%',
          },
        }}
      >
        <Container
          sx={{
            margin: '0 !important',
            padding: '0 !important',
            width: '100%',
          }}
        >
          <RowFlexBox
            sx={{
              pt: theme.spacing(2),
              pb: theme.spacing(2),
              gap: theme.spacing(3),
            }}
          >
            <Box
              sx={{
                '& .MuiSvgIcon-root': {
                  width: '75px',
                  height: '75px',
                },
              }}
            >
              {postCategoriesDict[categoryId || 0].icon}
            </Box>
            <Typography variant="h3">
              {postCategoriesDict[categoryId || 0].displayName}
            </Typography>
          </RowFlexBox>
        </Container>

        <Box
          display={'flex'}
          gap={theme.spacing(1)}
          flexGrow={1}
          alignItems={'center'}
          width={'100%'}
        >
          <ThreadListFilterDropdown
            disableTagsFilter
            disabled={isLoading || (threads.length === 0 && threads[0].response === null)}
            disableRelevance
            onRefresh={handleRefresh}
          />
        </Box>

        {data ? (
          <>
            <title>{`1chan | Threads in ${postCategoriesDict[categoryId].displayName}`}</title>
            <ThreadList mutateHook={mutate} threads={threads} />
            <InfiniteScrollLoading
              ref={ref}
              pagination={data[data.length - 1].pagination}
            />
          </>
        ) : (
          isLoading && <WrappedLoading />
        )}
      </Box>
    </>
  );
};

export default Page;
