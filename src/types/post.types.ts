export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  user_id: string;
  full_name: string;
  title: string;
  content: string;

  status: PostStatus;

  created_at: string;
  updated_at: string;
  islike: boolean;
  comment_count:number
}

export interface PostDetail {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  full_name?: string;
  like_count?: number;
  comment_count?: number;
  is_liked?: boolean;
}

export interface PostComment {
  id?: string;
  post_id: string;
  user_id: string;
  full_name?: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface GetPostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface PostModel {
  id: string;
  userId: string;

  title: string;
  content: string;

  status: PostStatus;

  createdAt: string;
  updatedAt: string;
}

export interface PostCreatePayload {
  title: string;
  content: string;
}

export interface PostLike {
  user_id: string;
  post_id: string;
}


export interface CommentPayload{
  post_id :string;
  content :string
}
