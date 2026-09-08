export type ProfileSkill = {
  id: string;
  name: string;
  short_key: string;
  level: number;
  status: string;
};

export type ProfileExperience = {
  id: string;
  profile_id: string;
  company_name: string;
  company_location: string | null;
  position_title: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  status: string;
};

export type ProfileReference = {
  id: string;
  profile_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  position_title: string | null;
  status: string;
};

export type Profile = {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  title: string;
  bio_description: string | null;
  profile_image_path: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  skills: ProfileSkill[];
  experiences: ProfileExperience[];
  references: ProfileReference[];
};

export type CreateProfilePayload = {
  title: string;
  bio_description: string;
  profile_image_path?: string | null;

  skills: {
    skill_id: string;
    level: number;
  }[];

  experiences: {
    company_name: string;
    company_location?: string | null;
    position_title: string;
    start_date: string;
    end_date?: string | null;
    is_current: boolean;
    description?: string | null;
  }[];

  references: {
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    position_title?: string | null;
  }[];
};

export type AiProfileSkill = {
  skill_id: string;
  name: string;
  short_key: string;
  level: number;
};

export type AiProfileExperience = {
  role: string;
  company: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
};

export type AiProfileReference = {
  name: string;
  email: string | null;
  title: string | null;
  company: string | null;
};

export type AiProfilePreview = {
  title: string;
  bio_description: string;
  skills: AiProfileSkill[];
  experiences: AiProfileExperience[];
  references: AiProfileReference[];
};

export type UserProfilesInfo = {
  title: string;
  bio_description: string;
  profile_image_path?: string | null;
};
export type UpdateProfileSkillsPayload = {
  skills: {
    skill_id: string;
    level: number;
  }[];
};
export type UpdateProfileReferencesPayload = {
  references: {
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    position_title?: string | null;
  }[];
};

export type UpdateProfileExperiencesPayload = {

  experiences: {
    company_name: string;
    company_location?: string | null;
    position_title: string;
    start_date: string;
    end_date?: string | null;
    is_current: boolean;
    description?: string | null;
  }[];
};

export type Option = {
  id: string;
  name: string;
  short_key: string;
};
