import {
  BriefcaseBusiness,
  Loader2,
  Plus,
  Sparkles,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { useRef, useState } from "react";
import type {
  AiProfilePreview,
  ProfileExperience,
  ProfileReference,
  SkillOption,
} from "../../types/profile.types";
import {
  resolveFileUrl,
  uploadProfileImage,
} from "../../services/file.service";
import SkillsDropdown from "../ui/DropDown";
import Button from "../ui/Button";
import {
  createEmptyExperience,
  createEmptyProfileFormState,
  createEmptyReference,
  mapAiProfileToFormState,
  mapFormStateToCreatePayload,
  type CreateProfileFormState,
} from "./profile-form.utils";

type Props = {
  skillOptions: SkillOption[];
  isSubmitting: boolean;
  onSubmit: (
    payload: ReturnType<typeof mapFormStateToCreatePayload>,
  ) => Promise<void>;
  onOpenAiAssistant: () => void;
  aiDraft: AiProfilePreview | null;
  onAiDraftApplied?: () => void;
};

function formatDateLabel(value?: string | null) {
  if (!value) return "Present";

  return new Date(value).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
  });
}

export default function ProfileCreateForm({
  skillOptions,
  isSubmitting,
  onSubmit,
  onOpenAiAssistant,
  aiDraft,
  onAiDraftApplied,
}: Props) {
  const [form, setForm] = useState<CreateProfileFormState>(
    createEmptyProfileFormState(),
  );
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [unmatchedSkills, setUnmatchedSkills] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const imageSrc = resolveFileUrl(form.profile_image_path);

  function updateForm<K extends keyof CreateProfileFormState>(
    field: K,
    value: CreateProfileFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function applyAiDraft() {
    if (!aiDraft) return;

    const { form: nextForm, unmatchedSkills: nextUnmatchedSkills } =
      mapAiProfileToFormState(aiDraft, skillOptions);

    setForm((prev) => ({
      ...prev,
      ...nextForm,
      profile_image_path: prev.profile_image_path,
    }));
    setUnmatchedSkills(nextUnmatchedSkills);
    onAiDraftApplied?.();
  }

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    updateForm("profile_image_path", previewUrl);

    try {
      setIsImageUploading(true);
      const uploaded = await uploadProfileImage(file);
      updateForm("profile_image_path", uploaded.url);
    } catch (error) {
      console.error("Profile image upload error:", error);
      updateForm("profile_image_path", null);
    } finally {
      setIsImageUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      URL.revokeObjectURL(previewUrl);
    }
  }

  function handleSkillChange(nextSelectedSkills: SkillOption[]) {
    const currentSkillMap = new Map(
      form.skills.map((skill) => [skill.id, skill]),
    );

    updateForm(
      "skills",
      nextSelectedSkills.map((skill) => {
        const current = currentSkillMap.get(skill.id);

        return {
          id: skill.id,
          name: skill.name,
          short_key: skill.short_key,
          level: current?.level ?? 3,
          status: current?.status ?? "active",
        };
      }),
    );
  }

  function updateSkillLevel(skillId: string, level: number) {
    updateForm(
      "skills",
      form.skills.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              level,
            }
          : skill,
      ),
    );
  }

  function removeSkill(skillId: string) {
    updateForm(
      "skills",
      form.skills.filter((skill) => skill.id !== skillId),
    );
  }

  function updateExperience(
    id: string,
    field: keyof ProfileExperience,
    value: string | boolean | null,
  ) {
    updateForm(
      "experiences",
      form.experiences.map((experience) =>
        experience.id === id
          ? {
              ...experience,
              [field]: value,
              ...(field === "is_current" && value === true
                ? { end_date: null }
                : {}),
            }
          : experience,
      ),
    );
  }

  function updateReference(
    id: string,
    field: keyof ProfileReference,
    value: string,
  ) {
    updateForm(
      "references",
      form.references.map((reference) =>
        reference.id === id
          ? {
              ...reference,
              [field]: value,
            }
          : reference,
      ),
    );
  }

  async function handleSubmit() {
    await onSubmit(mapFormStateToCreatePayload(form));
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.35),_transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#164e63_100%)] px-6 py-8 text-white md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Build Your Profile
              </p>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                İlk profilini elle ya da AI ile birkaç dakikada oluştur.
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Önce ana bilgileri gir, sonra skills, experiences ve references
                alanlarını tamamla. İstersen AI taslağını içeri aktar.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                onClick={onOpenAiAssistant}
                className="gap-2 rounded-2xl px-5"
              >
                <Sparkles className="h-4 w-4" />
                AI ile oluştur
              </Button>

              {aiDraft && (
                <Button
                  type="button"
                  variant="outline"
                  fullWidth={false}
                  onClick={applyAiDraft}
                  className="gap-2 rounded-2xl border-white/30 bg-white/10 px-5 text-white hover:bg-white/20"
                >
                  AI taslağını uygula
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6 md:px-8">
          {unmatchedSkills.length > 0 && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Eşleşmeyen AI skill kayıtları atlandı:{" "}
              {unmatchedSkills.join(", ")}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl bg-slate-50 p-5">
              <label className="text-sm font-semibold text-slate-700">
                Profil başlığı
              </label>
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="Frontend Developer · React & TypeScript"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-cyan-500"
              />

              <label className="mt-5 block text-sm font-semibold text-slate-700">
                Hakkında
              </label>
              <textarea
                value={form.bio_description}
                onChange={(event) =>
                  updateForm("bio_description", event.target.value)
                }
                rows={6}
                placeholder="Kendini, uzmanlıklarını ve nasıl bir iş aradığını anlat..."
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-cyan-500"
              />
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">
                Profil görseli
              </p>
              <div className="mt-4 flex flex-col items-center gap-4 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-center">
                <div className="h-32 w-32 overflow-hidden rounded-[1.5rem] bg-slate-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <UserRound className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth={false}
                    disabled={isImageUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-2xl px-5"
                  >
                    {isImageUploading ? "Yükleniyor..." : "Görsel yükle"}
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  <p className="text-xs text-slate-500">
                    PNG veya JPG. Yüklediğinde profil fotoğrafı hazır olacak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-950">Skills</h2>
              <p className="text-sm text-slate-500">Teknik yetkinliklerin</p>
            </div>

            <SkillsDropdown
              options={skillOptions}
              value={form.skills.map((skill) => ({
                id: skill.id,
                name: skill.name,
                short_key: skill.short_key,
              }))}
              onChange={handleSkillChange}
              placeholder="Skill seç..."
            />

            <div className="mt-4 space-y-3">
              {form.skills.length === 0 && (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Henüz skill eklenmedi.
                </p>
              )}

              {form.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {skill.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {skill.short_key}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      className="rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const level = index + 1;
                      const active = index < skill.level;

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updateSkillLevel(skill.id, level)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              active
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">References</h2>
                <p className="text-sm text-slate-500">
                  Senden referans verebilecek kişiler
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                fullWidth={false}
                onClick={() =>
                  updateForm("references", [
                    ...form.references,
                    createEmptyReference(),
                  ])
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {form.references.length === 0 && (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Henüz referans eklenmedi.
                </p>
              )}

              {form.references.map((reference) => (
                <article
                  key={reference.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        updateForm(
                          "references",
                          form.references.filter(
                            (item) => item.id !== reference.id,
                          ),
                        )
                      }
                      className="rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={reference.first_name}
                      onChange={(event) =>
                        updateReference(
                          reference.id,
                          "first_name",
                          event.target.value,
                        )
                      }
                      placeholder="First name"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                    />
                    <input
                      value={reference.last_name}
                      onChange={(event) =>
                        updateReference(
                          reference.id,
                          "last_name",
                          event.target.value,
                        )
                      }
                      placeholder="Last name"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="mt-3 grid gap-3">
                    <input
                      value={reference.position_title ?? ""}
                      onChange={(event) =>
                        updateReference(
                          reference.id,
                          "position_title",
                          event.target.value,
                        )
                      }
                      placeholder="Position title"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                    />
                    <input
                      value={reference.company_name ?? ""}
                      onChange={(event) =>
                        updateReference(
                          reference.id,
                          "company_name",
                          event.target.value,
                        )
                      }
                      placeholder="Company name"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={reference.email ?? ""}
                        onChange={(event) =>
                          updateReference(
                            reference.id,
                            "email",
                            event.target.value,
                          )
                        }
                        placeholder="Email"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      />
                      <input
                        value={reference.phone ?? ""}
                        onChange={(event) =>
                          updateReference(
                            reference.id,
                            "phone",
                            event.target.value,
                          )
                        }
                        placeholder="Phone"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Experiences
                </h2>
                <p className="text-sm text-slate-500">
                  Geçmiş rollerin ve işler
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                fullWidth={false}
                onClick={() =>
                  updateForm("experiences", [
                    ...form.experiences,
                    createEmptyExperience(),
                  ])
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {form.experiences.length === 0 && (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Henüz deneyim eklenmedi.
                </p>
              )}

              {form.experiences.map((experience) => (
                <article
                  key={experience.id}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                        <BriefcaseBusiness className="h-5 w-5 text-slate-600" />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {experience.position_title || "Yeni deneyim"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {experience.start_date
                            ? `${formatDateLabel(experience.start_date)} - ${
                                experience.is_current
                                  ? "Present"
                                  : formatDateLabel(experience.end_date)
                              }`
                            : "Tarih bilgisi bekleniyor"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateForm(
                          "experiences",
                          form.experiences.filter(
                            (item) => item.id !== experience.id,
                          ),
                        )
                      }
                      className="rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={experience.position_title}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "position_title",
                          event.target.value,
                        )
                      }
                      placeholder="Position title"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                    />
                    <input
                      value={experience.company_name}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "company_name",
                          event.target.value,
                        )
                      }
                      placeholder="Company name"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                    />
                  </div>

                  <input
                    value={experience.company_location ?? ""}
                    onChange={(event) =>
                      updateExperience(
                        experience.id,
                        "company_location",
                        event.target.value,
                      )
                    }
                    placeholder="Company location"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  />

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <input
                      type="date"
                      value={experience.start_date?.slice(0, 10) ?? ""}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "start_date",
                          event.target.value,
                        )
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                    />
                    <input
                      type="date"
                      value={experience.end_date?.slice(0, 10) ?? ""}
                      disabled={experience.is_current}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "end_date",
                          event.target.value,
                        )
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>

                  <label className="mt-3 flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={experience.is_current}
                      onChange={(event) =>
                        updateExperience(
                          experience.id,
                          "is_current",
                          event.target.checked,
                        )
                      }
                      className="h-4 w-4 accent-slate-900"
                    />
                    Şu anda burada çalışıyorum
                  </label>

                  <textarea
                    value={experience.description ?? ""}
                    onChange={(event) =>
                      updateExperience(
                        experience.id,
                        "description",
                        event.target.value,
                      )
                    }
                    rows={4}
                    placeholder="Experience description"
                    className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  />
                </article>
              ))}
            </div>
          </section>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Profili yayınla
                </h2>
                <p className="text-sm text-slate-500">
                  Eksik alanlar daha sonra düzenlenebilir.
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                fullWidth={false}
                disabled={
                  isSubmitting || isImageUploading || !form.title.trim()
                }
                onClick={handleSubmit}
                className="min-w-44 gap-2 rounded-2xl px-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Oluşturuluyor
                  </>
                ) : (
                  "Create Profile"
                )}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
