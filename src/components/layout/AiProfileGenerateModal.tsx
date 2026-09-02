import { Sparkles, Send, X, Loader2, UserRound, Briefcase, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../../lang/useTranslation";
import type { AiProfilePreview } from "../../types/profile.types";

type Props = {
  open: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => Promise<AiProfilePreview>;
  onUseProfile: (profile: AiProfilePreview) => void;
};

export default function AiProfileGenerateModal({
  open,
  onClose,
  onGenerate,
  onUseProfile,
}: Props) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<AiProfilePreview | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const result = await onGenerate(prompt);
      setPreview(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 px-4 pt-24 backdrop-blur-md">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-app bg-surface shadow-surface backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-app px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-app">
                {t("aiProfile.modalTitle")}
              </h2>
              <p className="text-sm text-soft">
                {t("aiProfile.modalDescription")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-soft transition hover:bg-surface-strong hover:text-app"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid max-h-[70vh] grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_1.2fr]">
          <div className="border-b border-app p-6 lg:border-b-0 lg:border-r">
            <label className="mb-2 block text-sm font-medium text-muted">
              {t("aiProfile.promptLabel")}
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("aiProfile.promptPlaceholder")}
              className="min-h-52 w-full resize-none rounded-2xl border border-app bg-surface-elevated px-4 py-3 text-sm text-app outline-none transition placeholder:text-soft focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {t("aiProfile.generating")}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t("aiProfile.generate")}
                </>
              )}
            </button>
          </div>

          <div className="bg-surface-muted p-6">
            {!preview ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-app bg-surface-elevated text-center">
                <Sparkles className="mb-3 text-soft" size={32} />
                <h3 className="font-medium text-app">
                  {t("aiProfile.emptyTitle")}
                </h3>
                <p className="mt-1 max-w-sm text-sm text-soft">
                  {t("aiProfile.emptyDescription")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl border border-app bg-surface-elevated p-5 shadow-surface">
                  <div className="mb-3 flex items-center gap-2 text-soft">
                    <UserRound size={18} />
                    <span className="text-sm font-medium">{t("aiProfile.profileHeader")}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-app">
                    {preview.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {preview.bio_description}
                  </p>
                </div>

                <div className="rounded-3xl border border-app bg-surface-elevated p-5 shadow-surface">
                  <div className="mb-3 flex items-center gap-2 text-soft">
                    <Star size={18} />
                    <span className="text-sm font-medium">{t("aiProfile.skills")}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {preview.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="rounded-full border border-app bg-surface-muted px-3 py-1 text-sm text-muted"
                      >
                        {skill.name} · {skill.level}/5
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-app bg-surface-elevated p-5 shadow-surface">
                  <div className="mb-3 flex items-center gap-2 text-soft">
                    <Briefcase size={18} />
                    <span className="text-sm font-medium">{t("aiProfile.experiences")}</span>
                  </div>

                  {preview.experiences.length === 0 ? (
                    <p className="text-sm text-soft">
                      {t("aiProfile.noExperiences")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {preview.experiences.map((exp, index) => (
                        <div
                          key={`${exp.role}-${index}`}
                          className="rounded-2xl bg-surface-muted p-4"
                        >
                          <h4 className="font-medium text-app">
                            {exp.role}
                          </h4>
                          <p className="text-sm text-soft">
                            {exp.company ?? t("aiProfile.companyFallback")}
                          </p>
                          <p className="mt-2 text-sm text-muted">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="rounded-2xl border border-app bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-strong hover:text-app"
                  >
                    {t("aiProfile.cancel")}
                  </button>

                  <button
                    onClick={() => onUseProfile(preview)}
                    className="rounded-2xl bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    {t("aiProfile.useProfile")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
