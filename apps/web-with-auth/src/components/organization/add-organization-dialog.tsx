"use client";

import {
  useAuthClient,
  useCreateOrganizationMutation,
} from "@repo/better-auth-hook";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AddOrganizationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSetActiveOrganization?: (organizationId: string | null) => void;
}

export const AddOrganizationDialog: FC<AddOrganizationDialogProps> = ({
  isOpen,
  onOpenChange,
  onSetActiveOrganization,
}) => {
  const authClient = useAuthClient();

  const [newOrganizationName, setNewOrganizationName] = useState("");

  const { mutate: createOrganization, isPending: isPendingCreateOrganization } =
    useCreateOrganizationMutation({
      onSuccess: async (organizationId) => {
        setNewOrganizationName("");
        onOpenChange(false);

        await authClient.organization.setActive({
          organizationId,
        });

        onSetActiveOrganization?.(organizationId);
      },
    });

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Organization</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            autoFocus
            onChange={(e) => setNewOrganizationName(e.target.value)}
            placeholder="Enter organization name"
            value={newOrganizationName}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              !newOrganizationName.trim() || isPendingCreateOrganization
            }
            onClick={() => {
              createOrganization({ name: newOrganizationName });
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
