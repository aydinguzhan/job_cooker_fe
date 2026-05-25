import { Sparkles, Send, X, Loader2, UserRound, Briefcase, Star } from "lucide-react";
import { useState } from "react";
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
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                AI Profile Assistant
              </h2>
              <p className="text-sm text-slate-500">
                Prompt yaz, profil taslağını AI oluştursun.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid max-h-[70vh] grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_1.2fr]">
          <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Kendini anlat
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: 3 yıllık backend developerım. Node.js, PostgreSQL, MongoDB, RabbitMQ kullanıyorum. React tarafında da deneyimim var..."
              className="min-h-52 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Generate Profile
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-50/70 p-6">
            {!preview ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-center">
                <Sparkles className="mb-3 text-slate-400" size={32} />
                <h3 className="font-medium text-slate-800">
                  Henüz ön izleme yok
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Prompt yazıp generate ettiğinde AI tarafından oluşturulan profil
                  burada görünecek.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-slate-500">
                    <UserRound size={18} />
                    <span className="text-sm font-medium">Profile Header</span>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900">
                    {preview.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {preview.bio_description}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-slate-500">
                    <Star size={18} />
                    <span className="text-sm font-medium">Skills</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {preview.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                      >
                        {skill.name} · {skill.level}/5
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-slate-500">
                    <Briefcase size={18} />
                    <span className="text-sm font-medium">Experiences</span>
                  </div>

                  {preview.experiences.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      Deneyim bilgisi bulunamadı.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {preview.experiences.map((exp, index) => (
                        <div
                          key={`${exp.role}-${index}`}
                          className="rounded-2xl bg-slate-50 p-4"
                        >
                          <h4 className="font-medium text-slate-900">
                            {exp.role}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {exp.company ?? "Company not specified"}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
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
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => onUseProfile(preview)}
                    className="rounded-2xl bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Use this profile
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
