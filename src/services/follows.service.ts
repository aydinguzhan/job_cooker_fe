import apiClient from "../lib/axios";
import type { FollowUser } from "../types/follow.types";

export async function getFollowSuggestions(): Promise<FollowUser[]> {
  const { data } = await apiClient.get("/follows/suggestions");
  return data.data;
}

export async function getFollowers(): Promise<FollowUser[]> {
  const { data } = await apiClient.get("/follows/followers");
  return data.data;
}

export async function getFollowings(): Promise<FollowUser[]> {
  const { data } = await apiClient.get("/follows/followings");
  return data.data;
}

export async function followUser(followingId: string) {
  const { data } = await apiClient.post(`/follows/${followingId}`);
  return data.data;
}

export async function unfollowUser(followingId: string) {
  const { data } = await apiClient.delete(`/follows/${followingId}`);
  return data.data;
}
