import React, { useState, useRef } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateFolderModal = ({
  isOpen,
  onClose,
  folderName,
  setFolderName,
  onCreateFolder,
  isLoading,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Folder</DialogTitle>
      </DialogHeader>
      <Input
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Enter folder name"
        disabled={isLoading}
      />
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onCreateFolder}
          disabled={isLoading}
          className="bg-deepPurple hover:bg-deepPurple"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default CreateFolderModal;
