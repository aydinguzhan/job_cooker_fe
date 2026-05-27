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
    <main className="flex min-h-screen items-center justify-center bg-app p-6 text-app">
      <section className="w-full max-w-2xl rounded-3xl border border-app bg-surface p-8 text-center shadow-surface">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-strong">
          <UserRound className="h-8 w-8 text-soft" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-app">
          Profile not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-soft">
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
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-app bg-surface-elevated px-5 py-3 text-sm font-semibold text-muted transition hover:bg-surface-strong hover:text-app"
          >
            AI ile oluştur
          </button>
        </div>
      </section>
    </main>
  );
}
