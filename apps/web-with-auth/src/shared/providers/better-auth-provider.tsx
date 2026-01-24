"use client";

import { BetterAuthProvider as BetterAuthClientProvider } from "@repo/better-auth-hook";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function BetterAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <BetterAuthClientProvider
      authClient={authClient as any}
      navigateTo={router.push}
    >
      {children}
    </BetterAuthClientProvider>
  );
}
