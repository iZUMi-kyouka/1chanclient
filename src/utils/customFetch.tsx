import { useSelector } from "react-redux";
import { store } from "../store/store";
import { updateAccessToken, setIsRefreshing, selectAccessToken } from "@/store/auth/authSlice";
import { RequestOptions } from "https";

let refreshAccessTokenPromise: Promise<string> | null = null;

export const generalFetch = (options?: RequestInit) => (url: string) => fetch(url, options).then(response => response.json());

export const customFetch = async (url: string, options?: RequestInit): Promise<Response> => {
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
                          credentials: 'include'
                        }
										).then(async (refreshResponse) => {
											if (!refreshResponse.ok) {
												throw new Error("Failed to refresh token.");
											}

											const data: { access_token: string } = await refreshResponse.json();
											store.dispatch(updateAccessToken(data.access_token));
											console.log(`Obtained new access token: ${data.access_token}`);
											return data.access_token;
										});


										await refreshAccessTokenPromise;
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