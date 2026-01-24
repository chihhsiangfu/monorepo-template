"use client";

import { useAuthClient } from "@repo/better-auth-hook";
import type { FC } from "react";
import { Button } from "@/components/ui/button";

export const VerifyEmailCard: FC = () => {
  const authClient = useAuthClient();

  return (
    <div>
      <h1>Verify Email</h1>

      <Button
        onClick={() => {
          authClient.verifyEmail(
            { query: { token: "" } },
            {
              onSuccess: () => {},
              onError: () => {},
            },
          );
        }}
      >
        Verify Email
      </Button>
    </div>
  );
};
