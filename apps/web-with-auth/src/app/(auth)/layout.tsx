"use client";

import { UnauthenticatedSection } from "@repo/better-auth-ui";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UnauthenticatedSection>{children}</UnauthenticatedSection>;
}
