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

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;