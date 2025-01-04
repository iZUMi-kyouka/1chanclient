'use client';

import useSWR from "swr";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser, UserAccount } from "@/store/user/userSlice";
import { AppDispatch } from "@/store/store";
import { Typography } from "@mui/material";

// const fetcher = (url: string) => fetch(url, {
//     method: "GET",
//     headers: {
//         'Device-ID': localStorage.getItem('deviceID') || ''
//     },
//     credentials: 'include'
// }).then((res) => res.json());

export default function FetchUserData() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchFunction = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/users/refresh_new', {
                method: 'GET',
                headers: {
                    'Device-ID': localStorage.getItem('deviceID') || ''
                },
                credentials: 'include'
            });

            const data = await response.json();

            dispatch(
                updateUser({
                account: {
                    id: data.account.id,
                    username: data.account.username,
                    access_token: data.account.access_token,
                },
                profile: {
                    profile_photo_path: '',
                    biodata: '',
                    email: '',
                    post_count: 0,
                    comment_count: 0,
                    preferred_lang: 'id',
                    preferred_theme: 'auto',
                    creation_date: '',
                    last_login: '',
                },
                })
            );
        } catch (err: any) {
            console.log("error during login: ", err.message);
        } 
    }

    fetchFunction();
  });

  return <></>
}
