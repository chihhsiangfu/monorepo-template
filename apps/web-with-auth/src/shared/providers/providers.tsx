"use client";

import { Toaster } from "@/components/ui/sonner";
import { BetterAuthProvider } from "./better-auth-provider";
import { NuqsProvider } from "./nuqs-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NuqsProvider>
        <BetterAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            {children}

            <Toaster />
          </ThemeProvider>
        </BetterAuthProvider>
      </NuqsProvider>
    </QueryProvider>
  );
}
