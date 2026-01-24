"use client";

import { Loader } from "lucide-react";
import type { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: string;
  targetName: string;
  onSubmit: (data: { id: string }) => void;
  isLoading?: boolean;
}

export const DeleteDialog: FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  targetId,
  targetName,
  onSubmit,
  isLoading,
}) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {targetName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <p>Are you sure you want to delete this {targetName}?</p>
          {/* <p>({targetId})</p> */}
          <p className="text-muted-foreground text-xs">
            This action cannot be undone. This will permanently delete this{" "}
            {targetName}.
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isLoading} variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button
            disabled={isLoading}
            onClick={() => {
              onSubmit({ id: targetId });
              onOpenChange(false);
            }}
            variant="destructive"
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
