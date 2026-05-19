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
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 focus:border-slate-900"
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
