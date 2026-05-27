import SkeletonBlock from "./SkeletonBlock";

export default function NetworkPageSkeleton() {
  return (
    <main className="min-h-screen bg-app px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-app bg-surface p-8 shadow-surface">
          <SkeletonBlock className="h-4 w-24 rounded-lg" />
          <SkeletonBlock className="mt-4 h-10 w-2/3" />
          <SkeletonBlock className="mt-3 h-4 w-4/5" />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.5rem] border border-app bg-surface-muted p-4"
              >
                <SkeletonBlock className="h-3 w-20 rounded-lg" />
                <SkeletonBlock className="mt-4 h-8 w-14" />
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <section
              key={index}
              className="rounded-[1.75rem] border border-app bg-surface p-5 shadow-surface"
            >
              <SkeletonBlock className="h-3 w-20 rounded-lg" />
              <SkeletonBlock className="mt-4 h-5 w-32" />
              <SkeletonBlock className="mt-3 h-4 w-full" />
              <SkeletonBlock className="mt-4 h-9 w-12 rounded-full" />
            </section>
          ))}
        </div>

        <section className="rounded-[2rem] border border-app bg-surface p-5 shadow-surface">
          <div className="mb-5 flex items-end justify-between border-b border-app pb-5">
            <div className="space-y-3">
              <SkeletonBlock className="h-3 w-24 rounded-lg" />
              <SkeletonBlock className="h-7 w-64" />
              <SkeletonBlock className="h-4 w-80" />
            </div>
            <SkeletonBlock className="h-12 w-32 rounded-2xl" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <section
                key={index}
                className="rounded-[2rem] border border-app bg-surface-elevated p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <SkeletonBlock className="h-16 w-16 rounded-[1.5rem]" />
                    <div className="space-y-2">
                      <SkeletonBlock className="h-5 w-40" />
                      <SkeletonBlock className="h-4 w-52" />
                      <SkeletonBlock className="h-4 w-36" />
                    </div>
                  </div>
                  <SkeletonBlock className="h-12 w-28 rounded-2xl" />
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
