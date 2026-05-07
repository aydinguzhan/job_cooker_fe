export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  user_id: string;

  title: string;
  content: string;

  status: PostStatus;

  created_at: string;
  updated_at: string;
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