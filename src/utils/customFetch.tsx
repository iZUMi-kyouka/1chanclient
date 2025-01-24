import { BASE_API_URL } from "@/app/layout";
import { UserLikes, WrittenComments, WrittenThreads } from "@/interfaces/user";
import { resetAuth, setIsRefreshing, updateAccessToken } from "@/store/auth/authSlice";
import { resetUser, updateCommentLike, updateThreadLike, updateWrittenComments, updateWrittenThreads } from "@/store/user/userSlice";
import { store } from "../store/store";

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
export const generalFetch = (options?: RequestInit) => (url: string) => fetch(url, options).then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`${response.status}`)
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
export async function customFetch(url: string, options?: RequestInit): Promise<Response> {
  // Dispatch hook cannot be used since this is not a function component body
  const state = store.getState();
  const isRefreshing = state.auth.isRefreshing;

  const fetchWithIntercept = async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${store.getState().auth.accessToken}`
      },
    });

    // Access token has expired
    if (response.status === 401) {

      // No access token refresh request in progress, send request 
      if (!isRefreshing) {
        store.dispatch(setIsRefreshing(true));

        try {
          // Set the global access token refresh promise
          refreshAccessTokenPromise = fetch(
            "http://localhost:8080/api/v1/users/refresh",
            {
              ...options,
              method: 'GET',
              credentials: 'include', // include the refresh token
              headers: {
                ...options?.headers,
                'Device-ID': store.getState().auth.deviceID
              },
              body: null // ensure that body is null since this is a 'GET' request
            }
          ).then(async (refreshResponse) => {
            if (!refreshResponse.ok) {
              // Token refresh failed. Reset all user and auth state, and prompt user to relogin.
              store.dispatch(resetUser());
              store.dispatch(resetAuth());
              alert("Your session has expired. Please login again.");
              throw new Error("refresh token expired");
            }

            const data: { access_token: string } = await refreshResponse.json();
            store.dispatch(updateAccessToken(data.access_token));
            console.log(`Obtained new access token: ${data.access_token}`);
            return data.access_token;
          });
          
          await refreshAccessTokenPromise;

          // Refresh user metadata (likes, dislikes, owned threads and comments)
          let response = await customFetch(`${BASE_API_URL}/users/likes`, {
            method: 'GET'
          });

          if (response.ok) {
            const likes = await response.json() as UserLikes;
            store.dispatch(updateThreadLike(likes.threads));
            store.dispatch(updateCommentLike(likes.comments));
          } else {
            throw new Error('failed to fetch liked threads')
          }

          response = await customFetch(`${BASE_API_URL}/users/threads`, {
            method: 'GET'
          });

          if (response.ok) {
            const threads = await response.json() as WrittenThreads;
            store.dispatch(updateWrittenThreads(threads));
          } else {
            throw new Error('failed to fetch written threads.')
          }

          response = await customFetch(`${BASE_API_URL}/users/comments`, {
            method: 'GET'
          });
          if (response.ok) {
            const comments = await response.json() as WrittenComments;
            store.dispatch(updateWrittenComments(comments));
          } else {
            throw new Error('failed to fetch written comments.')
          }
        } catch (err) {
          console.log(`an error occurred in making auth-required request: ${err}`);
        } finally {
          // Reset flag variables
          store.dispatch(setIsRefreshing(false));
          refreshAccessTokenPromise = null;
        }
      }

      // An access token refresh is already in progerss. Await the new access token.
      await refreshAccessTokenPromise;

      // Retry the request that failed with 401
      console.log(`retrying auth-protected route using new access token: ${store.getState().auth.accessToken}`);
      const newAccessToken = store.getState().auth.accessToken;
      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          'Authorization': `Bearer ${newAccessToken}`,
        },
      });
    }

    // If request is success, return the response immediately
    return response;
  }

  return fetchWithIntercept();
}