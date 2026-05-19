import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SkillOption } from "../../types/profile.types";

type Props = {
  options: SkillOption[];
  value: SkillOption[];
  onChange: (skills: SkillOption[]) => void;
  placeholder?: string;
};

export default function SkillsDropdown({
  options,
  value,
  onChange,
  placeholder = "Select skills...",
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

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  function isSelected(skillId: string) {
    return value.some((item) => item.id === skillId);
  }

  function toggleSkill(skill: SkillOption) {
    const exists = value.find((item) => item.id === skill.id);

    if (exists) {
      onChange(value.filter((item) => item.id !== skill.id));
      return;
    }

    onChange([...value, skill]);
  }

  function removeSkill(skillId: string) {
    onChange(value.filter((item) => item.id !== skillId));
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-[58px] w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-300"
      >
        {value.length === 0 && (
          <span className="text-sm text-slate-400">{placeholder}</span>
        )}

        {value.map((skill) => (
          <div
            key={skill.id}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-1 text-sm font-medium text-white"
          >
            {skill.name}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill.id);
              }}
              className="rounded-full hover:bg-white/10"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <div className="ml-auto">
          <ChevronDown
            className={`h-5 w-5 text-slate-500 transition ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto p-2">
            {filteredOptions.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-400">
                No skills found.
              </div>
            )}

            {filteredOptions.map((skill) => {
              const selected = isSelected(skill.id);

              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                    selected ? "bg-slate-900 text-white" : "hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="font-medium">{skill.name}</p>

                    <p
                      className={`text-xs ${
                        selected ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {skill.short_key}
                    </p>
                  </div>

                  {selected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
