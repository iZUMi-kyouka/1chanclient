'use client';

import useSWR from "swr";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateLike, updateUser } from "@/store/user/userSlice";
import { LikedThreads } from "@/interfaces/user";
import { AppDispatch } from "@/store/store";
import { Typography } from "@mui/material";
import { updateAccessToken } from "@/store/auth/authSlice";
import { customFetch } from "@/utils/customFetch";
import { BASE_API_URL } from "@/app/layout";

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
            let response = await fetch('http://localhost:8080/api/v1/users/refresh_new', {
                method: 'GET',
                headers: {
                    'Device-ID': localStorage.getItem('deviceID') || ''
                },
                credentials: 'include'
            });

            const data = await response.json();

            dispatch(updateAccessToken(data.account.access_token));

            dispatch(
                updateUser({
                account: {
                    id: data.account.id,
                    username: data.account.username,
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

            response = await customFetch(`${BASE_API_URL}/users/likes`, {
              method: 'GET'
            });
      
            if (response.ok) {
              const likes = await response.json() as LikedThreads;
              dispatch(updateLike(likes));
            } else {
              throw new Error('Failed to fetch liked threads.')
            }  
        } catch (err: any) {
            console.log("error during login: ", err.message);
        }

        
    }

    fetchFunction();
  });

  return <></>
}
