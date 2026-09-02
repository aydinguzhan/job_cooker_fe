import apiClient from "../lib/axios";
import type { SkillOption } from "../types/profile.types";

export async function getSkills(): Promise<SkillOption[]> {
  const { data } = await apiClient.get("/refdatas/skills");
  return data.data
}
export async function getSkillsSearch(query: string): Promise<SkillOption[]> {
  if (query.trim() === '' || query.trim().length < 2 || query.includes(' ')) {
    return []
  }
  const { data } = await apiClient.get(`/refdatas/skills-search?skill=${query}`);
  return data.data
}