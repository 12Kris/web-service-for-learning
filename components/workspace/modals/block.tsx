import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const BlockModal = ({ isOpen, onClose, onSave, blockName, setBlockName, currentBlock }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="hidden">Open</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{currentBlock ? "Edit Block" : "Create Block"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {currentBlock ? "Edit the name of the existing block." : "Create a new block for your course."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                    <input
                        type="text"
                        value={blockName}
                        onChange={(e) => setBlockName(e.target.value)}
                        placeholder="Block Name"
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
