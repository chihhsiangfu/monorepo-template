"use client";

import { useAuthClient, useNavigateTo } from "@repo/better-auth-hook";
import { type FC, type ReactNode, useEffect } from "react";

export const UnauthenticatedSection: FC<{
  redirectIfAuthenticated?: boolean;
  redirectPath?: string;
  children: ReactNode;
}> = ({ children, redirectPath = "/", redirectIfAuthenticated = true }) => {
  const authClient = useAuthClient();
  const navigateTo = useNavigateTo();

  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    if (redirectIfAuthenticated && !(isPending || !user)) {
      navigateTo(redirectPath);
    }
  }, [isPending, user, redirectIfAuthenticated, redirectPath, navigateTo]);

  if (isPending || user) {
    return null;
  }

  return <>{children}</>;
};
