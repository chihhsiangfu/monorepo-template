"use client";

import { UnauthenticatedSection } from "@/components/auth/unauthenticated-section";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UnauthenticatedSection>{children}</UnauthenticatedSection>;
}
