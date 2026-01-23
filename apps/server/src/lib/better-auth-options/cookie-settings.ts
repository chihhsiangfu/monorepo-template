export const cookieSettings:
  | {
      defaultCookieAttributes: {
        sameSite: "none";
        secure: boolean;
        partitioned: boolean;
      };
    }
  | {
      crossSubDomainCookies: {
        enabled: boolean;
      };
    } =
  process.env.NODE_ENV === "development"
    ? {
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,
          partitioned: true, // New browser standards will mandate this for foreign cookies
        },
      }
    : {
        crossSubDomainCookies: {
          enabled: true,
        },
      };
