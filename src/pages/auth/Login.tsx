import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useTranslation } from "../../lang/useTranslation";
import { loginSchema, type LoginFormValues } from "../../schemas/auth.schema";
import { setAccessToken } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

const onSubmit = async (values: LoginFormValues) => {
  try {
    const response = await login(values);
    const { data } = response;

    setAccessToken(data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard", { replace: true });
  } catch (error) {
    console.error("Login error:", error);
  }
};

  return (
    <AuthLayout
      eyebrow={t("auth.loginEyebrow")}
      title={t("auth.loginTitle")}
      description={t("auth.loginDescription")}
      asideTitle={t("auth.loginAsideTitle")}
      asideDescription={t("auth.loginAsideDescription")}
      highlights={[
        t("auth.highlightOne"),
        t("auth.highlightTwo"),
        t("auth.highlightThree"),
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        {t("auth.noAccount")}{" "}
        <Link to="/register" className="font-medium text-white">
          {t("auth.register")}
        </Link>
      </p>
    </AuthLayout>
  );
}
