export default function JobCookerLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-100">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl border border-gray-200">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-gray-200 border-t-cyan-500 animate-spin" />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🍳</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              Job Cooker hazırlanıyor
            </h2>

            <p className="text-sm text-gray-500">
              Profilin, yeteneklerin ve kariyer bilgilerin pişiriliyor...
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full w-1/2 rounded-full bg-cyan-500 animate-pulse" />
            </div>

            <p className="text-center text-xs text-gray-400">
              En iyi profil deneyimi hazırlanıyor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}