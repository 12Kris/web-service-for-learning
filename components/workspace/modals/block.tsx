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

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  blockName: string;
  setBlockName: (name: string) => void;
  currentBlock?: { id: number; name: string } | null;
}

const BlockModal: FC<BlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  blockName,
  setBlockName,
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
          <input
            type="text"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            placeholder="Module Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
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
