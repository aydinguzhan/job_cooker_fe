import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  lastName: z.string().min(2, "Soyisim en az 2 karakter olmalıdır."),
  email: z.string().email("Geçerli bir email giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
});

export const onboardingRoleSchema = z.enum(["job_seeker", "recruiter"]);

export const registerOnboardingSchema = z.object({
  firstName: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  lastName: z.string().min(2, "Soyisim en az 2 karakter olmalıdır."),
  email: z.string().email("Geçerli bir email giriniz."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
  role: onboardingRoleSchema,
  title: z.string().min(2, "Profil başlığı en az 2 karakter olmalıdır."),
  bio_description: z
    .string()
    .min(20, "Biyografi en az 20 karakter olmalıdır."),
  profile_image_path: z.string().nullable().optional(),
  skills: z.array(
    z.object({
      skill_id: z.string(),
      level: z.number().min(1).max(5),
    }),
  ),
  experiences: z.array(
    z.object({
      company_name: z.string().min(1, "Şirket adı zorunludur."),
      company_location: z.string().nullable().optional(),
      position_title: z.string().min(1, "Pozisyon zorunludur."),
      start_date: z.string().min(1, "Başlangıç tarihi zorunludur."),
      end_date: z.string().nullable().optional(),
      is_current: z.boolean(),
      description: z.string().nullable().optional(),
    }),
  ),
  references: z.array(
    z.object({
      first_name: z.string().min(1, "İsim zorunludur."),
      last_name: z.string().min(1, "Soyisim zorunludur."),
      email: z.string().email("Geçerli email giriniz.").nullable().optional(),
      phone: z.string().nullable().optional(),
      company_name: z.string().nullable().optional(),
      position_title: z.string().nullable().optional(),
    }),
  ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterOnboardingFormValues = z.infer<typeof registerOnboardingSchema>;
