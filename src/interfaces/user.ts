export type LikedThreads = { [thread_id: number]: number };
export type LikedComments = { [comment_id: number]: number };
export type WrittenThreads = { [thread_id: number]: number };
export type WrittenComments = { [comment_id: number]: number };

export type UUID = string;

export interface UserAccount {
  id?: UUID;
  username?: string;
}

export interface UserProfile {
  profile_picture_path: string;
  biodata: string;
  email: string;
  post_count: number;
  comment_count: number;
  preferred_lang: 'en' | 'id' | 'ja';
  preferred_theme: 'light' | 'dark' | 'auto';
  creation_date: string;
  last_login: string;
}

export interface User {
  account: UserAccount;
  profile: UserProfile;
  liked_threads: LikedThreads;
  liked_comments: LikedComments;
  threads: WrittenThreads;
  comments: WrittenComments;
}

export interface UserLikes {
  threads: LikedThreads;
  comments: LikedComments;
}
