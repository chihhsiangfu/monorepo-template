"use client";

import { useRouter } from "next/navigation";
import type { Dispatch, FC, SetStateAction } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export const CommandModal: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const router = useRouter();

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandInput placeholder="Type a command or search..." />

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">
          <CommandItem>Coming soon...</CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem
            onClick={() => {
              console.log("Account Settings");

              router.push("/account-settings");
            }}
          >
            Account Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
