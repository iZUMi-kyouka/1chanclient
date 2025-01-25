'use client';

import RefreshButton from '@/components/button/refreshButton';
import CustomTagChip from '@/components/chip/customTagChip';
import TagChip from '@/components/chip/tagChip';
import FullPageSpinner from '@/components/loading/fullPageLoading';
import InfiniteScrollLoading from '@/components/loading/infiniteScrollLoading';
import ThreadList from '@/components/thread/threadList';
import ThreadListFilterDropdown from '@/components/thread/threadListFilterDialog';
import ColFlexBox from '@/components/wrapper/colFlexContainer';
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

  useEffect(() => {
    setSize(size + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (error) {
    return (
      <ColFlexBox>
        <title>{`1chan | Search`}</title>
        <Typography>Failed to fetch search results.</Typography>
        <Typography>Please refresh the page.</Typography>
      </ColFlexBox>
    );
  }

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (data) {
    const threads: PaginatedResponse<Thread>[] = [];
    data.forEach((threadViewResponse) => threads.push(threadViewResponse));

    return (
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={theme.spacing(2)}
        paddingTop={theme.spacing(2)}
        sx={{
          [theme.breakpoints.down('lg')]: {
            width: '100%'
          }
        }}
      >
        <title>{`1chan | Search`}</title>
        <Typography variant="h5">{`${searchQuery ? `Search result for "${searchQuery}"` : 'Search Result'}`}</Typography>
        <RowFlexBox>
          {customTags
            ? splitCustomTags(customTags).map((t, idx) => (
                <CustomTagChip key={idx} customTag={t} />
              ))
            : null}
        </RowFlexBox>
        <RowFlexBox>
          {tags
            ? splitTags(tags).map((t, idx) => <TagChip key={idx} tagID={t} />)
            : null}
        </RowFlexBox>
        <Container sx={{ margin: '0 !important', padding: '0 !important' }}>
          {threads.length > 0 && threads[0].response ? (
            <Box display={'flex'} gap={theme.spacing(1)}>
              <ThreadListFilterDropdown />
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
};

export default Page;
