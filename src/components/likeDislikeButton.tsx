import beautifyNumber from '@/utils/beautifyNumber';
import noPropagate from '@/utils/onClickHandlers';
import {
  ThumbDown,
  ThumbDownOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from '@mui/icons-material';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import React from 'react';

const classes = {
  buttonLike: {
    borderRadius: '25px 0 0 25px',
    borderRight: '0px !important',
  },
  buttonDislike: {
    borderRadius: '0px 25px 25px 0px',
  },
};

const LikeDislikeButton = ({
  likeCount,
  dislikeCount,
  status,
  onLikeClick,
  onDislikeClick,
  disabled,
}: {
  disabled?: boolean;
  likeCount?: number;
  dislikeCount?: number;
  status: 'liked' | 'disliked' | 'undefined';
  onLikeClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onDislikeClick?: (e: React.MouseEvent<HTMLElement>) => void;
}) => {
  const handleLikeClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onLikeClick) {
      onLikeClick(e);
    }
  };

  const handleDislikeClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onDislikeClick) {
      onDislikeClick(e);
    }
  };

  return (
    <Tooltip title={`${disabled ? "You must be logged in to like and dislike." : ''}`}>
      <ButtonGroup disabled={disabled === true}
        sx={{
          '& .MuiButtonBase-root:disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
          }
        }}
      > 
        <Button
          onClick={disabled ? noPropagate() : handleLikeClick}
          sx={classes.buttonLike}
          startIcon={status === 'liked' ? <ThumbUp /> : <ThumbUpOutlined />}
        >
          {beautifyNumber(likeCount || 0)}
        </Button>
        <Button
          onClick={disabled ? noPropagate() : handleDislikeClick}
          sx={classes.buttonDislike}
          endIcon={status === 'disliked' ? <ThumbDown /> : <ThumbDownOutlined />}
        >
          {beautifyNumber(dislikeCount || 0)}
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};

export default LikeDislikeButton;
