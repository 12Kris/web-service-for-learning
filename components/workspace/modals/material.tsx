import { useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getCardsByLearningMaterial } from "@/lib/courses/actions";
import {Card, Module} from "@/lib/definitions";

export function MaterialModal({
  isOpen,
  onClose,
  onSave,
  materialTitle,
  setMaterialTitle,
  currentMaterial,
  // blockId,
  materialContents,
  setMaterialContents,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, contents: { front: string; back: string }[]) => void;
  materialTitle: string;
  setMaterialTitle: (title: string) => void;
  currentMaterial: Module;
  blockId: number | null;
  materialContents: { front: string; back: string }[];
  setMaterialContents: (contents: { front: string; back: string }[]) => void;
}) {
  useEffect(() => {
    if (currentMaterial?.id) {
      const loadCards = async () => {
        const cards = await getCardsByLearningMaterial(currentMaterial.id);
        setMaterialContents(
          cards.map((card: Card) => ({
            front: card.front || "",
            back: card.back || "",
          }))
        );
      };
      loadCards();
    } else {
      setMaterialContents([]);
    }
  }, [currentMaterial, setMaterialContents]);

  const handleAddCard = () => {
    setMaterialContents([...materialContents, { front: "", back: "" }]);
  };

  const handleRemoveCard = (index: number) => {
    setMaterialContents(materialContents.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (materialTitle.trim() && materialContents.length > 0) {
      onSave(materialTitle, materialContents);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentMaterial ? "Edit Material" : "Create Material"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Add or update material details and associated cards.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium">Title:</label>
            <input
              type="text"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="Enter title"
              className="input w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Cards:</label>
            {materialContents.map((card, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={card.front}
                  onChange={(e) =>
                    setMaterialContents((prev) =>
                      prev.map((c, i) =>
                        i === index ? { ...c, front: e.target.value } : c
                      )
                    )
                  }
                  placeholder="Front"
                  className="input w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={card.back}
                  onChange={(e) =>
                    setMaterialContents((prev) =>
                      prev.map((c, i) =>
                        i === index ? { ...c, back: e.target.value } : c
                      )
                    )
                  }
                  placeholder="Back"
                  className="input w-full p-2 border border-gray-300 rounded"
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
            <Button onClick={handleAddCard} variant="outline">
              + Add Card
            </Button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
