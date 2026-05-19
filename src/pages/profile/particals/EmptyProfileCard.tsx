import { Plus, UserRound } from "lucide-react";

export default function EmptyProfileCard() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
          <UserRound className="h-8 w-8 text-slate-500" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Profile not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Henüz profil oluşturulmamış. Bir sonraki adımda buraya create profile
          formunu bağlayabiliriz.
        </p>

        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Create Profile
        </button>
      </section>
    </main>
  );
}