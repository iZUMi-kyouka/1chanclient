import PaginatedResponse from '@/interfaces/paginatedResponse';
import { Thread } from '@/interfaces/thread';
import {
  selectAlwaysShowCustomTags,
  selectAlwaysShowTags,
} from '@/store/appState/appStateSlice';
import { Container, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { SWRInfiniteKeyedMutator } from 'swr/infinite';
import ColFlexBox from '../wrapper/colFlexContainer';
import ThreadCard from './threadCard';

export type ThreadListResponse = PaginatedResponse<Thread>;

const ThreadList = ({
  threads,
  mutateHook,
}: {
  threads: ThreadListResponse[];
  mutateHook?: SWRInfiniteKeyedMutator<ThreadListResponse[]>;
}) => {
  const theme = useTheme();
  const showTags = useSelector(selectAlwaysShowTags);
  const showCustomTags = useSelector(selectAlwaysShowCustomTags);

  const responses: Thread[] = [];
  if (threads.length !== 0) {
    threads.forEach((threadsObj) =>
      threadsObj.response
        ? threadsObj.response.forEach((r) => responses.push(r))
        : null
    );
  }

  return (
    <>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing(1),
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
          paddingTop: '0 !important',
          paddingBottom: theme.spacing(4),
        }}
      >
        {responses.length > 0 ? (
          responses.map((thread) => (
            <ThreadCard
              showTags={showTags}
              showCustomTags={showCustomTags}
              mutateHook={mutateHook}
              key={'_' + Math.random().toString(36).substring(2, 9)}
              thread={thread}
            />
          ))
        ) : (
          <ColFlexBox>
            <Typography>No threads are found.</Typography>
          </ColFlexBox>
        )}
      </Container>
    </>
  );
};

export default ThreadList;
