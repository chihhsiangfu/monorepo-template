import type { BetterAuthPlugin } from "better-auth";
import { organization } from "better-auth/plugins";

export const organizationPlugin = organization({
  // autoCreateOrganizationOnSignUp: true,
});
