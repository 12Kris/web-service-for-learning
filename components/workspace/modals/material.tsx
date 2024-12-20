import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function MaterialModal({
                                  isOpen,
                                  onClose,
                                  onSave,
                                  materialTitle,
                                  materialContent,
                                  setMaterialTitle,
                                  setMaterialContent,
                                  currentMaterial,
                                  blockId,
                              }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (blockId: number) => void;
    materialTitle: string;
    materialContent: string;
    setMaterialTitle: (title: string) => void;
    setMaterialContent: (content: string) => void;
    currentMaterial: any;
    blockId: number | null;
}) {
    const handleSave = () => {
        if (blockId !== null) {
            console.log("Saving...")
            onSave(blockId);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogTrigger />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{currentMaterial ? "Edit Material" : "Create Material"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {currentMaterial ? "Update material details" : "Create a new material"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="font-medium">Title</label>
                        <input
                            type="text"
                            value={materialTitle}
                            onChange={(e) => setMaterialTitle(e.target.value)}
                            placeholder="Enter title"
                            className="input"
                        />
                    </div>
                    <div>
                        <label className="font-medium">Content</label>
                        <textarea
                            value={materialContent}
                            onChange={(e) => setMaterialContent(e.target.value)}
                            placeholder="Enter content"
                            className="input"
                        />
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>
                        {currentMaterial ? "Save" : "Create"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
