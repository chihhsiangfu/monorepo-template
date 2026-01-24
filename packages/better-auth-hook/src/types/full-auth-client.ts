import {
  adminClient,
  apiKeyClient,
  lastLoginMethodClient,
  oneTapClient,
  organizationClient,
  // passkeyClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    apiKeyClient(),
    twoFactorClient(),
    // passkeyClient(),
    oneTapClient({
      clientId: "",
    }),
    lastLoginMethodClient(),
    organizationClient(),
  ],
});

export type FullAuthClient = typeof authClient;

export type Session = FullAuthClient["$Infer"]["Session"]["session"];
export type User = FullAuthClient["$Infer"]["Session"]["user"];
