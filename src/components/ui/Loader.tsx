export default function JobCookerLoader() {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.12),_transparent_22%)]" />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-app bg-surface p-8 shadow-surface backdrop-blur-xl md:p-10">
        <div className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.7),transparent)]" />

        <div className="flex flex-col items-center gap-8 text-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-400/25" />
            <div className="absolute inset-3 rounded-full border border-amber-300/20" />
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border-t-2 border-cyan-500/80 border-r-2 border-r-transparent border-b-2 border-b-transparent border-l-2 border-l-transparent" />
            <div className="absolute inset-5 animate-pulse rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.16),_rgba(34,211,238,0.02)_72%,_transparent_100%)]" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(145deg,rgba(6,182,212,0.18),rgba(15,23,42,0.02))] ring-1 ring-cyan-400/20">
              <span className="text-3xl">🍳</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-700 dark:text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
              Loading Workspace
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-app md:text-3xl">
              Job Cooker hazirlaniyor
            </h2>

            <p className="mx-auto max-w-md text-sm leading-7 text-soft md:text-base">
              Profilin, yeteneklerin ve kariyer akisin daha pürüzsüz bir deneyim
              icin hazirlaniyor.
            </p>
          </div>

          <div className="w-full max-w-md space-y-3">
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-strong">
              <div className="h-full w-1/2 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,#06b6d4_0%,#22d3ee_40%,#fbbf24_100%)]" />
            </div>

            <div className="flex items-center justify-between text-xs text-soft">
              <span>Veriler senkronize ediliyor</span>
              <span className="font-semibold text-app">Please wait</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
