import SkeletonBlock from "./SkeletonBlock";

export default function SavedPostsPageSkeleton() {
  return (
    <section className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-app bg-surface p-8 shadow-surface">
        <SkeletonBlock className="h-4 w-28 rounded-lg" />
        <SkeletonBlock className="mt-4 h-10 w-2/3" />
        <SkeletonBlock className="mt-3 h-4 w-4/5" />
        <SkeletonBlock className="mt-6 h-12 w-44 rounded-2xl" />
      </section>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <section
            key={index}
            className="overflow-hidden rounded-3xl border border-app bg-surface p-5 shadow-surface"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-3 w-24" />
                </div>
              </div>
              <SkeletonBlock className="h-10 w-10 rounded-full" />
            </div>

            <div className="mt-5 space-y-3">
              <SkeletonBlock className="h-6 w-2/5" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-11/12" />
              <SkeletonBlock className="h-4 w-4/5" />
            </div>

            <div className="mt-5 flex justify-between">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-4 w-20" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <SkeletonBlock className="h-11 w-full" />
              <SkeletonBlock className="h-11 w-full" />
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
