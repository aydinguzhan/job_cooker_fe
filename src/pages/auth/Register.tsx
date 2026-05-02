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
import { setAccessToken } from "../../lib/auth";

export default function Register() {
  const navigate = useNavigate();
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
    <AuthLayout title="Create Account" description="Register to start using the app">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            label="First name"
            placeholder="Oğuzhan"
            error={errors.firstName?.message}
            {...register("firstName")}
          />

          <Input
            type="text"
            label="Last name"
            placeholder="Aydın"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

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
          {isSubmitting ? "Creating..." : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-slate-900">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}