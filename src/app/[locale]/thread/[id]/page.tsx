'use client';

import { BASE_API_URL } from '@/app/[locale]/layout';
import FullPageSpinner from '@/components/loading/fullPageLoading';
import ThreadOpenView from '@/components/thread/threadOpenView';
import ColFlexBox from '@/components/wrapper/colFlexContainer';
import { ThreadViewResponse } from '@/interfaces/thread';
import { generalFetch } from '@/utils/customFetch';
import { Typography } from '@mui/material';
import { Params } from 'next/dist/server/request/params';
import { use } from 'react';
import useSWR from 'swr';

const Page = ({ params }: { params: Promise<Params> }) => {
  const threadID = use(params).id;
  const { data, error, isLoading } = useSWR<ThreadViewResponse>(
    `${BASE_API_URL}/threads/${threadID}`,
    generalFetch()
  );

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (error) {
    return (
      <ColFlexBox>
        <title>{`1chan | Thread`}</title>
        <Typography>This thread is missing or has been deleted.</Typography>
        <Typography>Please refresh the page.</Typography>
      </ColFlexBox>
    );
  }

  if (data) {
    return (
      <>
        <title>{`1chan | Thread: ${data.thread.title}`}</title>
        <ThreadOpenView threadViewResponse={data} />
      </>
    );
  }
};

export default Page;
