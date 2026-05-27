import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-app px-4 text-app">
      <section className="w-full max-w-md rounded-2xl border border-app bg-surface p-8 shadow-surface backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-app">{title}</h1>
          <p className="mt-2 text-sm text-soft">{description}</p>
        </div>

        {children}
      </section>
    </main>
  );
}
