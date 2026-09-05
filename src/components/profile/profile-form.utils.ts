import { UUID } from "../../lib/utils";
import type {
  AiProfilePreview,
  CreateProfilePayload,
  ProfileExperience,
  ProfileReference,
  ProfileSkill,
  SkillOption,
} from "../../types/profile.types";

export type CreateProfileFormState = {
  title: string;
  bio_description: string;
  profile_image_path: string | null;
  skills: ProfileSkill[];
  experiences: ProfileExperience[];
  references: ProfileReference[];
};

export function createEmptyProfileFormState(): CreateProfileFormState {
  return {
    title: "",
    bio_description: "",
    profile_image_path: null,
    skills: [],
    experiences: [],
    references: [],
  };
}

export function createEmptyExperience(): ProfileExperience {
  return {
    id: UUID(),
    profile_id: "",
    company_name: "",
    company_location: "",
    position_title: "",
    start_date: "",
    end_date: null,
    is_current: false,
    description: "",
    status: "active",
  };
}

export function createEmptyReference(): ProfileReference {
  return {
    id: UUID(),
    profile_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    position_title: "",
    status: "active",
  };
}

function splitReferenceName(name: string) {
  const [firstName = "", ...rest] = name.trim().split(/\s+/);

  return {
    first_name: firstName,
    last_name: rest.join(" "),
  };
}

function normalizeDate(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function mapAiProfileToFormState(
  profile: AiProfilePreview,
  skillOptions: SkillOption[],
): {
  form: CreateProfileFormState;
  unmatchedSkills: string[];
} {
  const skillMap = new Map(
    skillOptions.map((skill) => [skill.id, skill]),
  );

  const matchedSkills: ProfileSkill[] = [];
  const unmatchedSkills: string[] = [];

  for (const skill of profile.skills) {
    const matched = skillMap.get(skill.skill_id);

    if (!matched) {
      unmatchedSkills.push(`${skill.name} (${skill.skill_id})`);
      continue;
    }

    matchedSkills.push({
      id: skill.skill_id,
      name: matched.name,
      short_key: matched.short_key,
      level: Math.min(5, Math.max(1, skill.level)),
      status: "active",
    });
  }

  return {
    form: {
      title: profile.title,
      bio_description: profile.bio_description,
      profile_image_path: null,
      skills: matchedSkills,
      experiences: profile.experiences.map((experience) => ({
        id: UUID(),
        profile_id: "",
        company_name: experience.company ?? "",
        company_location: "",
        position_title: experience.role,
        start_date: normalizeDate(experience.startDate),
        end_date: experience.isCurrent ? null : normalizeDate(experience.endDate),
        is_current: experience.isCurrent,
        description: experience.description,
        status: "active",
      })),
      references: profile.references.map((reference) => {
        const { first_name, last_name } = splitReferenceName(reference.name);

        return {
          id: UUID(),
          profile_id: "",
          first_name,
          last_name,
          email: reference.email ?? "",
          phone: "",
          company_name: reference.company ?? "",
          position_title: reference.title ?? "",
          status: "active",
        };
      }),
    },
    unmatchedSkills,
  };
}

export function mapAiProfileToCreatePayload(
  profile: AiProfilePreview,
  skillOptions: SkillOption[],
): {
  payload: CreateProfilePayload;
  unmatchedSkills: string[];
} {
  const { form, unmatchedSkills } = mapAiProfileToFormState(profile, skillOptions);

  return {
    payload: mapFormStateToCreatePayload(form),
    unmatchedSkills,
  };
}

export function mapFormStateToCreatePayload(
  form: CreateProfileFormState,
): CreateProfilePayload {
  return {
    title: form.title.trim(),
    bio_description: form.bio_description.trim(),
    profile_image_path: form.profile_image_path?.trim() || null,
    skills: form.skills.map((skill) => ({
      skill_id: skill.id,
      level: skill.level,
    })),
    experiences: form.experiences
      .filter(
        (experience) =>
          experience.company_name.trim() &&
          experience.position_title.trim() &&
          experience.start_date,
      )
      .map((experience) => ({
        company_name: experience.company_name.trim(),
        company_location: experience.company_location?.trim() || null,
        position_title: experience.position_title.trim(),
        start_date: experience.start_date.slice(0, 10),
        end_date: experience.is_current
          ? null
          : experience.end_date?.slice(0, 10) || null,
        is_current: experience.is_current,
        description: experience.description?.trim() || null,
      })),
    references: form.references
      .filter((reference) => reference.first_name.trim() && reference.last_name.trim())
      .map((reference) => ({
        first_name: reference.first_name.trim(),
        last_name: reference.last_name.trim(),
        email: reference.email?.trim() || null,
        phone: reference.phone?.trim() || null,
        company_name: reference.company_name?.trim() || null,
        position_title: reference.position_title?.trim() || null,
      })),
  };
}
