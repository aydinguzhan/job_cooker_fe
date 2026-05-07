import { userInfo } from "../lib/auth";
import apiClient from "../lib/axios";
import type {  Profile } from "../types/profile.types";

export async function getUserProfile(): Promise<Profile> {
  const { userId } =  userInfo();
  const { data } = await apiClient.get(`/profile/${userId}`);
  return data.data;
};
