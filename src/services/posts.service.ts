import apiClient from "../lib/axios";

export async function getPostsFromUser() {
  const response = await apiClient.get(`/posts`);
  return response.data.data;
}
