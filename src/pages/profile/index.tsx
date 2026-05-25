import { useEffect, useState } from "react";
import JobCookerLoader from "../../components/ui/Loader";
import {
  createProfile,
  generateAiProfile,
  getUserProfile,
  updatedUserInfo,
  updateProfileExperiences,
  updateProfileReferences,
  updateProfileSkills,
} from "../../services/profile.service";
import type {
  AiProfilePreview,
  Profile as ProfileType,
  SkillOption,
} from "../../types/profile.types";
import ProfileHeaderCard from "./particals/ProfileHeader";
import SkillsCard from "./particals/SkillsCard";
import ExperiencesCard from "./particals/ExperiencesCard";
import ReferencesCard from "./particals/ReferencesCard";
import EmptyProfileCard from "./particals/EmptyProfileCard";
import { getSkills } from "../../services/global.service";
import AiProfileGenerateModal from "../../components/layout/AiProfileGenerateModal";
import AiButton from "../../components/layout/AiButton";
import ProfileCreateForm from "../../components/profile/ProfileCreateForm";
import {
  mapAiProfileToCreatePayload,
  mapAiProfileToFormState,
} from "../../components/profile/profile-form.utils";

export default function Profile() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isApplyingAiProfile, setIsApplyingAiProfile] = useState(false);
  const [aiDraft, setAiDraft] = useState<AiProfilePreview | null>(null);
  const [editingSection, setEditingSection] = useState<
    "header" | "skills" | "experiences" | "references" | null
  >(null);
  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);

  useEffect(() => {
    async function fetchPageData() {
      try {
        setIsLoading(true);
        const [profileResult, skillsResult] = await Promise.allSettled([
          getUserProfile(),
          getSkills(),
        ]);

        if (profileResult.status === "fulfilled") {
          setProfile(profileResult.value);
        } else {
          console.error("Profile fetch error:", profileResult.reason);
          setProfile(null);
        }

        if (skillsResult.status === "fulfilled") {
          setSkillOptions(Array.isArray(skillsResult.value) ? skillsResult.value : []);
        } else {
          console.error("Skills fetch error:", skillsResult.reason);
          setSkillOptions([]);
        }
      } catch (error) {
        console.error("Profile page data fetch error:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    }

    fetchPageData();
  }, []);

  useEffect(() => {
    async function ensureSkillsLoaded() {
      if (skillOptions.length > 0) return;

      try {
        const skills = await getSkills();
        setSkillOptions(Array.isArray(skills) ? skills : []);
      } catch (error) {
        console.error("Skills reload error:", error);
      }
    }

    if (isCreateMode) {
      ensureSkillsLoaded();
    }
  }, [isCreateMode, skillOptions.length]);

  if (isLoading) return <JobCookerLoader />;

  async function handleGenerateProfile(prompt: string) {
    const nextAiDraft = await generateAiProfile(prompt);
    setAiDraft(nextAiDraft);
    return nextAiDraft;
  }

  async function handleCreateProfile(payload: Parameters<typeof createProfile>[0]) {
    try {
      setIsCreatingProfile(true);
      const createdProfile = await createProfile(payload);
      setProfile(createdProfile);
      setIsCreateMode(false);
      setAiDraft(null);
    } finally {
      setIsCreatingProfile(false);
    }
  }

  async function handleUseAiProfile(aiProfile: AiProfilePreview) {
    setAiDraft(aiProfile);
    setIsAiModalOpen(false);

    if (skillOptions.length === 0) {
      setIsCreateMode(true);
      return;
    }

    try {
      setIsApplyingAiProfile(true);

      if (!profile) {
        const { payload } = mapAiProfileToCreatePayload(aiProfile, skillOptions);
        const createdProfile = await createProfile(payload);
        setProfile(createdProfile);
        setIsCreateMode(false);
        return;
      }

      const { form } = mapAiProfileToFormState(aiProfile, skillOptions);

      await updatedUserInfo({
        title: form.title,
        bio_description: form.bio_description,
        profile_image_path: profile.profile_image_path,
      });
      await updateProfileSkills({
        skills: form.skills.map((skill) => ({
          skill_id: skill.id,
          level: skill.level,
        })),
      });
      await updateProfileReferences({
        references: form.references.map((reference) => ({
          first_name: reference.first_name,
          last_name: reference.last_name,
          email: reference.email?.trim() || null,
          phone: reference.phone?.trim() || null,
          company_name: reference.company_name?.trim() || null,
          position_title: reference.position_title?.trim() || null,
        })),
      });
      await updateProfileExperiences({
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
      });

      const refreshedProfile = await getUserProfile();
      setProfile(refreshedProfile);
      setEditingSection(null);
    } catch (error) {
      console.error("AI profile apply error:", error);

      if (!profile) {
        setIsCreateMode(true);
      }
    } finally {
      setIsApplyingAiProfile(false);
    }
  }

  if (isLoading || isApplyingAiProfile) return <JobCookerLoader />;

  if (!profile && !isCreateMode) {
    return (
      <>
        <AiProfileGenerateModal
          open={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onGenerate={handleGenerateProfile}
          onUseProfile={handleUseAiProfile}
        />
        <EmptyProfileCard
          onCreateProfile={() => setIsCreateMode(true)}
          onOpenAiAssistant={() => setIsAiModalOpen(true)}
        />
      </>
    );
  }

  if (!profile && isCreateMode) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
        <AiProfileGenerateModal
          open={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onGenerate={handleGenerateProfile}
          onUseProfile={handleUseAiProfile}
        />

        <div className="mx-auto max-w-7xl">
          <ProfileCreateForm
            skillOptions={skillOptions}
            isSubmitting={isCreatingProfile}
            onSubmit={handleCreateProfile}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
            aiDraft={aiDraft}
            onAiDraftApplied={() => setIsAiModalOpen(false)}
          />
        </div>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <AiProfileGenerateModal
        open={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerate={handleGenerateProfile}
        onUseProfile={handleUseAiProfile}
      />
      <AiButton onClick={() => setIsAiModalOpen(true)} />
      <div className="mx-auto max-w-7xl space-y-6">
        <ProfileHeaderCard
          profile={profile}
          isEditing={editingSection === "header"}
          onEdit={() => setEditingSection("header")}
          onCancel={() => setEditingSection(null)}
          onSave={async (payload) => {
            const updatedProfile = await updatedUserInfo(payload);
            setProfile(updatedProfile);
            setEditingSection(null);
          }}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <SkillsCard
              skills={profile.skills ?? []}
              skillOptions={skillOptions}
              isEditing={editingSection === "skills"}
              onEdit={() => setEditingSection("skills")}
              onCancel={() => setEditingSection(null)}
              onSave={async (payload) => {
                console.log("skills update payload:", payload);
                setIsLoading(true);
                const profile = await updateProfileSkills({ skills: payload });
                setProfile(profile);
                setIsLoading(false);
                setEditingSection(null);
              }}
            />

            <ReferencesCard
              references={profile.references ?? []}
              isEditing={editingSection === "references"}
              onEdit={() => setEditingSection("references")}
              onCancel={() => setEditingSection(null)}
              onSave={async (payload) => {
                setIsLoading(true);
                const updatedProfile = await updateProfileReferences(payload);
                setProfile(updatedProfile);
                setIsLoading(false);
                setEditingSection(null);
              }}
            />
          </aside>

          <section className="min-w-0">
            <ExperiencesCard
              experiences={profile.experiences ?? []}
              isEditing={editingSection === "experiences"}
              onEdit={() => setEditingSection("experiences")}
              onCancel={() => setEditingSection(null)}
              onSave={async (payload) => {
                const updatedProfile = await updateProfileExperiences(payload);
                setProfile(updatedProfile);
                setEditingSection(null);
              }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
