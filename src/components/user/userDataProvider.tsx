'use client';

import { BASE_API_URL } from '@/app/[locale]/layout';
import { UserLikes, WrittenComments, WrittenThreads } from '@/interfaces/user';
import { openSnackbarWithMessage, setLocale, SupportedLanguages } from '@/store/appState/appStateSlice';
import { updateAccessToken } from '@/store/auth/authSlice';
import { AppDispatch } from '@/store/store';
import {
  updateCommentLike,
  updateThreadLike,
  updateUser,
  updateWrittenComments,
  updateWrittenThreads,
} from '@/store/user/userSlice';
import { customFetch } from '@/utils/customFetch';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function FetchUserData({ locale }: { locale: SupportedLanguages}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setLocale(locale));

    const fetchFunction = async () => {
      try {
        let response = await fetch(`${BASE_API_URL}/users/refresh_new`, {
          method: 'GET',
          headers: {
            'Device-ID': localStorage.getItem('deviceID') || '',
          },
          credentials: 'include',
        });
        
        if (response.status === 401) {
          // dispatch(openSnackbarWithMessage('You may be offline.'));
          return;
        }

        if (!response.ok) {
          dispatch(openSnackbarWithMessage('You mau be offline. Check your internet connection.'))
          return;
        }
        
        const data = await response.json();

        dispatch(updateAccessToken(data.account.access_token));

        dispatch(
          updateUser({
            account: {
              id: data.account.id,
              username: data.account.username,
            },
            profile: data.profile,
          })
        );

        response = await customFetch(`${BASE_API_URL}/users/likes`, {
          method: 'GET',
        });

        if (response.ok) {
          const likes = (await response.json()) as UserLikes;
          dispatch(updateThreadLike(likes.threads));
          dispatch(updateCommentLike(likes.comments));
        } else {
          throw new Error('failed to fetch liked threads.');
        }

        response = await customFetch(`${BASE_API_URL}/users/threads`, {
          method: 'GET',
        });

        if (response.ok) {
          const threads = (await response.json()) as WrittenThreads;
          dispatch(updateWrittenThreads(threads));
        } else {
          throw new Error('failed to fetch written threads.');
        }

        response = await customFetch(`${BASE_API_URL}/users/comments`, {
          method: 'GET',
        });

        if (response.ok) {
          const comments = (await response.json()) as WrittenComments;
          dispatch(updateWrittenComments(comments));
        } else {
          throw new Error('failed to fetch written threads.');
        }
      } catch (err) {
        if ((err as Error).name === 'TypeError') {
          alert(
            '1chan is currently unavailable or your internet connection may be unstable.'
          );
        }

        console.log('error during login: ', err);
      }
    };

    fetchFunction();
  });

  return <></>;
}
