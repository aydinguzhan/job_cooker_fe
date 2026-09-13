import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Loader2,
  Plus,
  Sparkles,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import AiProfileGenerateModal from "../../components/layout/AiProfileGenerateModal";
import Stepper, { type StepItem } from "../../components/stepper/Stepper";
import Input from "../../components/ui/Input";
import SkillsDropdown from "../../components/ui/SkillsDropDown";
import {
  createEmptyExperience,
  createEmptyReference,
  mapAiProfileToFormState,
} from "../../components/profile/profile-form.utils";
import { useTranslation } from "../../lang/useTranslation";
import { setAccessToken } from "../../lib/auth";
import { UUID } from "../../lib/utils";
import { login, registerUser } from "../../services/auth.service";
import {
  resolveFileUrl,
  uploadProfileImage,
} from "../../services/file.service";
import { getSkills } from "../../services/global.service";
import {
  createProfile,
  generateAiProfile,
} from "../../services/profile.service";
import {
  registerOnboardingSchema,
  type RegisterOnboardingFormValues,
} from "../../schemas/auth.schema";
import type { AiProfilePreview, SkillOption } from "../../types/profile.types";

const STEP_ACCOUNT_FIELDS: Array<keyof RegisterOnboardingFormValues> = [
  "firstName",
  "lastName",
  "email",
  "password",
  "title",
  "bio_description",
];

const STEP_ROLE_FIELDS: Array<keyof RegisterOnboardingFormValues> = ["role"];

