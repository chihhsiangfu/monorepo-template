"use client";

import { Toaster } from "@/components/ui/sonner";
import { NuqsProvider } from "./nuqs-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NuqsProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}

          <Toaster />
        </ThemeProvider>
      </NuqsProvider>
    </QueryProvider>
  );
}
