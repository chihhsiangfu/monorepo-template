"use client";

import { useRouter } from "next/navigation";
import { type FC, type ReactNode, useEffect } from "react";
import { LoadingView } from "@/components/loading-view";
import { authClient } from "@/lib/auth-client";

export const AuthProtectedRoute: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const router = useRouter();

  const { data: session, isPending, error, refetch } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!(isPending || user)) {
      router.push("/auth/sign-in");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return <LoadingView className="h-screen w-screen" />;
  }

  return <>{children}</>;
};
