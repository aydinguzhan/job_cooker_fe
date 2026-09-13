import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Option } from "../../types/profile.types";

type Props = {
  options?: Option[];
  label?: string;
  value: Option[];
  onChange: (skills: Option[]) => void;
  placeholder?: string;
  handleQuery?: (query: string) => Promise<Option[]>;
  disable?: boolean;
};

export default function Dropdown({
  label,
  value,
  onChange,
  placeholder = "Select skills...",
  handleQuery,
  disable,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [searchResults, setSearchResults] = useState<Option[]>([]);

  useEffect(() => {
    const query = search.trim();

    const timeout = setTimeout(async () => {
      let results;

      if (!query) {
        setSearchResults([]);
        return;
      }

      if (!handleQuery) {
        setSearchResults([]);
        return;
      }

      try {
        results = await handleQuery(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Failed to search skills:", error);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);
  function isSelected(skillId: string) {
    return value.some((item) => item.id === skillId);
  }

  function toggleSkill(skill: Option) {
    const exists = value.find((item) => item.id === skill.id);

    if (exists) {
      onChange(value.filter((item) => item.id !== skill.id));
      return;
    }

    onChange([...value, skill]);
  }

  function removeSkill(optionId: string) {
    onChange(value.filter((item) => item.id !== optionId));
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disable && setIsOpen(true)}
        className="flex min-h-[58] w-full flex-wrap items-center gap-2 rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-left shadow-sm transition hover:border-strong"
      >
        {value.length === 0 && (
          <span className="text-sm text-soft">{placeholder}</span>
        )}

        {value.map((option) => (
          <div
            key={option.id}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-3 py-1 text-sm font-medium text-slate-950"
          >
            {option.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(option.id);
                console.log(option);
              }}
              className="rounded-full hover:bg-white/10"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <div className="ml-auto">
          <ChevronDown
            className={`h-5 w-5 text-soft transition ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {disable ||
        (isOpen && (
          <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-xl border border-app bg-surface shadow-2xl">
            <div className="border-b border-app p-4">
              <div className="flex items-center gap-3 rounded-2xl border border-app bg-surface-muted px-4 py-2">
                <Search className="h-4 w-4 text-soft" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search skills..."
                  className="w-full bg-transparent text-sm text-app outline-none placeholder:text-soft"
                />
              </div>
            </div>

            <div className="max-h-[320] overflow-y-auto p-2">
              {searchResults.length === 0 && (
                <div className="p-4 text-center text-sm text-soft">
                  No skills found.
                </div>
              )}

              {searchResults.map((option) => {
                const selected = isSelected(option.id);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleSkill(option)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition my-1 ${
                      selected
                        ? "bg-cyan-400 text-slate-950"
                        : "text-app hover:bg-surface-strong"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm">{option.name}</p>

                      <p
                        className={`text-xs ${
                          selected ? "text-slate-800" : "text-soft"
                        }`}
                      >
                        {option?.short_key ?? null}
                      </p>
                    </div>

                    {selected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