function normalizeOptional(value?: string | null) {
  const nextValue = value?.trim();
  return nextValue ? nextValue : null;
}

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeProfileSection, setActiveProfileSection] = useState<
    "skills" | "experiences" | "references"
  >("skills");
  const [bootstrappedAuth, setBootstrappedAuth] = useState(false);
  const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiDraft, setAiDraft] = useState<AiProfilePreview | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [unmatchedSkills, setUnmatchedSkills] = useState<string[]>([]);

  const {
    control,
    register,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterOnboardingFormValues>({
    resolver: zodResolver(registerOnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "job_seeker",
      title: "",
      bio_description: "",
      profile_image_path: null,
      skills: [],
      experiences: [],
      references: [],
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
    replace: replaceExperiences,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
    replace: replaceReferences,
  } = useFieldArray({
    control,
    name: "references",
  });

  const selectedRole = useWatch({ control, name: "role" });
  const selectedSkills = useWatch({ control, name: "skills" });
  const profileImagePath = useWatch({ control, name: "profile_image_path" });
  const watchedExperiences = useWatch({ control, name: "experiences" });

  const selectedSkillOptions = useMemo(
    () =>
      selectedSkills
        .map((skill) =>
          skillOptions.find((option) => option.id === skill.skill_id),
        )
        .filter((skill): skill is SkillOption => Boolean(skill)),
    [selectedSkills, skillOptions],
  );

  const profileSections = [
    {
      id: "skills" as const,
      label: t("registerFlow.skillsLabel"),
      count: selectedSkills.length,
    },
    {
      id: "experiences" as const,
      label: t("registerFlow.experiencesTitle"),
      count: experienceFields.length,
    },
    {
      id: "references" as const,
      label: t("registerFlow.referencesTitle"),
      count: referenceFields.length,
    },
  ];

  useEffect(() => {
    if (!bootstrappedAuth || skillOptions.length > 0) return;

    async function fetchSkills() {
      try {
        const results = await getSkills();
        setSkillOptions(results);
      } catch (error) {
        console.error("Skills fetch error:", error);
      }
    }

    fetchSkills();
  }, [bootstrappedAuth, skillOptions.length]);

  async function handleGenerateProfile(prompt: string) {
    const generated = await generateAiProfile(prompt);
    setAiDraft(generated);
    return generated;
  }

  function applyAiDraft(profile: AiProfilePreview) {
    const { form, unmatchedSkills: unmatched } = mapAiProfileToFormState(
      profile,
      skillOptions,
    );

    setValue("title", form.title, { shouldValidate: true });
    setValue("bio_description", form.bio_description, { shouldValidate: true });
    setValue(
      "skills",
      form.skills.map((skill) => ({
        skill_id: skill.id,
        level: skill.level,
      })),
      { shouldValidate: true },
    );
    replaceExperiences(
      form.experiences.map((experience) => ({
        id: UUID(),
        profile_id: "",
        company_name: experience.company_name,
        company_location: experience.company_location,
        position_title: experience.position_title,
        start_date: experience.start_date,
        end_date: experience.end_date,
        is_current: experience.is_current,
        description: experience.description,
        status: experience.status,
      })),
    );
    replaceReferences(
      form.references.map((reference) => ({
        id: UUID(),
        profile_id: "",
        first_name: reference.first_name,
        last_name: reference.last_name,
        email: reference.email,
        phone: reference.phone,
        company_name: reference.company_name,
        position_title: reference.position_title,
        status: reference.status,
      })),
    );

    setActiveProfileSection("skills");
    setUnmatchedSkills(unmatched);
    setAiDraft(profile);
    setIsAiModalOpen(false);
  }

  async function ensureAuthenticatedSession() {
    if (bootstrappedAuth) return true;

    try {
      const values = getValues();

      await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      const loginResponse = await login({
        email: values.email,
        password: values.password,
      });

      setAccessToken(loginResponse.data.accessToken);
      localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
      setBootstrappedAuth(true);
      setSubmitError(null);
      return true;
    } catch (error) {
      console.error("Register onboarding bootstrap error:", error);
      setSubmitError(t("registerFlow.submitError"));
      return false;
    }
  }

  async function handleNextStep() {
    if (currentStep === 0) {
      const isValid = await trigger(STEP_ACCOUNT_FIELDS);
      if (isValid) setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      const isValid = await trigger(STEP_ROLE_FIELDS);
      if (!isValid) return;

      const authenticated = await ensureAuthenticatedSession();
      if (!authenticated) return;

      setCurrentStep(2);
    }
  }

  function handlePreviousStep() {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleProfileImageSelect(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setValue("profile_image_path", previewUrl);

    try {
      setIsImageUploading(true);
      const uploaded = await uploadProfileImage(file);
      setValue("profile_image_path", uploaded.url, { shouldValidate: true });
    } catch (error) {
      console.error("Profile image upload error:", error);
      setValue("profile_image_path", null, { shouldValidate: true });
    } finally {
      setIsImageUploading(false);
      URL.revokeObjectURL(previewUrl);
      event.target.value = "";
    }
  }

  function handleSkillSelection(nextSelectedSkills: SkillOption[]) {
    const currentSkills = getValues("skills");
    const currentSkillMap = new Map(
      currentSkills.map((skill) => [skill.skill_id, skill]),
    );

    setValue(
      "skills",
      nextSelectedSkills.map((skill) => ({
        skill_id: skill.id,
        level: currentSkillMap.get(skill.id)?.level ?? 3,
      })),
      { shouldValidate: true },
    );
  }

  async function onSubmit(values: RegisterOnboardingFormValues) {
    setSubmitError(null);

    const authenticated = await ensureAuthenticatedSession();
    if (!authenticated) return;

    try {
      await createProfile({
        title: values.title.trim(),
        bio_description: values.bio_description.trim(),
        profile_image_path: values.profile_image_path ?? null,
        skills: values.skills,
        experiences: values.experiences
          .filter(
            (experience) =>
              experience.company_name.trim() &&
              experience.position_title.trim() &&
              experience.start_date,
          )
          .map((experience) => ({
            company_name: experience.company_name.trim(),
            company_location: normalizeOptional(experience.company_location),
            position_title: experience.position_title.trim(),
            start_date: experience.start_date,
            end_date: experience.is_current
              ? null
              : normalizeOptional(experience.end_date),
            is_current: experience.is_current,
            description: normalizeOptional(experience.description),
          })),
        references: values.references
          .filter(
            (reference) =>
              reference.first_name.trim() && reference.last_name.trim(),
          )
          .map((reference) => ({
            first_name: reference.first_name.trim(),
            last_name: reference.last_name.trim(),
            email: normalizeOptional(reference.email),
            phone: normalizeOptional(reference.phone),
            company_name: normalizeOptional(reference.company_name),
            position_title: normalizeOptional(reference.position_title),
          })),
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Profile create error:", error);
      setSubmitError(t("registerFlow.submitError"));
    }
  }

  const stepList: StepItem[] = [
    {
      id: "account",
      title: t("registerFlow.stepAccountTitle"),
      description: t("registerFlow.stepAccountDescription"),
      component: (
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            type="text"
            label={t("auth.firstName")}
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            type="text"
            label={t("auth.lastName")}
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <Input
            type="email"
            label={t("auth.email")}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            type="password"
            label={t("auth.password")}
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="md:col-span-2">
            <Input
              type="text"
              label={t("registerFlow.profileTitle")}
              placeholder={t("registerFlow.profileTitlePlaceholder")}
              error={errors.title?.message}
              {...register("title")}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-muted">
              {t("registerFlow.bioLabel")}
            </label>
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none transition placeholder:text-soft focus:border-slate-300"
              placeholder={t("registerFlow.bioPlaceholder")}
              {...register("bio_description")}
            />
            {errors.bio_description?.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.bio_description.message}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "role",
      title: t("registerFlow.stepRoleTitle"),
      description: t("registerFlow.stepRoleDescription"),
      component: (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-300">
            {t("registerFlow.roleLabel")}
          </p>

          <label
            className={`block cursor-pointer rounded-[1.75rem] border p-5 transition ${
              selectedRole === "job_seeker"
                ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                : "border-white/10 bg-white/[0.04] text-slate-100 hover:border-white/20 hover:bg-white/[0.06]"
            }`}
          >
            <input
              type="radio"
              value="job_seeker"
              className="sr-only"
              {...register("role")}
            />
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/10 p-3">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">
                  {t("registerFlow.jobSeekerTitle")}
                </p>
                <p
                  className={`mt-1 text-sm leading-6 ${
                    selectedRole === "job_seeker"
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                >
                  {t("registerFlow.jobSeekerDescription")}
                </p>
              </div>
            </div>
          </label>

          <label
            className={`block cursor-pointer rounded-[1.75rem] border p-5 transition ${
              selectedRole === "recruiter"
                ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                : "border-white/10 bg-white/[0.04] text-slate-100 hover:border-white/20 hover:bg-white/[0.06]"
            }`}
          >
            <input
              type="radio"
              value="recruiter"
              className="sr-only"
              {...register("role")}
            />
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/10 p-3">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">
                  {t("registerFlow.recruiterTitle")}
                </p>
                <p
                  className={`mt-1 text-sm leading-6 ${
                    selectedRole === "recruiter"
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                >
                  {t("registerFlow.recruiterDescription")}
                </p>
              </div>
            </div>
          </label>
        </div>
      ),
    },
    {
      id: "profile",
      title: t("registerFlow.stepProfileTitle"),
      description: t("registerFlow.stepProfileDescription"),
      component: (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-3xl bg-slate-950/80 text-white ring-1 ring-white/10">
                {profileImagePath ? (
                  <img
                    src={resolveFileUrl(profileImagePath)}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-8 w-8" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {t("registerFlow.profileImageLabel")}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {getValues("title") ||
                    t("registerFlow.profileTitlePlaceholder")}
                </p>
              </div>
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]">
              {isImageUploading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </span>
              ) : (
                t("registerFlow.uploadImage")
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageSelect}
              />
            </label>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 md:p-5">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {profileSections.map((section) => {
                  const isActive = activeProfileSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveProfileSection(section.id)}
                      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                          : "border-white/12 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                      }`}
                    >
                      <span>{section.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          isActive
                            ? "bg-cyan-300 text-slate-950"
                            : "bg-white/[0.08] text-slate-300"
                        }`}
                      >
                        {section.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("registerFlow.aiButton")}
                </button>

                {aiDraft && (
                  <button
                    type="button"
                    onClick={() => applyAiDraft(aiDraft)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
                  >
                    {t("registerFlow.aiApply")}
                  </button>
                )}
              </div>
            </div>

            {unmatchedSkills.length > 0 && (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {t("registerFlow.unmatchedSkills", {
                  skills: unmatchedSkills.join(", "),
                })}
              </div>
            )}

            {activeProfileSection === "skills" && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t("registerFlow.skillsLabel")}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {t("registerFlow.skillsHelper")}
                  </p>
                </div>

                <Controller
                  control={control}
                  name="skills"
                  render={() => (
                    <SkillsDropdown
                      options={skillOptions}
                      value={selectedSkillOptions}
                      onChange={handleSkillSelection}
                      placeholder={t("registerFlow.skillsPlaceholder")}
                    />
                  )}
                />

                {selectedSkills.length > 0 && (
                  <div className="space-y-3">
                    {selectedSkills.map((skill, index) => {
                      const selectedSkill = skillOptions.find(
                        (option) => option.id === skill.skill_id,
                      );

                      return (
                        <div
                          key={skill.skill_id}
                          className="flex items-center justify-between rounded-2xl bg-slate-950/45 px-4 py-3 ring-1 ring-white/8"
                        >
                          <div>
                            <p className="font-medium text-white">
                              {selectedSkill?.name ?? skill.skill_id}
                            </p>
                            <p className="text-xs text-slate-400">
                              {t("registerFlow.skillLevel")}: {skill.level}/5
                            </p>
                          </div>

                          <select
                            value={skill.level}
                            onChange={(event) =>
                              setValue(
                                `skills.${index}.level`,
                                Number(event.target.value),
                                {
                                  shouldValidate: true,
                                },
                              )
                            }
                            className="rounded-xl border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-slate-100 outline-none"
                          >
                            {[1, 2, 3, 4, 5].map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeProfileSection === "experiences" && (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {t("registerFlow.experiencesTitle")}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {t("registerFlow.experiencesHelper")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => appendExperience(createEmptyExperience())}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
                  >
                    <Plus className="h-4 w-4" />
                    {t("registerFlow.addExperience")}
                  </button>
                </div>

                <div className="space-y-4">
                  {experienceFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-2xl bg-slate-950/45 p-4 ring-1 ring-white/8"
                    >
                      <div className="mb-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-3">
                        <Input
                          label={t("registerFlow.companyName")}
                          error={
                            errors.experiences?.[index]?.company_name?.message
                          }
                          {...register(`experiences.${index}.company_name`)}
                        />
                        <Input
                          label={t("registerFlow.positionTitle")}
                          error={
                            errors.experiences?.[index]?.position_title?.message
                          }
                          {...register(`experiences.${index}.position_title`)}
                        />
                        <Input
                          label={t("registerFlow.companyLocation")}
                          {...register(`experiences.${index}.company_location`)}
                        />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Input
                            type="date"
                            label={t("registerFlow.startDate")}
                            error={
                              errors.experiences?.[index]?.start_date?.message
                            }
                            {...register(`experiences.${index}.start_date`)}
                          />
                          <Input
                            type="date"
                            label={t("registerFlow.endDate")}
                            disabled={watchedExperiences?.[index]?.is_current}
                            {...register(`experiences.${index}.end_date`)}
                          />
                        </div>

                        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            {...register(`experiences.${index}.is_current`)}
                          />
                          {t("registerFlow.currentRole")}
                        </label>

                        <textarea
                          rows={4}
                          className="w-full rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none transition placeholder:text-soft focus:border-slate-300"
                          placeholder={t("registerFlow.experienceDescription")}
                          {...register(`experiences.${index}.description`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeProfileSection === "references" && (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {t("registerFlow.referencesTitle")}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {t("registerFlow.referencesHelper")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => appendReference(createEmptyReference())}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.1]"
                  >
                    <Plus className="h-4 w-4" />
                    {t("registerFlow.addReference")}
                  </button>
                </div>

                <div className="space-y-4">
                  {referenceFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-2xl bg-slate-950/45 p-4 ring-1 ring-white/8"
                    >
                      <div className="mb-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeReference(index)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <Input
                          label={t("registerFlow.referenceFirstName")}
                          error={
                            errors.references?.[index]?.first_name?.message
                          }
                          {...register(`references.${index}.first_name`)}
                        />
                        <Input
                          label={t("registerFlow.referenceLastName")}
                          error={errors.references?.[index]?.last_name?.message}
                          {...register(`references.${index}.last_name`)}
                        />
                        <Input
                          type="email"
                          label={t("registerFlow.referenceEmail")}
                          error={errors.references?.[index]?.email?.message}
                          {...register(`references.${index}.email`)}
                        />
                        <Input
                          label={t("registerFlow.referencePhone")}
                          {...register(`references.${index}.phone`)}
                        />
                        <Input
                          label={t("registerFlow.companyName")}
                          {...register(`references.${index}.company_name`)}
                        />
                        <Input
                          label={t("registerFlow.positionTitle")}
                          {...register(`references.${index}.position_title`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <AuthLayout
      eyebrow={t("auth.registerEyebrow")}
      asideTitle={t("auth.registerAsideTitle")}
      asideDescription={t("auth.registerAsideDescription")}
      layoutVariant="wide"
      highlightsVariant="steps"
      highlights={[
        t("registerFlow.stepAccountTitle"),
        t("registerFlow.stepRoleTitle"),
        t("registerFlow.stepProfileTitle"),
      ]}
    >
      <AiProfileGenerateModal
        open={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerate={handleGenerateProfile}
        onUseProfile={applyAiDraft}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <Stepper
          stepList={stepList}
          currentStep={currentStep}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          isSubmitting={isSubmitting}
        />
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        {t("auth.haveAccount")}{" "}
        <Link to="/login" className="font-medium text-white">
          {t("auth.login")}
        </Link>
      </p>
    </AuthLayout>
  );
}
