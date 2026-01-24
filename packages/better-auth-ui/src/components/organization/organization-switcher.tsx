"use client";

import { useAuthClient } from "@repo/better-auth-hook";
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddOrganizationDialog } from "./add-organization-dialog";

export const OrganizationSwitcher: FC<{
  onSetActiveOrganization?: (organizationId: string | null) => void;
}> = ({ onSetActiveOrganization }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const authClient = useAuthClient();

  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <>
      <AddOrganizationDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSetActiveOrganization={onSetActiveOrganization}
      />

      <div>
        <DropdownMenu>
          {activeOrganization ? (
            <DropdownMenuTrigger asChild>
              <Button
                className="cursor-pointer select-none"
                size="lg"
                variant="outline"
              >
                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {!activeOrganization.logo && (
                    <GalleryVerticalEnd className="size-4" />
                  )}
                  {activeOrganization.logo && (
                    <img
                      alt={activeOrganization.name}
                      height={32}
                      onError={(e) =>
                        (e.currentTarget as HTMLImageElement).classList.add(
                          "hidden",
                        )
                      }
                      src={activeOrganization.logo}
                      width={32}
                    />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeOrganization.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeOrganization.id}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </Button>
            </DropdownMenuTrigger>
          ) : (
            <DropdownMenuTrigger asChild>
              <Button
                className="cursor-pointer select-none"
                size="lg"
                variant="outline"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Select Organization
                  </span>
                  {/* <span className="truncate text-xs">-</span> */}
                </div>
                <ChevronsUpDown className="ml-auto" />
              </Button>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>

            {organizations?.map((org) => (
              <DropdownMenuItem
                className="gap-2 p-2"
                key={org.id}
                onClick={async () => {
                  await authClient.organization.setActive({
                    organizationId: org.id,
                  });

                  onSetActiveOrganization?.(org.id);
                }}
              >
                <div className="flex size-6 items-center justify-center overflow-hidden rounded-sm border">
                  {!org.logo && (
                    <GalleryVerticalEnd className="size-4 shrink-0" />
                  )}
                  {org.logo && (
                    <img
                      alt={org.name}
                      height={32}
                      onError={(e) =>
                        (e.currentTarget as HTMLImageElement).classList.add(
                          "hidden",
                        )
                      }
                      src={org.logo}
                      width={32}
                    />
                  )}
                </div>
                {org.name}
                {/* <DropdownMenuShortcut>⌘1</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
