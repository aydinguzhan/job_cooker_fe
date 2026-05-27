import SkeletonBlock from "./SkeletonBlock";

export default function ProfilePageSkeleton() {
  return (
    <main className="min-h-screen bg-app px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-app bg-surface p-6 shadow-surface">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-5">
              <SkeletonBlock className="h-24 w-24 rounded-[1.8rem]" />
              <div className="space-y-3">
                <SkeletonBlock className="h-7 w-48" />
                <SkeletonBlock className="h-4 w-64" />
                <SkeletonBlock className="h-4 w-40" />
              </div>
            </div>

            <div className="flex gap-3">
              <SkeletonBlock className="h-11 w-28 rounded-xl" />
              <SkeletonBlock className="h-11 w-32 rounded-xl" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-app bg-surface p-5 shadow-surface">
              <SkeletonBlock className="h-5 w-28" />
              <div className="mt-5 space-y-4">
                <SkeletonBlock className="h-12 w-full" />
                <SkeletonBlock className="h-12 w-full" />
                <SkeletonBlock className="h-12 w-4/5" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-app bg-surface p-5 shadow-surface">
              <SkeletonBlock className="h-5 w-36" />
              <div className="mt-5 space-y-3">
                <SkeletonBlock className="h-16 w-full" />
                <SkeletonBlock className="h-16 w-full" />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-app bg-surface p-5 shadow-surface">
              <SkeletonBlock className="h-5 w-40" />
              <div className="mt-5 space-y-4">
                <SkeletonBlock className="h-24 w-full" />
                <SkeletonBlock className="h-24 w-full" />
                <SkeletonBlock className="h-24 w-full" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-app bg-surface p-5 shadow-surface">
              <SkeletonBlock className="h-5 w-32" />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <SkeletonBlock className="h-28 w-full" />
                <SkeletonBlock className="h-28 w-full" />
                <SkeletonBlock className="h-28 w-full" />
                <SkeletonBlock className="h-28 w-full" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
