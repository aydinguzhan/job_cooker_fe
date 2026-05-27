import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/auth.schema";
import { useTranslation } from "../../lang/useTranslation";
import { setAccessToken } from "../../lib/auth";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

const onSubmit = async (values: RegisterFormValues) => {
  try {
    const response = await registerUser(values);
    const { data } = response;

    setAccessToken(data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard", { replace: true });
  } catch (error) {
    console.error("Register error:", error);
  }
};

  return (
    <AuthLayout
      eyebrow={t("auth.registerEyebrow")}
      title={t("auth.registerTitle")}
      description={t("auth.registerDescription")}
      asideTitle={t("auth.registerAsideTitle")}
      asideDescription={t("auth.registerAsideDescription")}
      highlights={[
        t("auth.highlightOne"),
        t("auth.highlightTwo"),
        t("auth.highlightThree"),
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            label={t("auth.firstName")}
            placeholder="Oğuzhan"
            error={errors.firstName?.message}
            {...register("firstName")}
          />

          <Input
            type="text"
            label={t("auth.lastName")}
            placeholder="Aydın"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          type="email"
          label={t("auth.email")}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          type="password"
          label={t("auth.password")}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("auth.creating") : t("auth.register")}
        </Button>
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
