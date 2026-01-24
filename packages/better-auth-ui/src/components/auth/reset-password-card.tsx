"use client";

import { useAuthClient } from "@repo/better-auth-hook";
import type { FC } from "react";
import { Button } from "@/components/ui/button";

export const ResetPasswordCard: FC = () => {
  const authClient = useAuthClient();

  return (
    <div>
      <h1>Reset Password</h1>

      <Button
        onClick={() => {
          authClient.resetPassword(
            { token: "", newPassword: "" },
            {
              onSuccess: () => {},
              onError: () => {},
            },
          );
        }}
      >
        Reset Password
      </Button>
    </div>
  );
};
