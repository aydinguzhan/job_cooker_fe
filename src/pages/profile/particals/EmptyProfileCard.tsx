import { Plus, UserRound } from "lucide-react";

type Props = {
  onCreateProfile: () => void;
  onOpenAiAssistant: () => void;
};

export default function EmptyProfileCard({
  onCreateProfile,
  onOpenAiAssistant,
}: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
          <UserRound className="h-8 w-8 text-slate-500" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Profile not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Henüz profil oluşturulmamış. Profili manuel olarak kurabilir ya da AI
          ile ilk taslağı birkaç saniyede oluşturabilirsin.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCreateProfile}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Create Profile
          </button>

          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            AI ile oluştur
          </button>
        </div>
      </section>
    </main>
  );
}
