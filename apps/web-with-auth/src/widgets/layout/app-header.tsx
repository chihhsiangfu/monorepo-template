"use client";

import { useRouter } from "next/navigation";
import { type FC, Fragment } from "react";
import { UserButton } from "@/components/auth/user-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggler } from "./theme-toggler";

export type BreadcrumbType = {
  type: "link" | "page";
  label: string;
  url?: string;
};

export const AppHeader: FC<{ breadcrumbs: BreadcrumbType[] }> = ({
  breadcrumbs,
}) => {
  const router = useRouter();

  return (
    <header className="flex items-center justify-start gap-3 border-muted border-b px-4 py-2">
      <SidebarTrigger />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb) => {
            if (breadcrumb.type === "page") {
              return (
                <BreadcrumbItem key={breadcrumb.label}>
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                </BreadcrumbItem>
              );
            }

            return (
              <Fragment key={breadcrumb.label}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={breadcrumb.url}>
                    {breadcrumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex-1" />

      <ThemeToggler />

      <UserButton />
    </header>
  );
};
