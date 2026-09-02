import { Check, Pencil, Star, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProfileSkill, SkillOption } from "../../../types/profile.types";
import SkillsDropdown from "../../../components/ui/SkillsDropDown";

type Props = {
  skills: ProfileSkill[];
  skillOptions: SkillOption[];
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (
    skills: {
      skill_id: string;
      level: number;
    }[],
  ) => void;
};

export default function SkillsCard({
  skills,
  skillOptions,
  isEditing,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  const [localSkills, setLocalSkills] = useState<ProfileSkill[]>(skills);
  const [selectedSkills, setSelectedSkills] = useState<SkillOption[]>([]);

  const selectedSkillIds = useMemo(
    () => new Set(selectedSkills.map((skill) => skill.id)),
    [selectedSkills],
  );

  function mapSkillsToOptions(items: ProfileSkill[]): SkillOption[] {
    return items.map((skill) => ({
      id: skill.id,
      name: skill.name,
      short_key: skill.short_key,
    }));
  }

  function handleEdit() {
    setLocalSkills(skills);
    setSelectedSkills(mapSkillsToOptions(skills));
    onEdit();
  }

  function handleCancel() {
    setLocalSkills(skills);
    setSelectedSkills(mapSkillsToOptions(skills));
    onCancel();
  }

  function removeSkill(skillId: string) {
    setSelectedSkills((prev) => prev.filter((skill) => skill.id !== skillId));
    setLocalSkills((prev) => prev.filter((skill) => skill.id !== skillId));
  }

  function handleDropdownChange(nextSelectedSkills: SkillOption[]) {
    setSelectedSkills(nextSelectedSkills);

    setLocalSkills((prev) => {
      const prevMap = new Map(prev.map((skill) => [skill.id, skill]));

      return nextSelectedSkills.map((skill) => {
        const existing = prevMap.get(skill.id);

        return {
          id: skill.id,
          name: skill.name,
          short_key: skill.short_key,
          level: existing?.level ?? 3,
          status: existing?.status ?? "active",
        };
      });
    });
  }

  function changeLevel(skillId: string, level: number) {
    setLocalSkills((prev) =>
      prev.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              level,
            }
          : skill,
      ),
    );
  }

  function handleSave() {
    const payload = localSkills
      .filter((skill) => selectedSkillIds.has(skill.id))
      .map((skill) => ({
        skill_id: skill.id,
        level: skill.level,
      }));

    onSave(payload);
  }

  const visibleSkills = isEditing ? localSkills : skills;

  return (
    <section className="rounded-xl border border-app bg-surface p-5 shadow-surface">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-app">Skills</h2>
          <p className="text-sm text-soft">Your technical stack</p>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-app p-2 text-muted hover:bg-surface-strong hover:text-app"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-slate-900 p-2 text-white hover:bg-slate-800"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-xl border border-app p-2 text-muted hover:bg-surface-strong hover:text-app"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      {isEditing && (
        <div className="mb-4">
          <SkillsDropdown
            options={skillOptions}
            value={selectedSkills}
            onChange={handleDropdownChange}
            placeholder="Select skills..."
          />
        </div>
      )}

      <div className="space-y-3">
        {visibleSkills.length === 0 && (
          <p className="rounded-2xl bg-surface-muted p-4 text-sm text-soft">
            No skills added yet.
          </p>
        )}

        {visibleSkills.map((skill) => (
          <div
            key={skill.id}
            className="relative rounded-2xl border border-app bg-surface-muted p-4"
          >
            {isEditing && (
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="absolute right-3 top-3 rounded-xl bg-red-50 p-2 text-red-500 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <div className="flex items-center justify-between gap-3 pr-12">
              <div className="min-w-0">
                <p className="truncate font-semibold text-app">{skill.name}</p>
                <p className="text-xs text-soft">{skill.short_key}</p>
              </div>

              <div className="flex shrink-0 gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const level = index + 1;
                  const active = index < skill.level;

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => changeLevel(skill.id, level)}
                      className={
                        isEditing ? "cursor-pointer" : "cursor-default"
                      }
                    >
                      <Star
                        className={`h-4 w-4 ${
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-soft/40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
