'use client';

import Sidebar from "@/components/sidebar";
import ThreadCard from "@/components/threadCard";
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
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(1),
        paddingLeft: '300px !important'
      }}>
        <Typography variant={"h4"}>Hello, world!</Typography>
        <ThreadCard thread={{
          id: 1,
          username: 'user1',
          title: 'Lorem ipsum dolor sit amet.',
          content: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
          creation_date: new Date(),
          like_count: 10,
          dislike_count: 10,
          view_count: 2048
        }}/>
      </Container>
    </>
  );
}
