'use client';

import { purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    primary: purple
  }
});

export default theme;