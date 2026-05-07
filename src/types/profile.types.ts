// profile.types.ts

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface ProfileImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface ProfileSkill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface ProfileExperience {
  id: string;
  role: string;
  company: string;

  // API'den string geleceği için string tanımlıyoruz
  startDate: string;
  endDate: string | null;

  isCurrent: boolean;
  description: string;
}

export interface ProfileReference {
  referenceId?: string;
  name: string;
  email: string;
  title?: string;
  company?: string;
}

export interface Profile {
  _id: string;

  userId: string;
  email: string;

  firstName: string;
  lastName: string;

  title: string;
  description?: string;

  profileImage?: ProfileImage;

  skills: ProfileSkill[];
  experiences: ProfileExperience[];
  references: ProfileReference[];

  createdAt: string;
  updatedAt: string;
}

export interface GetProfileResponse {
  data: Profile;
}

 export type UserProfileHeader = Pick<
  Profile,
  "firstName" | "lastName" | "title" | "description"
> | null;