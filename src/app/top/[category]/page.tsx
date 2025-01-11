'use client';

import Sidebar from '@/components/sidebar'
import ThreadCard, { ThreadListResponse } from '@/components/threadCard'
import ThreadList from '@/components/threadList';
import { generalFetch } from '@/utils/customFetch';
import { CircularProgress, Container, Typography, useTheme } from '@mui/material'
import { Params } from 'next/dist/server/request/params';
import React from 'react';
import { use } from 'react';
import useSWR from 'swr';

const page = ({ params }: { params: Promise<Params> }) => {
  const theme = useTheme();
  var categoryId: number | undefined;
  const categoryIdStr = use(params).category;
  if (categoryIdStr && typeof(categoryIdStr) === "string") {
    categoryId = parseInt(categoryIdStr)
  } else {
    categoryId = undefined
  }

  return (
      <>
        <Sidebar />
        <ThreadList category={categoryId} />
      </>
    );
}

export default page;