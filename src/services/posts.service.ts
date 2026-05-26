import apiClient from "../lib/axios";
import { userInfo } from "../lib/auth";
import type {
  CommentPayload,
  Post,
  PostComment,
  PostDetail,
  PostCreatePayload,
  PostLike,
} from "../types/post.types";

export async function getPostsFromUser() {
  const user = localStorage.getItem("user");
  const { id } = user ? JSON.parse(user) : { id: null };
  const response = await apiClient.get(`/posts/${id}`);
  return response.data.data;
}

export async function getDashboardFeed(limit = 20, offset = 0): Promise<Post[]> {
  const response = await apiClient.get("/dashboard", {
    params: {
      limit,
      offset,
    },
  });

  return response.data.data;
}

export async function getPostDetail(post_id: string): Promise<PostDetail> {
  const response = await apiClient.get(`/posts/detail/${post_id}`);
  return response.data.data;
}

export async function postCreate(payload: PostCreatePayload) {
  const user = localStorage.getItem("user");
  const { id } = user ? JSON.parse(user) : { id: null };
  if (id) {
    return await apiClient.post("/posts", { ...payload, user_id: id });
  }
  return { message: "User is not found." };
}

export async function postLike(post_id: string) {
  const currentUser = userInfo();

  if (!currentUser?.userId) {
    throw new Error("User is not found.");
  }

  const payload: PostLike = {
    user_id: currentUser.userId,
    post_id,
  };

  const result = await apiClient.post("/posts/like/change", payload);
  return result;
}

export async function getAllComments(post_id: string): Promise<PostComment[]> {
  const results = await apiClient.get(`/posts/comment/${post_id}`);
  return results.data.data ?? [];
}

export async function createComment(payload: CommentPayload): Promise<PostComment> {
  const result = await apiClient.post("/posts/comment", payload);
  return result.data.data;
}
