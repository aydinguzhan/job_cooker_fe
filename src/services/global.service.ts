import apiClient from "../lib/axios";
import type { Option } from "../types/profile.types";

export async function getSkills(): Promise<Option[]> {
  const { data } = await apiClient.get("/refdatas/skills");
  return data.data
}
export async function getSkillsSearch(query: string): Promise<Option[]> {
  if (query.trim() === '' || query.trim().length < 2 || query.includes(' ')) {
    return []
  }
  const { data } = await apiClient.get(`/refdatas/skills-search?skill=${query}`);
  return data.data
}
export async function getCompanySearch(query: string): Promise<Option[]> {
  if (query.trim() === '' || query.trim().length < 2 || query.includes(' ')) {
    return []
  }
  const { data } = await apiClient.get(`/refdatas/companies-search?company=${query}`);
  return data.data
}