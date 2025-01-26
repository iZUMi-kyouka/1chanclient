import { BASE_API_URL } from '@/app/[locale]/layout';
import { ThreadViewResponse } from '@/interfaces/thread';
import { selectAccessToken } from '@/store/auth/authSlice';
import { addToWrittenComments } from '@/store/user/userSlice';
import { customFetch } from '@/utils/customFetch';
import { AddCommentSharp } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommentCardEdit from '../comment/commentCardEdit';
import CommentList from '../comment/commentList';
import ColFlexBox from '../wrapper/colFlexContainer';
import ThreadCard from './threadCard';

const ThreadOpenView = ({
  threadViewResponse,
}: {
  threadViewResponse: ThreadViewResponse;
}) => {
  const theme = useTheme();
  const accessToken = useSelector(selectAccessToken);
  const [commentOpen, setCommentOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpenComment = () => {
    setCommentOpen(true);
  };

  const handleCommentSubmit = async (markdown: string) => {
    if (markdown === '') {
      alert('Posting empty comment is not allowed.');
      return;
    }

    try {
      const response = await customFetch(
        `${BASE_API_URL}/comments/new/${threadViewResponse.thread.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            comment: markdown,
          }),
        }
      );

      if (response.status === 201) {
        dispatch(addToWrittenComments((await response.json()).id));
        alert('Comment posted successfully.');
        setCommentOpen(false);
      } else {
        throw new Error('failed to post comment');
      }
    } catch (err) {
      alert(`error: ${err}`);
    }
  };

  if (!threadViewResponse.thread) {
    return (
      <ColFlexBox>
        <Typography>This thread is missing or has been deleted.</Typography>
        <Typography>Please refresh the page.</Typography>
      </ColFlexBox>
    );
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
        [theme.breakpoints.down('lg')]: {
          padding: 0,
          paddingBottom: theme.spacing(2),
        },
        height: '100%',
        width: '100%',
        overflowY: 'auto',
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          padding: '0 !important',
          width: '925px',
          [theme.breakpoints.down('lg')]: {
            width: '100%',
          },
        }}
      >
        <ThreadCard
          showCustomTags={true}
          showTags={true}
          disableOnClick={true}
          thread={threadViewResponse.thread}
        />
      </Box>

      <Container
        sx={{
          padding: '0 !important',
          width: '925px',
          [theme.breakpoints.down('lg')]: {
            width: '100%',
          },
        }}
      >
        {commentOpen ? (
          <CommentCardEdit
            onCancel={() => {
              setCommentOpen(false);
            }}
            onSubmit={handleCommentSubmit}
          />
        ) : (
          <Tooltip
            title={`${accessToken === '' ? 'You must be logged in to post a comment.' : ''}`}
          >
            <span>
              <Button
                variant="contained"
                onClick={handleOpenComment}
                startIcon={<AddCommentSharp />}
                size="large"
                disabled={accessToken === ''}
                sx={{
                  '&.Mui-disabled': {
                    cursor: 'not-allowed',
                    pointerEvents: 'auto',
                  },
                }}
              >
                Add a comment
              </Button>
            </span>
          </Tooltip>
        )}
      </Container>
      <Container
        sx={{
          marginTop: theme.spacing(1),
          marginBottom: theme.spacing(1),
        }}
      >
        <Divider>
          <Chip label="Comments"></Chip>
        </Divider>
      </Container>
      <CommentList threadID={threadViewResponse.thread.id} />
    </Container>
  );
};

export default ThreadOpenView;
