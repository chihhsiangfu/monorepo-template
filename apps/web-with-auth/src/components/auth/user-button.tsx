"use client";

import { useAuthClient } from "@repo/better-auth-hook";
import { ChevronDown, LogOut } from "lucide-react";
import type { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserButton: FC = () => {
  const authClient = useAuthClient();
  const { data: session } = authClient.useSession();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="cursor-pointer select-none px-2!"
            size="lg"
            variant="outline"
          >
            <Avatar className="aspect-square size-7">
              {!session?.user?.image && (
                <AvatarFallback className="bg-neutral-300 dark:bg-neutral-700">
                  {session?.user?.name?.[0]}
                </AvatarFallback>
              )}
              {session?.user?.image && (
                <AvatarImage
                  alt={session?.user?.name}
                  onError={(e) =>
                    (e.currentTarget as HTMLImageElement).classList.add(
                      "hidden",
                    )
                  }
                  src={session?.user?.image}
                />
              )}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user?.name}
              </span>
              <span className="truncate text-xs">{session?.user?.email}</span>
            </div>
            <ChevronDown className="ml-auto" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          sideOffset={4}
        >
          {/* <DropdownMenuLabel className="text-muted-foreground text-xs">
            Organizations
          </DropdownMenuLabel>

          <DropdownMenuSeparator /> */}

          <DropdownMenuItem
            className="gap-2 p-2"
            onClick={() => {
              authClient.signOut();
            }}
          >
            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
              <LogOut className="size-4" />
            </div>
            <div className="font-medium text-muted-foreground">Sign out</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
