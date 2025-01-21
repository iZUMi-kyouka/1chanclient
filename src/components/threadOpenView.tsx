import { ThreadViewResponse } from '@/interfaces/thread';
import { Box, Button, Chip, Container, Divider, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useRef, useState } from 'react'
import ThreadCard from './threadCard';
import CommentCard from './commentCard';
import Comment from '@/interfaces/comment';
import ThreadCardWithCommentInput from './threadCardWithComentInput';
import { AddCommentSharp, CommentSharp } from '@mui/icons-material';
import CommentCardEdit from './commentCardEdit';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { customFetch } from '@/utils/customFetch';
import { BASE_API_URL } from '@/app/layout';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '@/store/auth/authSlice';

const ThreadOpenView = ({ threadViewResponse }: { threadViewResponse: ThreadViewResponse}) => {
  const theme = useTheme();
  const accessToken = useSelector(selectAccessToken);
  const [commentOpen, setCommentOpen] = useState(false);
  const handleCommentSubmit = async (markdown: string) => {
    try {
      const response = await customFetch(`${BASE_API_URL}/comments/new/${threadViewResponse.thread.id}`, {
        method: 'POST',
        body: JSON.stringify({
          comment: markdown
        })
      });
      if (response.status === 201) {
        alert('Comment posted.');
        setCommentOpen(false);
      } else {
        throw new Error('failed to post comment')
      }
    } catch (err: any) {
      alert(err);
    }
  };

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
        // padding: '0 !important',
        [theme.breakpoints.down('lg')]: {
          padding: 0,
          paddingBottom: theme.spacing(2)
        },
        height: '100%',
        width: '100%',
        overflowY: 'auto'
      }}
    >
      <Box display='flex' justifyContent='center' sx={{padding: '0 !important', width: '85ch', [theme.breakpoints.down('lg')]: {
          width: '100%'
        }}}>
        <ThreadCard disableOnClick={true} thread={threadViewResponse.thread}/>
      </Box>

      <Container
        sx={{padding: '0 !important', width: '85ch', [theme.breakpoints.down('lg')]: {
          width: '100%'
        }}}
      >
        { commentOpen
          ? <CommentCardEdit onCancel={() => { setCommentOpen(false)}} onSubmit={handleCommentSubmit} />
          : <Tooltip title={`${accessToken === '' ? 'You must be logged in to post a comment.': ''}`}>
            <span>
            <Button
              variant='contained'
              onClick={() => setCommentOpen(true)}
              startIcon={<AddCommentSharp />}
              size='large'
              disabled={accessToken === ''}
              sx={{
                '&.Mui-disabled': {
                  cursor: 'not-allowed',
                  pointerEvents: 'auto'
                }}}
          >Add a comment</Button>
            </span>

          </Tooltip>
        }

      </Container>
      <Container
        sx={{
          marginTop: theme.spacing(1),
          marginBottom: theme.spacing(1)
        }}
      >
        <Divider>
          <Chip label="Comments"></Chip>
        </Divider>
      </Container>
      {
        threadViewResponse.comments.response
        ? (<Box display='flex' flexDirection='column' alignItems={'center'} gap={theme.spacing(1)} width={'100%'}>{
          threadViewResponse.comments.response.map(comment => {
          return (
            <CommentCard key={comment.id} comment={comment}/>
          )})}</Box>)
        : <Container
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
            <Typography>No comments yet.</Typography>
          </Container>
      }
    </Container>
  )
}

export default ThreadOpenView;