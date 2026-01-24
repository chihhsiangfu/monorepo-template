"use client";

import { useAuthClient } from "@repo/better-auth-hook";
import type { FC } from "react";
import { Button } from "@/components/ui/button";

export const ForgetPasswordCard: FC = () => {
  const authClient = useAuthClient();

  return (
    <div>
      <h1>Forget Password</h1>

      <Button
        onClick={() => {
          authClient.requestPasswordReset(
            { email: "" },
            {
              onSuccess: () => {},
              onError: () => {},
            },
          );
        }}
      >
        Forget Password
      </Button>
    </div>
  );
};
