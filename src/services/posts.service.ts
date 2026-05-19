import apiClient from "../lib/axios";
import type {
  CommentPayload,
  PostCreatePayload,
  PostLike,
} from "../types/post.types";

export async function getPostsFromUser() {
  const user = localStorage.getItem("user");
  const { id } = user ? JSON.parse(user) : { id: null };
  const response = await apiClient.get(`/posts/${id}`);
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
export async function postLike(payload: PostLike) {
  const result = await apiClient.post("/posts/like/change", payload);
  return result;
}

export async function getAllComments(post_id: string) {
  const results = await apiClient.get(`/posts/comment/${post_id}`);
  return results.data;
}

export async function createComment(payload: CommentPayload) {
  const result = await apiClient.post("/posts/comment", payload);
  return result.data;
}
