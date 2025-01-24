'use client';

import { alpha, InputBase, styled } from '@mui/material';
import { forwardRef } from 'react';

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  '&:focus': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(3),
  [theme.breakpoints.down(450)]: {
    marginLeft: 0,
  },
}));

export const SearchBarIconWrapper = styled('div')(() => ({
  left: '12px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const SearchBarInputBase = styled(
  // eslint-disable-next-line react/display-name
  forwardRef<HTMLInputElement, React.ComponentProps<typeof InputBase>>(
    (props, ref) => <InputBase {...props} inputRef={ref} />
  )
)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    height: '48px',
    padding: 0,
    paddingLeft: theme.spacing(2),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));

SearchBarInputBase.displayName = 'SearchBarInputBase';
