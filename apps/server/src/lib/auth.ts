import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, apiKey, openAPI } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema/auth-schema";
import { cookieSettings } from "./better-auth-options/cookie-settings";
import { organizationPlugin } from "./better-auth-options/organization-plugin";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BASE_URL!,
  trustedOrigins: [process.env.WEB_APP_URL!, process.env.NATIVE_APP_SCHEME!],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  advanced: {
    database: {
      generateId: () => {
        return crypto.randomUUID();
      },
    },
    ...cookieSettings,
  },
  experimental: {
    joins: true,
  },
  logger: {
    level: "debug",
  },
  // databaseHooks: {
  //   user: {
  //     create: {
  //       before: async (user: any) => {
  //         return await hookBeforeCreateUser(user);
  //       },
  //       after: async (user: any) => {
  //         await hookAfterCreateUser(user);
  //       },
  //     },
  //   },
  // },
  plugins: [organizationPlugin, admin({}), apiKey({}), openAPI({})],
});
