import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getCardsByLearningMaterial } from "@/lib/courses/actions";

export function MaterialModal({
  isOpen,
  onClose,
  onSave,
  materialTitle,
  setMaterialTitle,
  currentMaterial,
  blockId,
  materialContents,
  setMaterialContents,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blockId: number, materials: any[]) => void;
  materialTitle: string;
  setMaterialTitle: (title: string) => void;
  currentMaterial: any;
  blockId: number | null;
  materialContents: { front: string, back: string }[];
  setMaterialContents: (contents: { front: string, back: string }[]) => void;
}) {
  useEffect(() => {
    if (currentMaterial && currentMaterial.id) {
      const loadCards = async () => {
        const cards = await getCardsByLearningMaterial(currentMaterial.id);
        const formattedCards = cards.map((card: any) => ({
          front: card.front,
          back: card.back
        }));
        setMaterialContents(formattedCards);
      };

      loadCards();
    }
  }, [isOpen, currentMaterial, setMaterialContents]);

  const handleAddCard = () => {
    setMaterialContents([...materialContents, { front: "", back: "" }]);
  };

  const handleRemoveCard = (index: number) => {
    const newContents = materialContents.filter((_, i) => i !== index);
    setMaterialContents(newContents);
  };

  const handleSave = () => {
    if (blockId !== null) {
      onSave(blockId, materialContents);
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

          <div className="flex flex-col gap-4">
            <label className="font-medium">Content</label>
            {materialContents?.map((card, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={card.front}
                  onChange={(e) => {
                    const newContents = [...materialContents];
                    newContents[index].front = e.target.value;
                    setMaterialContents(newContents);
                  }}
                  placeholder="Front content"
                  className="input"
                />
                <input
                  type="text"
                  value={card.back}
                  onChange={(e) => {
                    const newContents = [...materialContents];
                    newContents[index].back = e.target.value;
                    setMaterialContents(newContents);
                  }}
                  placeholder="Back content"
                  className="input"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveCard(index)}
                >
                  -
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={handleAddCard}
              variant="outline"
            >
              + Add Card
            </Button>
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
