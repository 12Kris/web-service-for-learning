import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FC } from "react";
import { Module } from "@/lib/types/learning";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  blockName: string;
  setBlockName: (name: string) => void;
  blockDescription: string;
  setBlockDescription: (description: string) => void;
  // currentBlock?: { id: number; name: string } | null;
  currentBlock?: Module | null;
}

const BlockModal: FC<BlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  blockName,
  setBlockName,
  blockDescription,
  setBlockDescription,
  currentBlock,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentBlock ? "Edit Module" : "Create Module"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {currentBlock
              ? "Edit the name of the existing module."
              : "Create a new module for your course."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <div>
            <label className="font-medium">Name:</label>
            <input
              type="text"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="Module Name"
              className="w-full p-2 border border-2 border-input rounded-lg bg-[--card] my-2"
            />
          </div>

          <div className="mt-2">
            <label className="font-medium">Description:</label>
            {/* <input
              type="text"
              value={blockDescription}
              onChange={(e) => setBlockDescription(e.target.value)}
              placeholder="Module Description"
              className="w-full p-2 border border-2 border-input rounded-lg bg-[--card] my-2"
            /> */}
            <textarea
              value={blockDescription}
              onChange={(e) => setBlockDescription(e.target.value)}
              placeholder="Module Description"
              className="w-full p-2 border border-2 border-input rounded-lg bg-[--card] my-2"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockModal;
