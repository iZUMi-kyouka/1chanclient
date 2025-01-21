"use client";

import { AdsClick, AdsClickSharp, BorderRight, CommentSharp, MoreVertSharp, ShareSharp, ThumbDown, ThumbDownAltSharp, ThumbDownOffAltSharp, ThumbDownOutlined, ThumbDownSharp, ThumbUp, ThumbUpAltSharp, ThumbUpOffAltSharp, ThumbUpOutlined, ThumbUpSharp, VisibilityOffOutlined, VisibilityOutlined, VisibilitySharp } from '@mui/icons-material';
import { alpha, Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react'
import MuiMarkdown, { getOverrides } from 'mui-markdown';
import { BASE_API_URL, BASE_URL } from '@/app/layout';
import { customFetch } from '@/utils/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { addToThreadDislike, addToThreadLike, removeFromThreadLikeDislike, selectUserLikedThreads, selectUserWrittenThreads } from '@/store/user/userSlice';
import { store } from '@/store/store';
import { useRouter } from 'next/navigation';
import { Thread } from '@/interfaces/thread';
import PaginatedResponse from '@/interfaces/paginatedResponse';
import { format } from 'date-fns/format';
import LikeDislikeButton from './likeDislikeButton';
import { openCopyPasteSnackbar } from '@/store/appState/appStateSlice';
import beautifyNumber from '@/utils/beautifyNumber';
import UserAvatar from './userAvatar';
import BareContainer from './bareContainer';

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
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const likes = useSelector(selectUserLikedThreads);
  const writtenThreads = useSelector(selectUserWrittenThreads);
  const isOwnedByCurrentUser = writtenThreads[thread.id] === 0 ? true : false;
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const [likeCount, setLikeCount] = useState(thread.like_count);
  const [dislikeCount, setDislikeCount] = useState(thread.dislike_count);
  const [reportAnchorEl, setReportAnchorEl] = useState<null | HTMLElement>(null);

  const reportRef = useRef<HTMLInputElement | null>(null);

  const updatedDate = thread.updated_date ? format(thread.updated_date, 'MMM d, y') : '';
  const lastCommentDate = thread.last_comment_date ? format(thread.last_comment_date, 'MMM d, y') : '';

  const handleReport = async () => {
    try {
      const response = await customFetch(`${BASE_API_URL}/threads/report/${thread.id}`, {
        method: 'POST',
        body: JSON.stringify({
          report_reason: reportRef.current?.value || null,
        })
      });

      if (response.ok) {
        const reportID = (await response.json()).report_id;
        alert(`Thread ${thread.id} successfully reported. Your report ID is ${reportID}`);
        setReportDialogOpen(false);
        setReportAnchorEl(null);
      } else {
        throw new Error("unexpected error occurred.")
      }

    } catch (err: any) {
      alert(`Failed to report thread: ${err}`)
    }
  };

  const copyToClipboard = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(`${BASE_API_URL}/thread/${thread.id}`);
    dispatch(openCopyPasteSnackbar());
  };

  const handleEditThread = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    router.push(`/edit/thread/${thread.id}`);
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

  const handleDialogClose = () => {
    setReportDialogOpen(false);
    setReportAnchorEl(null);
  };

  return (
    <Card 
      elevation={1}
      sx={{ 
        width: width || '85ch',
        [theme.breakpoints.down('lg')]: {
          width: '100%'
        },
        // maxWidth: '85ch',
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
          onClick={() => { if (!disableOnClick && !reportDialogOpen) {router.push(`/thread/${thread.id}`)}}}
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
              setReportDialogOpen(true);
            }}
          >Report</MenuItem>
          {
            isOwnedByCurrentUser 
            ? <MenuItem onClick={handleEditThread}>Edit</MenuItem>
            : null
          }
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
              <UserAvatar username={thread.username} filename={thread.user_profile_path}/>
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
          subheader={`by ${thread.username} | ${format(thread.creation_date, 'MMM d, y')}${updatedDate ? ` (edited ${updatedDate})` : ''}`}
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
            <Tooltip title={lastCommentDate ? `Last comment was on ${lastCommentDate}` : null}>
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
            </Tooltip>
          {/* </Box> */}
        </CardActions>

        {/* Report dialog */}
        <Dialog open={reportDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Report Thread</DialogTitle>
          <DialogContent>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: theme.spacing(2)}}>
            <BareContainer>
              <Typography>{`ID: ${thread.id}`}</Typography>
              <Typography>{`Title: ${thread.title}`}</Typography>
              <Typography>{`Original Poster: ${thread.username}`}</Typography>
            </BareContainer>
              <TextField
                sx={{
                  width: '30ch',
                  [theme.breakpoints.up('sm')]: { width: '50ch'},
                }}
                rows={4}
                multiline
                label='Reason'
                placeholder="Tell us more what's wrong about this thread..."
                inputRef={reportRef}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleReport}>Report</Button>
          </DialogActions>
        </Dialog>
        </Box>
    </Card>
  )
}

export default ThreadCard;