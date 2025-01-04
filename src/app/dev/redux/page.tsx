'use client';

import Counter from '@/components/counter';
import { selectUserAccount } from '@/store/user/userSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';

const fetcher = (access_token: string) => (url: string) => fetch(url, {
  headers: {
    'Authorization': `Bearer ${access_token}`
  },
  credentials: "include"
}).then(response => response.json())

const Page = () => {
  const user = useSelector(selectUserAccount);
  const { data, error, isLoading } = useSWR("http://localhost:8080/api/v1/authcheck", fetcher(user.access_token));

  if (error) {
    return <>{`Error fetching user authorization status: ${error}`}</>
  } else if (isLoading) {
    return <>Checking user authorization...</>
  }

  return (
    <>
      <Counter/>
    </>
  )
}

export default Page;