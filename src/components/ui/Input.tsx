import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="mb-2 block text-sm font-medium text-muted">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`w-full rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-app outline-none transition placeholder:text-soft ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-app focus:border-slate-900"
          } ${className}`}
          {...props}
        />

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
