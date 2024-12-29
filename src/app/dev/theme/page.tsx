'use client';

import Typography from "@mui/material/Typography";
import {createTheme} from "@mui/material/styles";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {purple} from "@mui/material/colors";
import {Button} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
});

export default function ThemePage() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#9b9b9b',
      },
      secondary: purple
    },
    typography: {
      fontFamily: 'Quicksand',
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
      fontWeightBold: 700,
    },
  });

  return (
    <>
      <div className={quicksand.className}></div>
      <ThemeProvider theme={theme}>
        <Typography>Testing various themes</Typography>
        <Button
          color={"secondary"}
          variant={"contained"}
          endIcon={<KeyboardArrowRightIcon />}
        >Submit
        </Button>
      </ThemeProvider>
    </>
  )
}