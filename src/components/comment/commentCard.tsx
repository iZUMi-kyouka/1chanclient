'use client';

import { BASE_API_URL } from '@/app/[locale]/layout';
import Comment from '@/interfaces/comment';
import { SupportedLanguages } from '@/store/appState/appStateSlice';
import { selectAccessToken } from '@/store/auth/authSlice';
import {
  addToCommentDislike,
  addToCommentLike,
  removeFromCommentLikeDislike,
  selectUserLikedComments,
  selectUserWrittenComments,
} from '@/store/user/userSlice';
import { customFetch } from '@/utils/customFetch';
import { withLocale } from '@/utils/makeUrl';
import { MoreVertSharp } from '@mui/icons-material';
import {
  Box,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import MuiMarkdown, { getOverrides } from 'mui-markdown';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LikeDislikeButton from '../button/likeDislikeButton';
import StandardCard from '../StandardCard';
import UserAvatar from '../user/userAvatar';
import { CommentDeleteDialog, CommentReportDialog } from './commentDialogs';

const CommentCard = ({
  width,
  comment,
}: {
  width?: string;
  comment: Comment;
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const locale = useLocale() as SupportedLanguages;
  const accessToken = useSelector(selectAccessToken);
  const likes = useSelector(selectUserLikedComments);
  const writtenComments = useSelector(selectUserWrittenComments);

  const likesDisabled = accessToken === '' ? true : false;
  const isOwnedByCurrentUser = writtenComments[comment.id] === 0 ? true : false;
  const updatedDate = comment.updated_date
    ? format(comment.updated_date, 'MMM d, y')
    : '';

  const isLiked = likes[comment.id] === 1;
  const isDisliked = likes[comment.id] === 0;

  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [dislikeCount, setDislikeCount] = useState(comment.dislike_count);
  const [reportAnchorEl, setReportAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [commentDeleteDialogOpen, setCommentDeleteDialogOpen] = useState(false);

  const reportRef = useRef<HTMLInputElement | null>(null);

  const creation_date = new Date(comment.creation_date);

  const openCommentDeleteDialog = () => {
    setCommentDeleteDialogOpen(true);
  };

  const closeCommentDeleteDialog = () => {
    setCommentDeleteDialogOpen(false);
  };

  const handleEditComment = () => {
    router.push(withLocale(locale, `/edit/comment/${comment.id}`));
  };

  const handleReport = async () => {
    if (reportRef.current && reportRef.current.value === '') {
      alert('Reporting a comment with no reason is not allowed.');
      return;
    }

    try {
      const response = await customFetch(
        `${BASE_API_URL}/comments/report/${comment.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            report_reason: reportRef.current?.value,
          }),
        }
      );

      if (response.ok) {
        const reportID = (await response.json()).report_id;
        alert(
          `Thread ${comment.id} successfully reported. Your report ID is ${reportID}`
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

  const handleDeleteComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    try {
      const response = await customFetch(
        `${BASE_API_URL}/comments/${comment.id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        alert(`Comment with ID of ${comment.id}) successfully deleted.`);
        closeCommentDeleteDialog();
      } else {
        throw new Error('unexpected error occurred.');
      }
    } catch (err) {
      alert(`Failed to delete comment: ${err}`);
    }
  };

  const handleLikeDislike = async (likeDislike: number, remove?: boolean) => {
    let url: string;
    if (likeDislike === 1) {
      url = `${BASE_API_URL}/comments/like/${comment.id}`;
    } else {
      url = `${BASE_API_URL}/comments/dislike/${comment.id}`;
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
          dispatch(removeFromCommentLikeDislike(comment.id));
        } else {
          if (likeDislike === 1) {
            setLikeCount(likeCount + 1);
            if (isDisliked) {
              setDislikeCount(dislikeCount - 1);
            }
            dispatch(addToCommentLike(comment.id));
          } else {
            setDislikeCount(dislikeCount + 1);
            if (isLiked) {
              setLikeCount(likeCount - 1);
            }
            dispatch(addToCommentDislike(comment.id));
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
    <StandardCard width={width}>
      <CardHeader
        avatar={
          <IconButton
            sx={{
              padding: '2px !important',
            }}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              router.push(withLocale(locale, `/profile/${comment.username}`));
            }}
          >
            <UserAvatar
              username={comment.username}
              filename={comment.user_profile_path}
              sx={{
                width: '32px',
                height: '32px',
                fontSize: theme.typography.pxToRem(15),
              }}
            />
          </IconButton>
        }
        action={
          <IconButton
            color="inherit"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              setReportAnchorEl(e.currentTarget);
            }}
          >
            <MoreVertSharp sx={{ fontSize: theme.typography.pxToRem(20) }} />
          </IconButton>
        }
        subheader={
          <Typography variant="body2">
            @{comment.username} | {format(creation_date, 'MMM d, y')}{' '}
            {updatedDate ? ` (edited)` : null}
          </Typography>
        }
        sx={{
          padding: theme.spacing(1.5),
          paddingBottom: '0 !important',
        }}
      />
      <CardContent
        sx={{
          '&:last-child': {
            paddingBottom: theme.spacing(2),
          },
          padding: theme.spacing(2),
          paddingTop: theme.spacing(1),
        }}
      >
        <Menu
          id={`report-${comment.id}`}
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
            <Box>
              <MenuItem onClick={handleEditComment}>Edit</MenuItem>
              <MenuItem onClick={openCommentDeleteDialog}>Delete</MenuItem>
            </Box>
          ) : null}
        </Menu>
        <Container sx={{ padding: '0 !important', margin: '0 !important' }}>
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
            {comment.comment}
          </MuiMarkdown>
        </Container>
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
      </CardActions>

      <CommentDeleteDialog
        comment={comment}
        handleDeleteComment={handleDeleteComment}
        open={commentDeleteDialogOpen}
        onClose={closeCommentDeleteDialog}
      />
      <CommentReportDialog
        open={reportDialogOpen}
        comment={comment}
        handleReport={handleReport}
        onClose={handleDialogClose}
        reportRef={reportRef}
      />
    </StandardCard>
  );
};

export default CommentCard;
