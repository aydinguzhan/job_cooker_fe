import apiClient from "../lib/axios";
import type { SkillOption } from "../types/profile.types";

export async function getSkills():Promise<SkillOption[]>{
  const {data} = await apiClient.get("/refdatas/skills");
  return data.data
}