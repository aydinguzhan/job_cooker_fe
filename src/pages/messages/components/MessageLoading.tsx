import SkeletonBlock from "../../../components/spinner/SkeletonBlock";
export default function MessagesLoading() {
  return (
    <main className="h-full overflow-hidden bg-app px-3 py-3 md:px-4">
      <div className="mx-auto h-full max-w-6xl overflow-hidden">
        <section className="flex h-[calc(100vh-7.75rem)] overflow-hidden rounded-[1.5rem] border border-app bg-surface shadow-surface">
          
          <aside className="flex h-full w-[320px] shrink-0 flex-col overflow-hidden border-r border-app bg-surface">
            <div className="border-b border-app px-4 py-4">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="mt-3 h-10 w-full rounded-xl" />
              <SkeletonBlock className="mt-3 h-10 w-full rounded-xl" />
            </div>

            <div className="flex-1 px-3 py-3">
              <div className="mb-3 flex justify-between">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-5 w-8 rounded-full" />
              </div>

              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonBlock key={index} />
                ))}
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
            <div className="flex items-center justify-between border-b border-app px-5 py-4">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-11 w-11 rounded-full" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-44" />
                  <SkeletonBlock className="h-3 w-56" />
                </div>
              </div>

              <SkeletonBlock className="h-5 w-8 rounded-full" />
            </div>

            <div className="flex-1 space-y-3 px-4 py-4">
              <SkeletonBlock />
              <SkeletonBlock  />
              <SkeletonBlock />
              <SkeletonBlock  />
            </div>

            <div className="border-t border-app px-4 py-3">
              <div className="rounded-[1.25rem] border border-app bg-surface-elevated p-3">
                <SkeletonBlock className="h-14 w-full rounded-xl" />
                <div className="mt-3 flex justify-between">
                  <SkeletonBlock className="h-3 w-32" />
                  <SkeletonBlock className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            </div>

          </section>
        </section>
      </div>
    </main>
  );
}