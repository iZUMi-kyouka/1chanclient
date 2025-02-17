'use client';

import { BASE_API_URL } from '@/app/[locale]/layout';
import { Thread } from '@/interfaces/thread';
import {
  openCopyPasteSnackbar,
  SupportedLanguages,
} from '@/store/appState/appStateSlice';
import { selectAccessToken } from '@/store/auth/authSlice';
import {
  addToThreadDislike,
  addToThreadLike,
  removeFromThreadLikeDislike,
  selectUserLikedThreads,
  selectUserWrittenThreads,
} from '@/store/user/userSlice';
import { customFetch } from '@/utils/customFetch';
import { withLocale } from '@/utils/makeUrl';
import { splitCustomTags, splitTags } from '@/utils/tagsSplitter';
import { MoreVertSharp } from '@mui/icons-material';
import {
  Box,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns/format';
import MuiMarkdown, { getOverrides } from 'mui-markdown';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SWRInfiniteKeyedMutator } from 'swr/infinite';
import LikeDislikeButton from '../button/likeDislikeButton';
import ShareButton from '../button/shareButton';
import CommentCountChip from '../chip/commentCountChip';
import CustomTagChip from '../chip/customTagChip';
import TagChip from '../chip/tagChip';
import ViewCountChip from '../chip/viewCountChip';
import StandardCard from '../StandardCard';
import UserAvatar from '../user/userAvatar';
import RowFlexBox from '../wrapper/rowFlexContainer';
import { ThreadDeleteDialog, ThreadReportDialog } from './threadDialogs';
import { ThreadListResponse } from './threadList';

