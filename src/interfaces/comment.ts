export default interface Comment {
  id: number,
  username: string,
  user_profile_path?: string,
  comment: string,
  creation_date: string,
  updated_date: string,
  like_count: number,
  dislike_count: number
}