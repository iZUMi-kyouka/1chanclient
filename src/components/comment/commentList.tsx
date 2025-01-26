import Comment from '@/interfaces/comment';
import PaginatedResponse from '@/interfaces/paginatedResponse';
import { generalFetch } from '@/utils/customFetch';
import { makeQueriedThreadListURL } from '@/utils/makeUrl';
import { Box, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Fetcher } from 'swr';
import useSWRInfinite from 'swr/infinite';
import FullPageSpinner from '../loading/fullPageLoading';
import InfiniteScrollLoading from '../loading/infiniteScrollLoading';
import ThreadListFilterDropdown from '../thread/threadListFilterDialog';
import ColFlexBox from '../wrapper/colFlexContainer';
import RowFlexBox from '../wrapper/rowFlexContainer';
import CommentCard from './commentCard';

const CommentList = ({ threadID }: { threadID: number }) => {
  const theme = useTheme();
  const listParams = useSearchParams();
  const sortParam = listParams.get('sort_by');
  const sortDir = listParams.get('order');

  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<Comment>
  ) => {
    if (
      previousPageData &&
      previousPageData.pagination.current_page ===
        previousPageData.pagination.last_page
    )
      return null;
    return makeQueriedThreadListURL({
      apiPath: `/comments/thread/${threadID}`,
      sortDir: sortDir || undefined,
      sortParam: sortParam || undefined,
      pageIndex: pageIndex + 1,
    });
  };

  const { ref, inView } = useInView({ threshold: 0.2 });
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    getKey,
    generalFetch() as Fetcher<PaginatedResponse<Comment>, string>,
    {
      revalidateFirstPage: false,
    }
  );

  const handleRefresh = () => mutate(undefined);

  useEffect(() => {
    setSize(size + 1);
  }, [inView]);

  const comments: Comment[] = [];
  data?.forEach((commentList) => {
    if (commentList.response) {
      commentList.response.forEach((comment) => {
        comments.push(comment);
      });
    }
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems={'center'}
        gap={theme.spacing(1)}
        width="925px"
        height='100%'
        sx={{
          [theme.breakpoints.down('lg')]: {
            width: '100%',
          },
        }}
      >
        <Box
          display={'flex'}
          gap={theme.spacing(1)}
          flexGrow={1}
          alignItems={'center'}
          alignSelf={'flex-start'}
        >
          <ThreadListFilterDropdown
            disabled={isLoading}
            disableRelevance
            disableViews
            disableMoreFilters
            onRefresh={handleRefresh}
          />
        </Box>

        {error && (
          <RowFlexBox>
            <Typography>
              Failed to fetch comments. Sort parameters may be invalid.
            </Typography>
          </RowFlexBox>
        )}

        {data && data.length > 0 && data[0].response ? (
          <>
            {comments.map((comment) => {
              return (
                <CommentCard
                  mutateHook={mutate}
                  key={Math.random().toString(36).substring(2, 9)}
                  comment={comment}
                />
              );
            })}
            <InfiniteScrollLoading
              disableShrink
              ref={ref}
              pagination={data[data.length - 1].pagination}
            />
          </>
        ) : isLoading ? (
          <FullPageSpinner />
        ) : (
          <ColFlexBox flexGrow={1} height={'100%'}>
            <Typography>No comments yet.</Typography>
          </ColFlexBox>
        )}
      </Box>
    </>
  );
};

export default CommentList;
