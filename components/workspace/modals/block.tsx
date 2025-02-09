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
import {Label} from "@radix-ui/react-menu";
import {Module} from "@/lib/definitions";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  blockName: string;
  setBlockName: (name: string) => void;
  blockDescription: string;
  setBlockDescription: (description: string) => void;
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
                  ? "Edit the name and description of the existing module."
                  : "Create a new module for your course."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 space-y-4">
            <div>
              <Label>Module Name</Label>
              <input
                  type="text"
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  placeholder="Module Name"
                  className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <Label>Module Description</Label>
              <textarea
                  value={blockDescription}
                  onChange={(e) => setBlockDescription(e.target.value)}
                  placeholder="Module Description"
                  className="w-full p-2 border border-gray-300 rounded"
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