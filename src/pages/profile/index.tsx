import { useEffect, useState } from "react";
import JobCookerLoader from "../../components/ui/Loader";
import {
  getUserProfile,
  updatedUserInfo,
  updateProfileExperiences,
  updateProfileReferences,
  updateProfileSkills,
} from "../../services/profile.service";
import type {
  Profile as ProfileType,
  SkillOption,
} from "../../types/profile.types";
import ProfileHeaderCard from "./particals/ProfileHeader";
import SkillsCard from "./particals/SkillsCard";
import ExperiencesCard from "./particals/ExperiencesCard";
import ReferencesCard from "./particals/ReferencesCard";
import EmptyProfileCard from "./particals/EmptyProfileCard";
import { getSkills } from "../../services/global.service";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<
    "header" | "skills" | "experiences" | "references" | null
  >(null);
  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);

  useEffect(() => {
    async function fetchPageData() {
      try {
        setIsLoading(true);

        const [profileData, skillsData] = await Promise.all([
          getUserProfile(),
          getSkills(),
        ]);

        setProfile(profileData);
        setSkillOptions(skillsData);
      } catch (error) {
        console.error("Profile page data fetch error:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }

    fetchPageData();
  }, []);

  if (isLoading) return <JobCookerLoader />;

  if (!profile) return <EmptyProfileCard />;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
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
