import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { loginSchema, type LoginFormValues } from "../../schemas/auth.schema";
import { setAccessToken } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();
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
    <AuthLayout title="Welcome Back" description="Login to continue your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-slate-900">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}