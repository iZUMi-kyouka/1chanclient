import { MoreVertSharp } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Container, IconButton, Typography, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react'
import { ForwardRefEditor } from './forwardRefEditor';
import { useSelector } from 'react-redux';
import { selectUserAccount } from '@/store/user/userSlice';
import '@mdxeditor/editor/style.css';
import { MDXEditorMethods } from '@mdxeditor/editor';
import UserAvatar from './userAvatar';

export interface Comment {
  id: number,
  username: string,
  comment: string,
  creation_date: string,
  updated_date: string,
  like_count: number,
  dislike_count: number
}

const CommentCardEdit = ({ width, onSubmit, onCancel }: { width?: string, onSubmit?: (markdown: string) => void, onCancel?: () => void}) => {
  const theme = useTheme();
  const userAccount = useSelector(selectUserAccount);
  const ref = useRef<MDXEditorMethods>(null);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(ref.current ? ref.current.getMarkdown() : '');
    }
  };

  return (
    <Card
    sx={{
      width: width || '85ch',
      [theme.breakpoints.down('lg')]: {
        width: '100%'
      },
    }}
    >   
        <CardHeader
          avatar={
            <UserAvatar currentUser={true}/>
          }
          subheader={<Typography>@{userAccount.username}</Typography>}
          sx={{
            padding: theme.spacing(2),
            paddingBottom: '0 !important'
          }}
        />
        <CardContent
          sx={{
            '&:last-child': {
              paddingBottom: theme.spacing(2)
            },
            padding: theme.spacing(2),
            paddingTop: theme.spacing(1)
          }}
        >
          <Container sx={{padding: '0 !important', margin: '0 !important'}}>
            <ForwardRefEditor ref={ref} markdown=''/>
          </Container>
        </CardContent>
        <CardActions>
          <Container></Container>
          <Button onClick={() => {
            if (onCancel) { onCancel() }
          }}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </CardActions>
    </Card>
  )
}

export default CommentCardEdit;