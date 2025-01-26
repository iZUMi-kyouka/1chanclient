'use client';

import CustomTagChip from '@/components/chip/customTagChip';
import TagChip from '@/components/chip/tagChip';
import InfiniteScrollLoading from '@/components/loading/infiniteScrollLoading';
import WrappedLoading from '@/components/loading/wrappedLoading';
import ThreadList from '@/components/thread/threadList';
import ThreadListFilterDropdown from '@/components/thread/threadListFilterDialog';
import ColFlexBox from '@/components/wrapper/colFlexContainer';
import RowFlexBox from '@/components/wrapper/rowFlexContainer';
import PaginatedResponse from '@/interfaces/paginatedResponse';
import { Thread } from '@/interfaces/thread';
import { generalFetch } from '@/utils/customFetch';
import { makeQueriedThreadListURL } from '@/utils/makeUrl';
import { splitCustomTags, splitTags } from '@/utils/tagsSplitter';
import { Box, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import useSWRInfinite from 'swr/infinite';

const Page = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const sortParam = searchParams.get('sort_by');
  const sortDir = searchParams.get('order');
  const tags = searchParams.get('tags');
  const customTags = searchParams.get('custom_tags');
  const searchQuery = searchParams.get('q');

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
      tags: tags ? splitTags(tags) : undefined,
      customTags: customTags ? splitCustomTags(customTags) : undefined,
      q: searchQuery || undefined,
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
  const handleRefresh = () => mutate(undefined);
  useEffect(() => {
    setSize(size + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const threads: PaginatedResponse<Thread>[] = [];
  data?.forEach((threadViewResponse) => threads.push(threadViewResponse));

  return (
    <>
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
        <title>{`1chan | Search`}</title>

        {/* Header info */}
        <Typography variant="h5">{`${searchQuery ? `Search result for "${searchQuery}"` : 'Search Result'}`}</Typography>
        <RowFlexBox display={customTags ? 'flex' : 'none'}>
          {customTags
            ? splitCustomTags(customTags).map((t, idx) => (
                <CustomTagChip key={idx} customTag={t} />
              ))
            : null}
        </RowFlexBox>
        <RowFlexBox display={customTags ? 'flex' : 'none'}>
          {tags
            ? splitTags(tags).map((t, idx) => <TagChip key={idx} tagID={t} />)
            : null}
        </RowFlexBox>

        {/* Filters */}
      
          <Box
            display={'flex'}
            gap={theme.spacing(1)}
            flexGrow={1}
            alignItems={'center'}
            width={'100%'}
          >
            <ThreadListFilterDropdown
              disabled={isLoading || !(threads.length > 0 && threads[0].response)}
              disableRelevance
              onRefresh={handleRefresh}
            />
          </Box>
    

        {/* Error page */}
        {error && (
          <ColFlexBox>
            <Typography>Failed to fetch search results.</Typography>
            <Typography>Please refresh the page.</Typography>
          </ColFlexBox>
        )}

        {/* Thread list */}
        {data ? (
          <>
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
