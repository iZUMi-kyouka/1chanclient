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
 * A fetcher function to be used with useSWR for requests that do not require authorisation.
 * @param {RequestInit?} options
 * @returns {Promise<Void>}
 */
export const generalFetch = (options?: RequestInit) => (url: string) => fetch(url, options).then(response => response.json());

/**
 * customFetch
 * @param {string} url 
 * @param {RequestInit?} options 
 * @returns 
 */
export async function customFetch(url: string, options?: RequestInit): Promise<Response> {
    // Do not use dispatch hook.
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

				if (response.status === 401) {

						// No token refresh request in progress, send request
						if (!isRefreshing) {
								store.dispatch(setIsRefreshing(true));

								try {
										refreshAccessTokenPromise = fetch(
												"http://localhost:8080/api/v1/users/refresh",
												{
                          ...options,
                          method: 'GET',
                          credentials: 'include',
                          headers: {
                            ...options?.headers,
                            'Device-ID': store.getState().auth.deviceID
                          },
                          body: null
                        }
										).then(async (refreshResponse) => {
											if (!refreshResponse.ok) {
                        store.dispatch(resetUser());
                        store.dispatch(resetAuth());
                        alert("Your session has expired. Please login again.");
												throw new Error("Failed to refresh token.");
											}

											const data: { access_token: string } = await refreshResponse.json();
											store.dispatch(updateAccessToken(data.access_token));
											console.log(`Obtained new access token: ${data.access_token}`);
											return data.access_token;
										});

										await refreshAccessTokenPromise;

                    let response = await customFetch(`${BASE_API_URL}/users/likes`, {
                      method: 'GET'
                    });
              
                    if (response.ok) {
                      const likes = await response.json() as UserLikes;
                      store.dispatch(updateThreadLike(likes.threads));
                      store.dispatch(updateCommentLike(likes.comments));
                    } else {
                      throw new Error('Failed to fetch liked threads.')
                    }
                  
                    response = await customFetch(`${BASE_API_URL}/users/threads`, {
                      method: 'GET'
                    });
              
                    if (response.ok) {
                      const threads = await response.json() as WrittenThreads;
                      store.dispatch(updateWrittenThreads(threads));
                    } else {
                      throw new Error('Failed to fetch written threads.')
                    }
            
                    response = await customFetch(`${BASE_API_URL}/users/comments`, {
                      method: 'GET'
                    });
            
                    if (response.ok) {
                      const comments = await response.json() as WrittenComments;
                      store.dispatch(updateWrittenComments(comments));
                    } else {
                      throw new Error('Failed to fetch written threads.')
                    }  
                    
								} catch (err: any) {
										store.dispatch(setIsRefreshing(false));
										refreshAccessTokenPromise = null;
										console.log(`Token refresh failed: ${err}`);
								} finally {
										store.dispatch(setIsRefreshing(false));
										refreshAccessTokenPromise = null;
								}
						} else if (refreshAccessTokenPromise) {
								await refreshAccessTokenPromise;
						}

						// Retry the request that failed with 401
						console.log(`Retrying auth-protected route using new access token: ${store.getState().auth.accessToken}`);
						const newAccessToken = store.getState().auth.accessToken;
            store.dispatch(setIsRefreshing(false));
						return fetch(url, {
							...options,
							headers: {
								...options?.headers,
								'Authorization': `Bearer ${newAccessToken}`,
							},
						});
				}

				return response;
		}

		return fetchWithIntercept();
}