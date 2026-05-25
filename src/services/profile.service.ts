import apiClient from "../lib/axios";
import type {
  AiProfilePreview,
  CreateProfilePayload,
  Profile,
  UpdateProfileExperiencesPayload,
  UpdateProfileReferencesPayload,
  UpdateProfileSkillsPayload,
  UserProfilesInfo,
} from "../types/profile.types";

export async function getUserProfile(): Promise<Profile> {
  const { data } = await apiClient.get(`/profile`);
  return data.data;
}

export async function createProfile(payload: CreateProfilePayload) {
  const { data } = await apiClient.post("/profile", payload);
  return data.data;
}

export async function updatedUserInfo(payload: UserProfilesInfo) {
  const { data } = await apiClient.put("/profile/userInfo", payload);
  return data.data;
}

export async function updateProfileSkills(payload: UpdateProfileSkillsPayload) {
  const { data } = await apiClient.put("/profile/skills", payload);
  return data.data;
}

export async function updateProfileReferences(
  payload: UpdateProfileReferencesPayload,
) {
  const { data } = await apiClient.put("/profile/referances", payload);
  return data.data;
}
export async function updateProfileExperiences(
  payload: UpdateProfileExperiencesPayload,
) {
  const { data } = await apiClient.put("/profile/experiences", payload);
  return data.data;
}

export async function generateAiProfile(prompt: string): Promise<AiProfilePreview> {
  const { data } = await apiClient.post("/profile/ai-generated", {
    prompt,
  });

  return data.data;
}
