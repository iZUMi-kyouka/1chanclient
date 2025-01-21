'use client';

import { BASE_API_URL } from '@/app/layout';
import { Thread } from '@/interfaces/thread';
import { openCopyPasteSnackbar } from '@/store/appState/appStateSlice';
import { selectAccessToken } from '@/store/auth/authSlice';
import {
  addToThreadDislike,
  addToThreadLike,
  removeFromThreadLikeDislike,
  selectUserLikedThreads,
  selectUserWrittenThreads,
} from '@/store/user/userSlice';
import { customFetch } from '@/utils/customFetch';
import {
  MoreVertSharp
} from '@mui/icons-material';
import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns/format';
import MuiMarkdown, { getOverrides } from 'mui-markdown';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BareContainer from './bareContainer';
import CommentCountChip from './commentCountChip';
import LikeDislikeButton from './likeDislikeButton';
import ShareButton from './shareButton';
import StandardCard from './StandardCard';
import UserAvatar from './userAvatar';
import ViewCountChip from './viewCountChip';

const ThreadCard = ({
  thread,
  width,
  disableOnClick,
}: {
  thread: Thread;
  width?: string;
  disableOnClick?: boolean;
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();

  const likes = useSelector(selectUserLikedThreads);
  const writtenThreads = useSelector(selectUserWrittenThreads);
  const accessToken = useSelector(selectAccessToken);

  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(thread.like_count);
  const [dislikeCount, setDislikeCount] = useState(thread.dislike_count);
  const [reportAnchorEl, setReportAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const reportRef = useRef<HTMLInputElement | null>(null);

  const likesDisabled = accessToken === '';
  const isLiked = likes[thread.id] !== undefined && likes[thread.id] === 1;
  const isDisliked = likes[thread.id] !== undefined && likes[thread.id] === 0;
  const isOwnedByCurrentUser = writtenThreads[thread.id] === 0 ? true : false;
  const updatedDate = thread.updated_date
    ? format(thread.updated_date, 'MMM d, y')
    : '';
  const lastCommentDate = thread.last_comment_date
    ? format(thread.last_comment_date, 'MMM d, y')
    : '';

  const handleLikeClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isDisliked && !isLiked) {
      handleLikeDislike(1);
    } else if (isLiked) {
      handleLikeDislike(1, true);
    } else {
      handleLikeDislike(1);
    }
  };

  const handleDislikeClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isDisliked && !isLiked) {
      handleLikeDislike(0);
    } else if (isDisliked) {
      handleLikeDislike(0, true);
    } else {
      handleLikeDislike(0);
    }
  };
  const handleReport = async () => {
    try {
      const response = await customFetch(
        `${BASE_API_URL}/threads/report/${thread.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            report_reason: reportRef.current?.value || null,
          }),
        }
      );

      if (response.ok) {
        const reportID = (await response.json()).report_id;
        alert(
          `Thread ${thread.id} successfully reported. Your report ID is ${reportID}`
        );
        setReportDialogOpen(false);
        setReportAnchorEl(null);
      } else {
        throw new Error('unexpected error occurred.');
      }
    } catch (err) {
      alert(`Failed to report thread: ${err}`);
    }
  };

  const copyToClipboard = async (e?: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    await navigator.clipboard.writeText(`${BASE_API_URL}/thread/${thread.id}`);
    dispatch(openCopyPasteSnackbar());
  };

  const handleEditThread = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    router.push(`/edit/thread/${thread.id}`);
  };

  const handleLikeDislike =
    async (likeDislike: number, remove?: boolean) => {
      let url: string;
      if (likeDislike === 1) {
        url = `${BASE_API_URL}/threads/like/${thread.id}`;
      } else {
        url = `${BASE_API_URL}/threads/dislike/${thread.id}`;
      }

      try {
        const response = await customFetch(url, {
          method: 'PUT',
        });

        if (response.ok) {
          console.log('response ok');
          if (remove) {
            if (likeDislike === 1) {
              setLikeCount(likeCount - 1);
            } else {
              setDislikeCount(dislikeCount - 1);
            }
            dispatch(removeFromThreadLikeDislike(thread.id));
          } else {
            if (likeDislike === 1) {
              setLikeCount(likeCount + 1);
              if (isDisliked) {
                setDislikeCount(dislikeCount - 1);
              }
              dispatch(addToThreadLike(thread.id));
            } else {
              setDislikeCount(dislikeCount + 1);
              if (isLiked) {
                setLikeCount(likeCount - 1);
              }
              dispatch(addToThreadDislike(thread.id));
            }
          }
        }
      } catch (err) {
        console.log(`error: ${err}`);
      }
    };

  const handleDialogClose = () => {
    setReportDialogOpen(false);
    setReportAnchorEl(null);
  };

  return (
    <StandardCard
      elevation={1}
      sx={{
        width: width || '85ch',
        [theme.breakpoints.down('lg')]: {
          width: '100%',
        },
        '& .MuiCardHeader-title': {
          fontWeight: 400,
          fontSize: '18px',
        },
        '& .MuiAvatar-root': {
          height: '45px',
          width: '45px',
        },
        '& .MuiCardContent-root': {
          padding: theme.spacing(0, 2, 1, 2),
        },
        '& .MuiCardActions-root': {
          padding: theme.spacing(0, 1, 1, 1),
        },
      }}
    >
      <Box
        sx={{
          transition: 'background-color 150ms ease-out',
          '&:hover': {
            cursor: disableOnClick ? 'default' : 'pointer',
          },
        }}
        onClick={() => {
          if (!disableOnClick && !reportDialogOpen) {
            router.push(`/thread/${thread.id}`);
          }
        }}
      >
        <Menu
          id={`report-${thread.id}`}
          open={reportAnchorEl !== null}
          anchorEl={reportAnchorEl}
          onClose={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            setReportAnchorEl(null);
          }}
        >
          <MenuItem
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              setReportDialogOpen(true);
            }}
          >
            Report
          </MenuItem>
          {isOwnedByCurrentUser ? (
            <MenuItem onClick={handleEditThread}>Edit</MenuItem>
          ) : null}
        </Menu>
        <CardHeader
          avatar={
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                router.push(`/profile/${thread.username}`);
              }}
              sx={{
                padding: '0px !important',
              }}
            >
              <UserAvatar
                username={thread.username}
                filename={thread.user_profile_path}
              />
            </IconButton>
          }
          action={
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                setReportAnchorEl(e.currentTarget);
              }}
              color="inherit"
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
                    objectFit: 'cover',
                  },
                },
              },
            }}
          >
            {thread.original_post}
          </MuiMarkdown>
        </CardContent>
        <CardActions>
          <LikeDislikeButton
            disabled={likesDisabled}
            likeCount={likeCount}
            dislikeCount={dislikeCount}
            status={isLiked ? 'liked' : isDisliked ? 'disliked' : 'undefined'}
            onLikeClick={handleLikeClick}
            onDislikeClick={handleDislikeClick}
          />
          <ShareButton onCopyToClipboard={copyToClipboard} />

          <Box sx={{ flexGrow: 1 }} />
          <ViewCountChip viewCount={thread.view_count}/>
          <Tooltip
            title={
              lastCommentDate ? `Last comment was on ${lastCommentDate}` : null
            }
          >
            <Box>
              <CommentCountChip commentCount={thread.comment_count}/>
            </Box>
          </Tooltip>
        </CardActions>

        {/* Report dialog */}
        <Dialog open={reportDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Report Thread</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(2),
              }}
            >
              <BareContainer>
                <Typography>{`ID: ${thread.id}`}</Typography>
                <Typography>{`Title: ${thread.title}`}</Typography>
                <Typography>{`Original Poster: ${thread.username}`}</Typography>
              </BareContainer>
              <TextField
                sx={{
                  width: '30ch',
                  [theme.breakpoints.up('sm')]: { width: '50ch' },
                }}
                rows={4}
                multiline
                label="Reason"
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
    </StandardCard>
  );
};

export default ThreadCard;
