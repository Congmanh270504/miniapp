import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isPending } from "@reduxjs/toolkit";

interface DeleteSongDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  songTitle?: string;
  isPending: boolean; // Optional prop to indicate if the action is pending
}

const DeleteSongDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  songTitle = "this song",
  isPending = false, // Default to false if not provided
}: DeleteSongDialogProps) => {
  const handleDelete = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Song</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{songTitle}</strong> song?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {isPending ? (
            <Button variant="destructive" disabled>
              <div className="flex items-center gap-2">
                Deleting{" "}
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSongDialog;
