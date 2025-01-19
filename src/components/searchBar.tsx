'use client';

import { SearchSharp } from "@mui/icons-material";
import { alpha, InputBase, styled } from "@mui/material";
import { forwardRef } from "react";

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
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  }));

export const SearchBarIconWrapper = styled('div')(({ theme }) => ({
    // padding: theme.spacing(2),
    left: '12px',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

export const SearchBarInputBase = styled(forwardRef<HTMLInputElement, React.ComponentProps<typeof InputBase>>((props, ref) => <InputBase {...props} inputRef={ref} />))(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        height: '48px',
        padding: 0,
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '25ch',
            '&:focus': {
                width: '40ch'
            }
        }
    }
}));