import PaginatedResponse from "./paginatedResponse"
import Comment from "./comment"

export interface Thread {
  id: number,
  username: string,
  user_profile_path?: string,
  title: string,
  original_post: string,
  creation_date: Date,
  updated_date?: Date,
  last_comment_date?: Date,
  like_count: number,
  dislike_count: number,
  comment_count: number,
  likeStatus?: number,
  view_count: number,
}

export interface ThreadViewResponse {
  thread: Thread,
  comments: PaginatedResponse<Comment>
}