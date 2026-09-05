import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ProfileExperience } from "../../../types/profile.types";
import { UUID } from "../../../lib/utils";

type ExperiencePayload = {
  company_name: string;
  company_location?: string | null;
  position_title: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
};

type Props = {
  experiences: ProfileExperience[];
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (payload: { experiences: ExperiencePayload[] }) => void;
};

const emptyExperience: ProfileExperience = {
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

function formatDate(date?: string | null) {
  if (!date) return "Present";

  return new Date(date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
  });
}

function formatInputDate(date?: string | null) {
  if (!date) return "";

  return date.slice(0, 10);
}

export default function ExperiencesCard({
  experiences,
  isEditing,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  const [localExperiences, setLocalExperiences] =
    useState<ProfileExperience[]>(experiences);

  function handleEdit() {
    setLocalExperiences(experiences);
    onEdit();
  }

  function handleCancel() {
    setLocalExperiences(experiences);
    onCancel();
  }

  function removeExperience(id: string) {
    setLocalExperiences((prev) => prev.filter((item) => item.id !== id));
  }

  function addExperience() {
    setLocalExperiences((prev) => [
      ...prev,
      {
        ...emptyExperience,
        id: UUID(),
      },
    ]);
  }

  function updateExperience(
    id: string,
    field: keyof ExperiencePayload,
    value: string | boolean | null,
  ) {
    setLocalExperiences((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              ...(field === "is_current" && value === true
                ? { end_date: null }
                : {}),
            }
          : item,
      ),
    );
  }

  function handleSave() {
    const payload = localExperiences
      .filter(
        (item) =>
          item.company_name.trim() &&
          item.position_title.trim() &&
          item.start_date,
      )
      .map((item) => ({
        company_name: item.company_name.trim(),
        company_location: item.company_location?.trim() || null,
        position_title: item.position_title.trim(),
        start_date: formatInputDate(item.start_date),
        end_date: item.is_current ? null : formatInputDate(item.end_date),
        is_current: item.is_current,
        description: item.description?.trim() || null,
      }));

    onSave({ experiences: payload });
  }

  const visibleExperiences = isEditing ? localExperiences : experiences;

  return (
    <section className="rounded-[2rem] border border-app bg-surface p-5 shadow-surface">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-app">Experiences</h2>
          <p className="text-sm text-soft">Career history and roles</p>
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

      <div className="space-y-4">
        {visibleExperiences.length === 0 && (
          <p className="rounded-2xl bg-surface-muted p-4 text-sm text-soft">
            No experiences added yet.
          </p>
        )}

        {visibleExperiences.map((exp) => (
          <article
            key={exp.id}
            className="relative rounded-3xl border border-app bg-surface-muted p-5"
          >
            {isEditing && (
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="absolute right-4 top-4 rounded-xl bg-red-50 p-2 text-red-500 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {isEditing ? (
              <div className="space-y-3 pr-12">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    value={exp.position_title}
                    onChange={(e) =>
                      updateExperience(exp.id, "position_title", e.target.value)
                    }
                    placeholder="Position title"
                    className="rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                  />

                  <input
                    value={exp.company_name}
                    onChange={(e) =>
                      updateExperience(exp.id, "company_name", e.target.value)
                    }
                    placeholder="Company name"
                    className="rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                  />
                </div>

                <input
                  value={exp.company_location ?? ""}
                  onChange={(e) =>
                    updateExperience(exp.id, "company_location", e.target.value)
                  }
                  placeholder="Company location"
                  className="w-full rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-soft">
                      Start date
                    </span>
                    <input
                      type="date"
                      value={formatInputDate(exp.start_date)}
                      onChange={(e) =>
                        updateExperience(exp.id, "start_date", e.target.value)
                      }
                      className="w-full rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-soft">
                      End date
                    </span>
                    <input
                      type="date"
                      value={formatInputDate(exp.end_date)}
                      disabled={exp.is_current}
                      onChange={(e) =>
                        updateExperience(exp.id, "end_date", e.target.value)
                      }
                      className="w-full rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-soft focus:border-cyan-500"
                    />
                  </label>
                </div>

                <label className="flex w-fit items-center gap-2 rounded-2xl bg-surface-elevated px-4 py-3 text-sm font-semibold text-muted">
                  <input
                    type="checkbox"
                    checked={exp.is_current}
                    onChange={(e) =>
                      updateExperience(exp.id, "is_current", e.target.checked)
                    }
                    className="h-4 w-4 accent-slate-900"
                  />
                  I currently work here
                </label>

                <textarea
                  value={exp.description ?? ""}
                  onChange={(e) =>
                    updateExperience(exp.id, "description", e.target.value)
                  }
                  placeholder="Experience description"
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none focus:border-cyan-500"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 pr-12 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-elevated">
                        <BriefcaseBusiness className="h-5 w-5 text-muted" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-app">
                          {exp.position_title}
                        </h3>
                        <p className="truncate text-sm text-soft">
                          {exp.company_name}
                          {exp.company_location
                            ? ` · ${exp.company_location}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold text-muted">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted">
                  {exp.description || "No description."}
                </p>
              </>
            )}
          </article>
        ))}

        {isEditing && (
          <button
            type="button"
            onClick={addExperience}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-app py-4 text-sm font-semibold text-muted hover:bg-surface-strong hover:text-app"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        )}
      </div>
    </section>
  );
}
