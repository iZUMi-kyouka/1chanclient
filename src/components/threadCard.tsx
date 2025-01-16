"use client";

import { MoreVertSharp, ThumbDown, ThumbDownAltSharp, ThumbDownOffAltSharp, ThumbDownOutlined, ThumbDownSharp, ThumbUp, ThumbUpAltSharp, ThumbUpOffAltSharp, ThumbUpOutlined, ThumbUpSharp, VisibilityOffOutlined, VisibilityOutlined, VisibilitySharp } from '@mui/icons-material';
import { alpha, Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, IconButton, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react'
import MuiMarkdown from 'mui-markdown';
import { BASE_API_URL } from '@/app/layout';
import { customFetch } from '@/utils/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { addToDislike, addToLike, removeFromLikeDislike, selectUserLikedThreads } from '@/store/user/userSlice';
import { store } from '@/store/store';
import { useRouter } from 'next/navigation';
import { Thread } from '@/interfaces/thread';
import PaginatedResponse from '@/interfaces/paginatedResponse';

export interface ThreadView {
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

const classes = {
  button: {
    borderRadius: '25px'
  }
}

const ThreadCard = ({ thread, width, disableOnClick }: { thread: ThreadView, width?: string, disableOnClick?: boolean}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const likes = useSelector(selectUserLikedThreads);
  const [likeCount, setLikeCount] = useState(thread.like_count);
  const [dislikeCount, setDislikeCount] = useState(thread.dislike_count);
  const router = useRouter();

  const handleLikeDislike = (likeDislike: number, remove?: boolean) => async (e: React.MouseEvent) => {
    e.stopPropagation();
    var url: string;
    if (likeDislike === 1) {
      url = `${BASE_API_URL}/threads/like/${thread.id}`
    } else {
      url = `${BASE_API_URL}/threads/dislike/${thread.id}` 
    }

    try {
      const response = await customFetch(url, {
        method: 'PUT',
      })

      if (response.ok) {
        console.log('response ok')
        if (remove) {
          if (likeDislike === 1) {
            setLikeCount(likeCount - 1)
          } else {
            setDislikeCount(dislikeCount - 1)
          }
          dispatch(removeFromLikeDislike(thread.id));
        } else {
          if (likeDislike === 1) {
            setLikeCount(likeCount + 1)
            dispatch(addToLike(thread.id));
          } else {
            setDislikeCount(dislikeCount + 1);
            dispatch(addToDislike(thread.id));
          }
        }
      }

    } catch (err: any) {
      console.log(`error: ${err}`);
    }
  }

  const isLiked = likes[thread.id] !== undefined && likes[thread.id] === 1;
  const isDisliked = likes[thread.id] !== undefined && likes[thread.id] === 0;

  return (
    <Card 
      sx={{ 
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
        <Box
          onClick={() => { router.push(`/thread/${thread.id}`)}}
        >
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
            <MuiMarkdown>
              {thread.original_post}
            </MuiMarkdown>
          </CardContent>
        <CardActions disableSpacing>
          {
            !isLiked && !isDisliked
            ? (<>
              {/* <Typography>Not liked or disliked</Typography> */}
              <Button
                onClick={ handleLikeDislike(1)}
                sx={classes.button}
                startIcon={<ThumbUpOutlined />}
              >{likeCount}</Button>
              <Button
                onClick={handleLikeDislike(0)}
                sx={classes.button}
                startIcon={<ThumbDownOutlined />}
              ></Button>
            </>)
            : isDisliked
            ? (<>
              {/* <Typography>Disliked</Typography> */}
              <Button
                onClick={handleLikeDislike(1)}
                sx={classes.button}
                startIcon={<ThumbUpOutlined />}
              >{likeCount}</Button>
              <Button
                onClick={handleLikeDislike(0, true)}
                sx={classes.button}
                startIcon={<ThumbDown />}
              ></Button>
            </>)
            : isLiked
            ? (<>
              {/* <Typography>Liked</Typography> */}
              <Button
                onClick={handleLikeDislike(1, true)}
                sx={classes.button}
                startIcon={<ThumbUp />}
              >{likeCount}</Button>
              <Button
                onClick={handleLikeDislike(0)}
                sx={classes.button}
                startIcon={<ThumbDownOutlined />}
              ></Button>
              </>)
              : <></>
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
        </Box>
    </Card>
  )
}

export default ThreadCard;