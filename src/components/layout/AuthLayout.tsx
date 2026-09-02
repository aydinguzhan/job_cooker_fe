import type { ReactNode } from "react";

type AuthLayoutProps = {
  eyebrow: string;
  title?: string;
  description?: string;
  asideTitle: string;
  asideDescription: string;
  highlights: string[];
  children: ReactNode;
  layoutVariant?: "default" | "wide";
  highlightsVariant?: "default" | "steps";
};

export default function AuthLayout({
  eyebrow,
  title,
  description,
  asideTitle,
  asideDescription,
  highlights,
  children,
  layoutVariant = "default",
  highlightsVariant = "default",
}: AuthLayoutProps) {
  const isWide = layoutVariant === "wide";
  const isStepHighlights = highlightsVariant === "steps";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061120] px-4 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_20%),linear-gradient(145deg,#061120_0%,#0b1728_48%,#132238_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="animate-auth-drift absolute left-[8%] top-[10%] h-56 w-56 rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="animate-auth-drift-reverse absolute bottom-[12%] right-[10%] h-64 w-64 rounded-full bg-amber-300/12 blur-3xl" />

      <section
        className={`relative mx-auto flex min-h-[calc(100vh-4rem)] w-full ${
          isWide ? "max-w-7xl items-center" : "max-w-6xl items-center"
        }`}
      >
        <div
          className={`grid w-full gap-8 ${
            isWide
              ? "items-center lg:grid-cols-[0.76fr_1.24fr]"
              : "items-center lg:grid-cols-[1.08fr_0.92fr]"
          }`}
        >
          <div className="hidden lg:block">
            <div className={isWide ? "max-w-md" : "max-w-xl"}>
              <div className="animate-auth-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                {eyebrow}
              </div>

              <h1
                className="animate-auth-fade-up mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white"
                style={{ animationDelay: "120ms" }}
              >
                {asideTitle}
              </h1>

              <p
                className="animate-auth-fade-up mt-5 max-w-xl text-base leading-8 text-slate-300"
                style={{ animationDelay: "220ms" }}
              >
                {asideDescription}
              </p>

              <div className={`mt-8 ${isStepHighlights ? "space-y-3" : "space-y-4"}`}>
                {highlights.map((highlight, index) => (
                  <div
                    key={highlight}
                    className={`animate-auth-fade-up flex items-start gap-3 border border-white/8 bg-white/6 text-slate-200 backdrop-blur-sm ${
                      isStepHighlights
                        ? "rounded-2xl px-4 py-3"
                        : "rounded-2xl px-4 py-4 text-sm leading-7"
                    }`}
                    style={{ animationDelay: `${320 + index * 120}ms` }}
                  >
                    {isStepHighlights ? (
                      <>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cyan-400/14 text-xs font-semibold text-cyan-200 ring-1 ring-cyan-300/15">
                          {index + 1}
                        </span>
                        <span className="pt-1 text-sm font-medium leading-6">{highlight}</span>
                      </>
                    ) : (
                      <>
                        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
                        <span>{highlight}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`relative ${isWide ? "lg:pl-4" : ""}`}>
            <div className="animate-auth-drift absolute -left-8 top-10 hidden h-24 w-24 rounded-full bg-cyan-400/18 blur-2xl lg:block" />
            <div className="animate-auth-drift-reverse absolute -right-8 bottom-8 hidden h-24 w-24 rounded-full bg-amber-300/16 blur-2xl lg:block" />

            <section
              className={`animate-auth-fade-up relative w-full rounded-[2rem] border border-white/10 bg-white/8 shadow-[0_30px_70px_-36px_rgba(2,6,23,0.78)] backdrop-blur-2xl ${
                isWide ? "p-4 md:p-5 xl:p-6" : "p-6 md:p-8"
              }`}
            >
              <div className="mb-8">
                {(title || description) && (
                  <>
                    <div
                      className="animate-auth-fade-up inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200"
                      style={{ animationDelay: "160ms" }}
                    >
                      {eyebrow}
                    </div>
                    {title && (
                      <h2
                        className="animate-auth-fade-up mt-4 text-3xl font-bold tracking-tight text-white"
                        style={{ animationDelay: "240ms" }}
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        className="animate-auth-fade-up mt-3 text-sm leading-7 text-slate-300"
                        style={{ animationDelay: "320ms" }}
                      >
                        {description}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div
                className="animate-auth-fade-up"
                style={{ animationDelay: title || description ? "420ms" : "160ms" }}
              >
                {children}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
