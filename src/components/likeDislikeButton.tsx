import beautifyNumber from '@/utils/beautifyNumber';
import { ThumbUpOutlined, ThumbDown, ThumbDownOutlined, ThumbUp } from '@mui/icons-material';
import { Button, ButtonGroup } from '@mui/material';
import React from 'react'

const classes = {
  buttonLike: {
    borderRadius: '25px 0 0 25px',
    borderRight: '0px !important'
  },
  buttonDislike: {
    borderRadius: '0px 25px 25px 0px',
  }
}

const LikeDislikeButton = (
  { likeCount, dislikeCount, status, onLikeClick, onDislikeClick }: 
  { likeCount?: number, 
    dislikeCount?: number, 
    status: 'liked' | 'disliked' | 'undefined', 
    onLikeClick?: (e: React.MouseEvent<HTMLElement>) => void,
    onDislikeClick?: (e: React.MouseEvent<HTMLElement>) => void}) => {
  
  const handleLikeClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onLikeClick) {
      onLikeClick(e);
    }
  }

  const handleDislikeClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onDislikeClick) {
      onDislikeClick(e);
    }
  };

  return (
    <ButtonGroup>
      <Button
        onClick={handleLikeClick}
        sx={classes.buttonLike}
        startIcon={ status === 'liked' ? <ThumbUp /> : <ThumbUpOutlined />}
      >{beautifyNumber(likeCount || 0)}</Button>
      <Button
        onClick={handleDislikeClick}
        sx={classes.buttonDislike}
        endIcon={status === 'disliked' ? <ThumbDown /> : <ThumbDownOutlined />}
      >{beautifyNumber(dislikeCount || 0)}</Button>
    </ButtonGroup>
  )
}

export default LikeDislikeButton;