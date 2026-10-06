import { Search } from "lucide-react";
import type { ReactNode, InputHTMLAttributes, Ref } from "react";

type InputProps<T> = Omit<InputHTMLAttributes<HTMLInputElement>, "children"> & {
  ref?: Ref<HTMLInputElement>;
  label?: string;
  error?: string;
  searchResult?: T[];
  renderItem?: (item: T, index: number) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  onItemSelect?: (item: T) => void;
};

export default function SearchInput<T>({
  ref,
  label,
  error,
  className = "",
  searchResult = [],
  renderItem,
  getItemKey,
  onItemSelect,
  ...props
}: InputProps<T>) {
  return (
    <div className="relative w-full min-w-0">
      {label && (
        <label className="mb-2 block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <div className="flex items-center justify-between rounded-xl border bg-surface-elevated px-2">
        <div className="border-r pr-2">
          <Search size={16} />
        </div>
        <input
          ref={ref}
          className={`w-full px-4 py-2 text-sm text-app outline-none transition placeholder:text-soft ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-app focus:border-slate-900"
          } ${className}`}
          {...props}
        />
      </div>

      {searchResult.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-xl border bg-surface py-2 shadow-lg">
          <div className="flex flex-col gap-1">
            {searchResult.map((item, index) => {
              const key = getItemKey ? getItemKey(item, index) : index;
              return (
                <div
                  key={key}
                  onClick={() => onItemSelect?.(item)}
                  className="flex w-full cursor-pointer justify-between border-b border-b-zinc-50 px-4 py-2 text-sm font-medium transition hover:opacity-70"
                >
                  {renderItem ? (
                    renderItem(item, index)
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">
                        {String(
                          (item as Record<string, unknown>).title || "Jobs",
                        )}
                      </span>
                      <span className="text-xs font-extralight">
                        {String(
                          (item as Record<string, unknown>).company ||
                            "Company Name",
                        )}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
