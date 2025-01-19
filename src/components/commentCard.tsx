'use client';

import Comment from '@/interfaces/comment';
import { MoreVertSharp } from '@mui/icons-material';
import { Avatar, Badge, Box, Card, CardActions, CardContent, CardHeader, Container, IconButton, Menu, MenuItem, styled, Typography, useTheme } from '@mui/material';
import MuiMarkdown, { getOverrides } from 'mui-markdown';
import React, { useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LikeDislikeButton from './likeDislikeButton';
import { useDispatch, useSelector } from 'react-redux';
import { addToCommentDislike, addToCommentLike, removeFromCommentLikeDislike, selectUserLikedComments } from '@/store/user/userSlice';
import { BASE_API_URL } from '@/app/layout';
import { customFetch } from '@/utils/customFetch';


const CommentCard = ({ width, comment }: { width?: string, comment: Comment}) => {
  const theme = useTheme();
  const creation_date = new Date(comment.creation_date);
  const router = useRouter();
  const likes = useSelector(selectUserLikedComments)
  const isLiked = likes[comment.id] === 1;
  const isDisliked = likes[comment.id] === 0;
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [dislikeCount, setDislikeCount] = useState(comment.dislike_count);
  const [reportAnchorEl, setReportAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  
  const handleLikeClick = () => {
    if (!isDisliked && !isLiked) {
      handleLikeDislike(1);
    } else if (isLiked) {
      handleLikeDislike(1, true);
    } else {
      handleLikeDislike(1);
    }
  };

  const handleDislikeClick = () => {
    if (!isDisliked && !isLiked) {
      handleLikeDislike(0);
    } else if (isDisliked) {
      handleLikeDislike(0, true);
    } else {
      handleLikeDislike(0);
    }
  };

    const handleLikeDislike = async (likeDislike: number, remove?: boolean) => {
      var url: string;
      if (likeDislike === 1) {
        url = `${BASE_API_URL}/comments/like/${comment.id}`
      } else {
        url = `${BASE_API_URL}/comments/dislike/${comment.id}` 
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
            dispatch(removeFromCommentLikeDislike(comment.id));
          } else {
            if (likeDislike === 1) {
              setLikeCount(likeCount + 1);
              if (isDisliked) { setDislikeCount(dislikeCount - 1)}
              dispatch(addToCommentLike(comment.id));
            } else {
              setDislikeCount(dislikeCount + 1);
              if (isLiked) { setLikeCount(likeCount - 1)}
              dispatch(addToCommentDislike(comment.id));
            }
          }
        }
  
      } catch (err: any) {
        console.log(`error: ${err}`);
      }
    };

  return (
    <Card
      sx={{
        width: width || '85ch',
      }}
    >   
        <CardHeader
          avatar={
            <IconButton
              // LinkComponent={Link}
              // href={`/profile/${comment.username}`}
              sx={{
                padding: '2px !important'
              }}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
                router.push(`/profile/${comment.username}`);
              }}
            >
              <Avatar
                sx={{width: '32px', height: '32px', fontSize: theme.typography.pxToRem(15)}}
              >
                {comment.username[0].toUpperCase()}
              </Avatar>
            </IconButton>
          }
          action={
            <IconButton color='inherit' onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              setReportAnchorEl(e.currentTarget)}}
            >
              <MoreVertSharp sx={{ fontSize: theme.typography.pxToRem(20)}}/>
            </IconButton>
          }
          subheader={<Typography variant='body2'>@{comment.username} | {format(creation_date, "MMM d, y")}</Typography>}
          sx={{
            padding: theme.spacing(1.5),
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
        <Menu
          id={`report-${comment.id}`}
          open={reportAnchorEl !== null}
          anchorEl={reportAnchorEl}
          onClose={(e: React.MouseEvent<HTMLElement>) => {e.stopPropagation(); setReportAnchorEl(null)}}
        >
          <MenuItem
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
            }}
          >Report</MenuItem>
        </Menu>
          <Container sx={{padding: '0 !important', margin: '0 !important'}}>
          <MuiMarkdown
              overrides={{
                ...getOverrides({}),
                img: {
                  props: {
                    style: {
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover'
                    }
                  }
                }
              }}
            >
              {comment.comment}
            </MuiMarkdown>
          </Container>
        </CardContent>
        <CardActions>
          <LikeDislikeButton 
            likeCount={likeCount}
            dislikeCount={dislikeCount}
            status={isLiked ? 'liked' : isDisliked ? 'disliked': 'undefined'}
            onLikeClick={handleLikeClick}
            onDislikeClick={handleDislikeClick}
          />
        </CardActions>
    </Card>
  )
}

export default CommentCard;