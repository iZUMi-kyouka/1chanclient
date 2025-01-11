import { MoreVertSharp, ThumbDownAltSharp, ThumbDownOutlined, ThumbDownSharp, ThumbUpAltSharp, ThumbUpOutlined, ThumbUpSharp, VisibilityOffOutlined, VisibilityOutlined, VisibilitySharp } from '@mui/icons-material';
import { alpha, Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, IconButton, Typography, useTheme } from '@mui/material';
import React from 'react'

export interface ThreadSnippet {
  id: number,
  username: string,
  user_profile_path?: string,
  title: string,
  original_post: string,
  creation_date: Date,
  updated_date?: Date,
  last_comment_date?: Date,
  like_count: number,
  dislike_count: number,
  likeStatus?: number,
  view_count: number,
}

export interface Pagination {
  current_page: number,
  last_page: number,
  page_size: number
}

export interface ThreadListResponse {
  threads: ThreadSnippet[],
  pagination: Pagination
}

const classes = {
  button: {
    borderRadius: '25px'
  }
}

const ThreadCard = ({ thread, width }: { thread: ThreadSnippet, width?: string}) => {
  const theme = useTheme();

  const handleLikeDislike = async (likeDislike: number) => {
    if (likeDislike === 1) {
      try {
        const request = fetch(`http://localhost:8080/api/v1/threads/like/${thread.id}`, {
          method: 'POST',
        });
        
        const response = await request;
        if (response.ok) {

        }

      } catch (err: any) {
        console.log(`Error handling like and dislike: ${err}`)
      }
    }
  }

  return (
    <Card sx={{ 
      width: width || '85ch',
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
          {thread.original_post}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {
          thread.likeStatus === undefined
          ? (<>
            <Button
              sx={classes.button}
              startIcon={<ThumbUpOutlined />}
            >{thread.like_count}</Button>
            <Button
              sx={classes.button}
              startIcon={<ThumbDownOutlined />}
            >{thread.dislike_count}</Button>
          </>)
          : thread.likeStatus === 0
          ? (<>
            <Button
              sx={classes.button}
              startIcon={<ThumbUpOutlined />}
            >{thread.like_count}</Button>
            <Button
              sx={classes.button}
              startIcon={<ThumbDownSharp />}
            >{thread.dislike_count}</Button>
          </>)
          : (<>
            <Button
              sx={classes.button}
              startIcon={<ThumbUpSharp />}
            >{thread.like_count}</Button>
            <Button
              sx={classes.button}
              startIcon={<ThumbDownOutlined />}
            >{thread.dislike_count}</Button>
            </>)
        }
        <Box sx={{flexGrow: 1}} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
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