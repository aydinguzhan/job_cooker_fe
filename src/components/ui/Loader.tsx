export default function JobCookerLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-app">
      <div className="relative w-full max-w-sm rounded-3xl border border-app bg-surface p-8 shadow-surface">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-app border-t-cyan-500" />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🍳</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-app">
              Job Cooker hazırlanıyor
            </h2>

            <p className="text-sm text-soft">
              Profilin, yeteneklerin ve kariyer bilgilerin pişiriliyor...
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-strong">
              <div className="h-full w-1/2 rounded-full bg-cyan-500 animate-pulse" />
            </div>

            <p className="text-center text-xs text-soft">
              En iyi profil deneyimi hazırlanıyor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
