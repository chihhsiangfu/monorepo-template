"use client";

import { UnauthenticatedSection } from "@/components/auth/unauthenticated-section";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UnauthenticatedSection>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="mb-6 flex items-center gap-2">
          <svg
            className="size-8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="font-semibold text-xl">Monorepo Template</span>
        </div>
        <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
          {children}
        </div>
      </div>
    </UnauthenticatedSection>
  );
}
