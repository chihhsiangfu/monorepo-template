import type { createAuthClient } from "better-auth/react";

export type BasicAuthClient = Omit<
  ReturnType<typeof createAuthClient>,
  "signUp" | "getSession"
>;
