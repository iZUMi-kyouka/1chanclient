import { BASE_API_URL } from '@/app/[locale]/layout';
import {
  resetAuth,
  setIsRefreshing,
  updateAccessToken,
} from '@/store/auth/authSlice';
import {
  resetUser
} from '@/store/user/userSlice';
import { store } from '../store/store';

/**
 * Stores the current access token refresh operation, if any, as a flag
 * to prevent multiple access token refresh
 */
let refreshAccessTokenPromise: Promise<string> | null = null;

/**
 * A fetcher function to be used with useSWR for requests that do not require authentication.
 * @param {RequestInit?} options
 * @returns {Promise<Void>}
 */
export const generalFetch = (options?: RequestInit) => (url: string) =>
  fetch(url, options).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`${response.status}`);
    }
  });

/**
 * A fetcher function for requests that require authentication. This function automatically
 * sets the "Authorization" header and perform access token refresh if it is expired, before
 * retrying the request that failed due to expired access token.
 * @param {string} url
 * @param {RequestInit?} options
 * @returns {Promise<Response>}
 */
export async function customFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  // Dispatch hook cannot be used since this is not a function component body
  const state = store.getState();
  const isRefreshing = state.auth.isRefreshing;

  const fetchWithIntercept = async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${store.getState().auth.accessToken}`,
      },
    });

    // Access token has expired
    if (response.status === 401) {
      // No access token refresh request in progress, send request
      if (!isRefreshing) {
        store.dispatch(setIsRefreshing(true));

        try {
          // Set the global access token refresh promise
          refreshAccessTokenPromise = fetch(`${BASE_API_URL}/users/refresh`, {
            ...options,
            method: 'GET',
            credentials: 'include', // include the refresh token
            headers: {
              ...options?.headers,
              'Device-ID': store.getState().auth.deviceID,
            },
            body: null, // ensure that body is null since this is a 'GET' request
          }).then(async (refreshResponse) => {
            if (!refreshResponse.ok) {
              // Token refresh failed. Reset all user and auth state, and prompt user to relogin.
              store.dispatch(resetUser());
              store.dispatch(resetAuth());
              alert('Your session has expired. Please login again.');
              throw new Error('refresh token expired');
            }

            const data: { access_token: string } = await refreshResponse.json();
            store.dispatch(updateAccessToken(data.access_token));
            return data.access_token;
          });

          await refreshAccessTokenPromise;

      
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_err) {
        } finally {
          // Reset flag variables
          store.dispatch(setIsRefreshing(false));
          refreshAccessTokenPromise = null;
        }
      }

      // An access token refresh is already in progerss. Await the new access token.
      await refreshAccessTokenPromise;

      // Retry the request that failed with 401
      const newAccessToken = store.getState().auth.accessToken;
      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }

    // If request is success, return the response immediately
    return response;
  };

  return fetchWithIntercept();
}
