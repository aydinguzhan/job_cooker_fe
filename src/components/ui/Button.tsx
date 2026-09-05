import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = true,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-cyan-500 text-white hover:bg-cyan-600",
    ghost: "bg-transparent text-muted hover:bg-surface-strong hover:text-app",
    outline:
      "border border-app bg-surface-elevated text-muted hover:bg-surface-strong hover:text-app",
  };

  const sizes = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={`hover:cursor-pointer ${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : "w-auto"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
