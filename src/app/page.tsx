'use client';

import Sidebar from "@/components/sidebar";
import ThreadList, { ThreadListResponse } from "@/components/threadList";
import WrappedLoading from "@/components/wrappedLoading";
import { generalFetch } from "@/utils/customFetch";
import { Box, Container, useTheme } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { BASE_API_URL } from "./layout";

type CurrentHomePage = 'home' | 'trending';

export default function Home() {
  const [currentHomePage, setCurrentHomePage] = useState<CurrentHomePage>('home');
  const theme = useTheme();

  const { data, error, isLoading }  = useSWR<ThreadListResponse>(`${BASE_API_URL}/threads/list`, generalFetch());


  return (
    <>
      <Box sx={{display: 'flex'}}>
        <Sidebar />
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: theme.spacing(2), minHeight: 'calc(100vh - 96px)'}}>
        {
          (() => {
            if (isLoading) {
              return <WrappedLoading />
            }

            if (error) {
              throw new Error(error);
            }

            if (data) {
              return (
                <ThreadList threads={data} />
              )
            }

          })()
        }
        </Container>
      </Box>
    </>
  );
}
