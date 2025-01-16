export type LikedThreads = {[thread_id: number]: number | undefined}
export type UUID = string;

export interface UserAccount {
  id?: UUID,
  username?: string,
}

export interface UserProfile {
  profile_photo_path: string,
  biodata: string,
  email: string,
  post_count: number,
  comment_count: number,
  preferred_lang: "en" | "id" | "ja",
  preferred_theme: "light" | "dark" | "auto",
  creation_date: string,
  last_login: string
}

export interface User {
  account: UserAccount,
  profile: UserProfile,
  liked_threads: LikedThreads
}
