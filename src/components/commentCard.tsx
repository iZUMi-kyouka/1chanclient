import Comment from '@/interfaces/comment';
import { MoreVertSharp } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, CardHeader, Container, IconButton, Typography, useTheme } from '@mui/material';
import MuiMarkdown from 'mui-markdown';
import React from 'react'



const CommentCard = ({ comment }: { comment: Comment}) => {
  const theme = useTheme();

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
              {comment.username[0].toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton color='inherit'>
              <MoreVertSharp sx={{ fontSize: theme.typography.pxToRem(20)}}/>
            </IconButton>
          }
          subheader={<Typography>@{comment.username} on {comment.creation_date}</Typography>}
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
            <MuiMarkdown>
              {comment.comment}
            </MuiMarkdown>
          </Container>
        </CardContent>
    </Card>
  )
}

export default CommentCard;