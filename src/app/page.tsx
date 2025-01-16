'use client';

import Sidebar from "@/components/sidebar";
import ThreadCard from "@/components/threadCard";
import ThreadList from "@/components/threadList";
import FetchUserData from "@/components/userDataProvider";
import { useTheme } from "@mui/material";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type CurrentHomePage = 'home' | 'trending';

export default function Home() {
  const [currentHomePage, setCurrentHomePage] = useState<CurrentHomePage>('home');
  const theme = useTheme();

  return (
    <>
      <Sidebar />
      <Container sx={{ paddingLeft: '300px !important',}}>
        <ThreadList />
      </Container>
    </>
  );
}
