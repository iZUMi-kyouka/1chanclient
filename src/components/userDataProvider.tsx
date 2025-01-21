'use client';

import useSWR from "swr";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCommentLike, updateThreadLike, updateUser, updateWrittenComments, updateWrittenThreads } from "@/store/user/userSlice";
import { LikedThreads, UserLikes, WrittenComments, WrittenThreads } from "@/interfaces/user";
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
                profile: data.profile
                })
            );

            response = await customFetch(`${BASE_API_URL}/users/likes`, {
              method: 'GET'
            });
      
            if (response.ok) {
              const likes = await response.json() as UserLikes;
              dispatch(updateThreadLike(likes.threads));
              dispatch(updateCommentLike(likes.comments));
            } else {
              throw new Error('Failed to fetch liked threads.')
            }

            response = await customFetch(`${BASE_API_URL}/users/threads`, {
              method: 'GET'
            });
      
            if (response.ok) {
              const threads = await response.json() as WrittenThreads;
              dispatch(updateWrittenThreads(threads));
            } else {
              throw new Error('Failed to fetch written threads.')
            }
    
            response = await customFetch(`${BASE_API_URL}/users/comments`, {
              method: 'GET'
            });
    
            if (response.ok) {
              const comments = await response.json() as WrittenComments;
              dispatch(updateWrittenComments(comments));
            } else {
              throw new Error('Failed to fetch written threads.')
            }  
            
        } catch (err: any) {
            console.log("error during login: ", err.message);
        }

        
    }

    fetchFunction();
  });

  return <></>
}
