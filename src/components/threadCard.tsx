import { MoreVertSharp, ThumbDownAltSharp, ThumbDownOutlined, ThumbDownSharp, ThumbUpAltSharp, ThumbUpOutlined, ThumbUpSharp, VisibilityOffOutlined, VisibilityOutlined, VisibilitySharp } from '@mui/icons-material';
import { alpha, Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, IconButton, Typography, useTheme } from '@mui/material';
import React from 'react'

interface threadSnippets {
  id: number,
  username: string,
  user_profile_path?: string,
  title: string,
  content: string,
  creation_date: Date,
  updated_date?: Date,
  last_comment_date?: Date,
  like_count: number,
  dislike_count: number,
  view_count: number,
}

const classes = {
  button: {
    borderRadius: '25px'
  }
}

const ThreadCard = ({ thread }: { thread: threadSnippets}) => {
  const theme = useTheme();

  return (
    <Card sx={{ 
      maxWidth: 750,
      '& .MuiCardHeader-title': {
        fontWeight: 400,
        fontSize: '18px'
      },
      '& .MuiAvatar-root': {
        height: '45px',
        width: '45px'
      },
      '& .MuiCardContent-root': {
        padding: theme.spacing(0, 2, 1, 2)
      },
      '& .MuiCardActions-root': {
        padding: theme.spacing(0, 1, 1, 1)
      }
    }}>
      <CardHeader 
        avatar={
          <Avatar>
            {thread.username[0].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton
            color='inherit'
          >
            <MoreVertSharp />
          </IconButton>
        }
        title={thread.title}
        subheader={`by ${thread.username}`}
      />
      <CardContent>
        <Typography variant='body1'>
          {thread.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          sx={classes.button}
          startIcon={<ThumbUpOutlined />}
        >{thread.like_count}</Button>
        <Button
          sx={classes.button}
          startIcon={<ThumbDownOutlined />}
        >{thread.dislike_count}</Button>
        <Box sx={{flexGrow: 1}} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'purple',
            marginRight: 2
          }}
        >
          <VisibilityOutlined 
            sx={{
              marginRight: 1
            }}
          />
          {thread.view_count}
        </Box>
      </CardActions>
    </Card>
  )
}

export default ThreadCard;