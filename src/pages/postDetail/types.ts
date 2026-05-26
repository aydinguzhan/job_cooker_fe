export type PostDetail = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  full_name: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  full_name: string;
  created_at: string;
};