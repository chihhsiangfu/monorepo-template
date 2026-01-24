"use client";

import { AuthenticatedSection } from "@/components/auth/authenticated-section";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/widgets/app-sidebar/app-sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthenticatedSection>
      <SidebarProvider
        style={{
          // @ts-expect-error -- sidebar width is not typed
          "--sidebar-width": "200px",
          "--sidebar-width-mobile": "200px",
        }}
      >
        <AppSidebar />

        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AuthenticatedSection>
  );
}
