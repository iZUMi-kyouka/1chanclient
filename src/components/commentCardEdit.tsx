import { MoreVertSharp } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Container, IconButton, Typography, useTheme } from '@mui/material';
import React from 'react'
import { ForwardRefEditor } from './forwardRefEditor';
import { useSelector } from 'react-redux';
import { selectUserAccount } from '@/store/user/userSlice';

export interface Comment {
  id: number,
  username: string,
  comment: string,
  creation_date: string,
  updated_date: string,
  like_count: number,
  dislike_count: number
}

const CommentCardEdit = ({ onSubmit, onCancel }: { onSubmit?: () => void, onCancel?: () => void}) => {
  const theme = useTheme();
  const userAccount = useSelector(selectUserAccount);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Card
      sx={{
        width: '60ch'
      }}
    >   
        <CardHeader
          avatar={
            <Avatar
              sx={{width: '32px', height: '32px', fontSize: theme.typography.pxToRem(15)}}
            >
              {userAccount.username === undefined ? '' : (userAccount.username as string)[0].toUpperCase()}
            </Avatar>
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
            <ForwardRefEditor disableImage={true} markdown=''/>
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