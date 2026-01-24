"use client";

import { useAuthClient, useNavigateTo } from "@repo/better-auth-hook";
import { type FC, type ReactNode, useEffect } from "react";

export const AuthenticatedSection: FC<{
  redirectIfNotAuthenticated?: boolean;
  redirectPath?: string;
  children: ReactNode;
}> = ({
  children,
  redirectPath = "/sign-in",
  redirectIfNotAuthenticated = true,
}) => {
  const authClient = useAuthClient();
  const navigateTo = useNavigateTo();

  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  useEffect(() => {
    if (redirectIfNotAuthenticated && !(isPending || user)) {
      navigateTo(redirectPath);
    }
  }, [isPending, user, redirectIfNotAuthenticated, redirectPath, navigateTo]);

  if (isPending || !user) {
    return null;
  }

  return <>{children}</>;
};
