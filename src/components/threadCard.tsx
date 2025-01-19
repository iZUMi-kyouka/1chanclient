"use client";

import { AdsClick, AdsClickSharp, BorderRight, CommentSharp, MoreVertSharp, ShareSharp, ThumbDown, ThumbDownAltSharp, ThumbDownOffAltSharp, ThumbDownOutlined, ThumbDownSharp, ThumbUp, ThumbUpAltSharp, ThumbUpOffAltSharp, ThumbUpOutlined, ThumbUpSharp, VisibilityOffOutlined, VisibilityOutlined, VisibilitySharp } from '@mui/icons-material';
import { alpha, Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react'
import MuiMarkdown, { getOverrides } from 'mui-markdown';
import { BASE_API_URL } from '@/app/layout';
import { customFetch } from '@/utils/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { addToThreadDislike, addToThreadLike, removeFromThreadLikeDislike, selectUserLikedThreads } from '@/store/user/userSlice';
import { store } from '@/store/store';
import { useRouter } from 'next/navigation';
import { Thread } from '@/interfaces/thread';
import PaginatedResponse from '@/interfaces/paginatedResponse';
import { format } from 'date-fns/format';
import LikeDislikeButton from './likeDislikeButton';
import { openCopyPasteSnackbar } from '@/store/appState/appStateSlice';
import beautifyNumber from '@/utils/beautifyNumber';

const classes = {
  buttonLike: {
    borderRadius: '25px 0 0 25px',
    borderRight: '0px !important'
  },
  buttonDislike: {
    borderRadius: '0px 25px 25px 0px',
  }
}

const ThreadCard = ({ thread, width, disableOnClick }: { thread: Thread, width?: string, disableOnClick?: boolean}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const likes = useSelector(selectUserLikedThreads);
  const [likeCount, setLikeCount] = useState(thread.like_count);
  const [dislikeCount, setDislikeCount] = useState(thread.dislike_count);
  const router = useRouter();
  const [reportAnchorEl, setReportAnchorEl] = useState<null | HTMLElement>(null);

  const copyToClipboard = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(`${BASE_API_URL}/thread/${thread.id}`);
    dispatch(openCopyPasteSnackbar());
  };

  const isLiked = likes[thread.id] !== undefined && likes[thread.id] === 1;
  const isDisliked = likes[thread.id] !== undefined && likes[thread.id] === 0;

  const handleLikeDislike = (likeDislike: number, remove?: boolean) => async (e?: React.MouseEvent) => {
    e?.stopPropagation();
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
          dispatch(removeFromThreadLikeDislike(thread.id));
        } else {
          if (likeDislike === 1) {
            setLikeCount(likeCount + 1);
            if (isDisliked) { setDislikeCount(dislikeCount - 1)}
            dispatch(addToThreadLike(thread.id));
          } else {
            setDislikeCount(dislikeCount + 1);
            if (isLiked) { setLikeCount(likeCount - 1)}
            dispatch(addToThreadDislike(thread.id));
          }
        }
      }

    } catch (err: any) {
      console.log(`error: ${err}`);
    }
  }

  return (
    <Card 
      elevation={1}
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
          sx={{
            transition: 'background-color 150ms ease-out',
            '&:hover': {
              // backgroundColor: theme.palette.grey[100],
              cursor: disableOnClick ? 'default' : 'pointer'
            }
          }}
          onClick={() => { if (!disableOnClick) {router.push(`/thread/${thread.id}`)}}}
        >
        <Menu
          id={`report-${thread.id}`}
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
        <CardHeader 
          avatar={
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                router.push(`/profile/${thread.username}`);
              }}
              sx={{
                padding: '0px !important'
              }}
            >
              <Avatar>
                {thread.username[0].toUpperCase()}
              </Avatar>
            </IconButton>

          }
          action={
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                setReportAnchorEl(e.currentTarget)}}
              color='inherit'
            >
              <MoreVertSharp />
            </IconButton>
          }
          title={thread.title}
          subheader={`by ${thread.username} | ${format(new Date(thread.creation_date), 'MMM d, y')}`}
        />

          <CardContent>
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
              {thread.original_post}
            </MuiMarkdown>
          </CardContent>
        <CardActions>
          {
            !isLiked && !isDisliked
            ? <LikeDislikeButton
                likeCount={likeCount}
                dislikeCount={dislikeCount}
                status='undefined' 
                onLikeClick={handleLikeDislike(1)} 
                onDislikeClick={handleLikeDislike(0)}
              />
            : isDisliked
            ? <LikeDislikeButton 
              status='disliked'
              likeCount={likeCount}
              dislikeCount={dislikeCount}
              onLikeClick={handleLikeDislike(1)} 
              onDislikeClick={handleLikeDislike(0, true)}
              />
            : isLiked
            ? <LikeDislikeButton 
                status='liked'
                likeCount={likeCount}
                dislikeCount={dislikeCount}
                onLikeClick={handleLikeDislike(1, true)} 
                onDislikeClick={handleLikeDislike(0)}
              />
              : <></>
          }
          <Tooltip
            title="Copy link to clipboard"
          >
            <IconButton
              onClick={copyToClipboard}
              aria-label='Copy link to clipboard.'
            >
              <ShareSharp sx={{color: theme.palette.primary.main}}/>
            </IconButton>
          </Tooltip>

          <Box sx={{flexGrow: 1}} />
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginRight: 2
            }}
          > */}
            <Chip
              icon={
                <AdsClickSharp 
                  sx={{ 
                    marginRight: 1, 
                    color: theme.palette.primary.main
                }}/>}
              label={beautifyNumber(thread.view_count)}
            />
            <Chip 
              sx={{
                paddingLeft: theme.spacing(0.5)
              }}
              icon={<CommentSharp
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: '22px !important'
                }}
              />}
              label={beautifyNumber(thread.comment_count)}
            />
          {/* </Box> */}
        </CardActions>
        </Box>
    </Card>
  )
}

export default ThreadCard;