const ThreadCard = ({
  thread,
  width,
  disableOnClick,
  mutateHook,
  showTags,
  showCustomTags,
}: {
  thread: Thread;
  width?: string;
  disableOnClick?: boolean;
  mutateHook?: SWRInfiniteKeyedMutator<ThreadListResponse[]>;
  showTags?: boolean;
  showCustomTags?: boolean;
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const locale = useLocale() as SupportedLanguages;

  const likes = useSelector(selectUserLikedThreads);
  const writtenThreads = useSelector(selectUserWrittenThreads);
  const accessToken = useSelector(selectAccessToken);

  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // const [likeCount, setLikeCount] = useState(thread.like_count);
  // const [dislikeCount, setDislikeCount] = useState(thread.dislike_count);
  const [reportAnchorEl, setReportAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const reportRef = useRef<HTMLInputElement | null>(null);

  const likesDisabled = accessToken === '';
  const isLiked = likes[thread.id] === 1;
  const isDisliked = likes[thread.id] === 0;
  const isOwnedByCurrentUser = writtenThreads[thread.id] === 0 ? true : false;
  const updatedDate = thread.updated_date
    ? format(thread.updated_date, 'MMM d, y')
    : '';
  const lastCommentDate = thread.last_comment_date
    ? format(thread.last_comment_date, 'MMM d, y')
    : '';

  const handleLikeClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if ((!isDisliked && !isLiked) || isDisliked) {
      handleLikeDislike(1);
    } else {
      handleLikeDislike(1, true);
    }

    if (mutateHook) {
      mutateHook((data) => data, {
        optimisticData: (data) => {
          const threadListArr = data as ThreadListResponse[];
          const newThreadList = threadListArr.map((threadList) => {
            if (threadList.response) {
              const newResponse = threadList.response.map((curThread) => {
                if (curThread.id === thread.id) {
                  const newThread: Thread = {
                    ...curThread,
                    like_count:
                      (!isDisliked && !isLiked) || isDisliked
                        ? curThread.like_count + 1
                        : curThread.like_count - 1,
                    dislike_count: isDisliked
                      ? curThread.dislike_count - 1
                      : curThread.dislike_count,
                  };
                  return newThread;
                } else {
                  return curThread;
                }
              });

              return { ...threadList, response: newResponse };
            } else {
              return threadList;
            }
          });
          return newThreadList;
        },
        revalidate: false,
        populateCache: false,
      });
    }
  };

  const handleDislikeClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if ((!isDisliked && !isLiked) || isLiked) {
      handleLikeDislike(0);
    } else {
      handleLikeDislike(0, true);
    }

    if (mutateHook) {
      mutateHook((data) => data, {
        optimisticData: (data) => {
          const threadListArr = data as ThreadListResponse[];
          const newThreadList = threadListArr.map((threadList) => {
            if (threadList.response) {
              const newResponse = threadList.response.map((curThread) => {
                if (curThread.id === thread.id) {
                  const newThread: Thread = {
                    ...curThread,
                    dislike_count:
                      (!isDisliked && !isLiked) || isLiked
                        ? curThread.dislike_count + 1
                        : curThread.dislike_count - 1,
                    like_count: isLiked
                      ? curThread.like_count - 1
                      : curThread.like_count,
                  };
                  return newThread;
                } else {
                  return curThread;
                }
              });

              return { ...threadList, response: newResponse };
            } else {
              return threadList;
            }
          });
          return newThreadList;
        },
        revalidate: false,
        populateCache: false,
      });
    }
  };

  const handleDeleteDialogOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleReport = async () => {
    try {
      if (reportRef.current && reportRef.current.value === '') {
        alert('Reporting a thread with empty reason is not allowed.');
        return;
      }

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
    router.push(withLocale(locale, `/edit/thread/${thread.id}`));
  };

  const handleDeleteThread = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    try {
      const response = await customFetch(
        `${BASE_API_URL}/threads/${thread.id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        alert(
          `Thread "${thread.title}" (ID: ${thread.id}) successfully deleted.`
        );
        setDeleteDialogOpen(false);
      } else {
        throw new Error('unexpected error occurred.');
      }
    } catch (err) {
      alert(`Failed to delete thread: ${err}`);
    }
  };

  const handleLikeDislike = async (likeDislike: number, remove?: boolean) => {
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
        if (remove) {
          dispatch(removeFromThreadLikeDislike(thread.id));
        } else {
          if (likeDislike === 1) {
            dispatch(addToThreadLike(thread.id));
          } else {
            dispatch(addToThreadDislike(thread.id));
          }
        }
      }
    } catch (err: unknown) {
      throw err;
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
        width: width || '925px',
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
            router.push(withLocale(locale, `/thread/${thread.id}`));
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
            <Box>
              <MenuItem onClick={handleEditThread}>Edit</MenuItem>
              <MenuItem onClick={handleDeleteDialogOpen}>Delete</MenuItem>
            </Box>
          ) : null}
        </Menu>
        <CardHeader
          avatar={
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                router.push(withLocale(locale, `/profile/${thread.username}`));
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

        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
          }}
        >
          <MuiMarkdown
            overrides={{
              ...getOverrides({}),
              img: {
                props: {
                  style: {
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    margin: '0 auto',
                    objectFit: 'contain',
                    maxHeight: '400px',
                    borderRadius: theme.spacing(1),
                  },
                },
              },
            }}
          >
            {thread.original_post}
          </MuiMarkdown>
          {showCustomTags || showTags ? (
            <Stack
              marginBottom={theme.spacing(1)}
              direction={'column'}
              gap={theme.spacing(0.75)}
            >
              <RowFlexBox
                sx={{
                  flexWrap: 'wrap',
                }}
              >
                {thread.tags && showTags ? (
                  splitTags(thread.tags).map((tag, idx) => {
                    return <TagChip key={idx} tagID={tag} />;
                  })
                ) : (
                  <></>
                )}
              </RowFlexBox>
              <RowFlexBox
                sx={{
                  flexWrap: 'wrap',
                }}
              >
                {thread.custom_tags && showCustomTags ? (
                  splitCustomTags(thread.custom_tags).map((customTag, idx) => {
                    return <CustomTagChip key={idx} customTag={customTag} />;
                  })
                ) : (
                  <></>
                )}
              </RowFlexBox>
            </Stack>
          ) : null}
        </CardContent>
        <CardActions
          sx={{
            paddingLeft: `${theme.spacing(2)} !important`,
            paddingRight: `${theme.spacing(2)} !important`,
          }}
        >
          <LikeDislikeButton
            disabled={likesDisabled}
            likeCount={thread.like_count}
            dislikeCount={thread.dislike_count}
            status={isLiked ? 'liked' : isDisliked ? 'disliked' : 'undefined'}
            onLikeClick={handleLikeClick}
            onDislikeClick={handleDislikeClick}
          />
          <ShareButton onCopyToClipboard={copyToClipboard} />

          <Box sx={{ flexGrow: 1 }} />
          <RowFlexBox
            sx={{
              [theme.breakpoints.down(375)]: {
                display: 'none',
              },
            }}
          >
            <ViewCountChip viewCount={thread.view_count} />
            <Tooltip
              title={
                lastCommentDate
                  ? `Last comment was on ${lastCommentDate}`
                  : null
              }
            >
              <Box>
                <CommentCountChip commentCount={thread.comment_count} />
              </Box>
            </Tooltip>
          </RowFlexBox>
        </CardActions>

        <ThreadDeleteDialog
          thread={thread}
          onClose={handleDeleteDialogClose}
          open={deleteDialogOpen}
          handleDeleteThread={handleDeleteThread}
        />
        <ThreadReportDialog
          thread={thread}
          open={reportDialogOpen}
          reportRef={reportRef}
          onClose={handleDialogClose}
          handleReport={handleReport}
        />
      </Box>
    </StandardCard>
  );
};

export default ThreadCard;
