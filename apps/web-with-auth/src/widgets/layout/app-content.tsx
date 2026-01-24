"use client";

import type { FC, ReactNode } from "react";

import type { BreadcrumbType } from "@/widgets/layout/app-header";
import { AppHeader } from "@/widgets/layout/app-header";

export const AppContent: FC<{
  breadcrumbs: BreadcrumbType[];
  padding?: number;
  children: ReactNode;
}> = ({ breadcrumbs, padding = 24, children }) => {
  return (
    <main className="flex h-full w-full flex-col">
      <AppHeader breadcrumbs={breadcrumbs} />

      <section
        className="flex h-[calc(100vh-57px)] w-full flex-col gap-6 overflow-y-auto"
        style={{
          padding: padding ? `${padding}px` : "0px",
        }}
      >
        {children}
      </section>
    </main>
  );
};
