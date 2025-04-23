import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getCardsByLearningMaterial } from "@/lib/courses/actions";
import { LearningMaterial } from "@/lib/types/learning";
import { Card } from "@/lib/types/card";

export function MaterialModal({
  isOpen,
  onClose,
  onSave,
  materialTitle,
  setMaterialTitle,
  currentMaterial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, contents: { front: string; back: string }[]) => void;
  materialTitle: string;
  setMaterialTitle: (title: string) => void;
  currentMaterial: LearningMaterial | null;
  blockId: number | null;
  materialContents: Card[];
  setMaterialContents: (contents: Card[] | ((prev: Card[]) => Card[])) => void;
}) {
  const [initialCards, setInitialCards] = useState<Card[]>([]);
  const [newCards, setNewCards] = useState<Card[]>([]);

  useEffect(() => {
    const loadCards = async () => {
      if (currentMaterial?.id) {
        const cards = await getCardsByLearningMaterial(currentMaterial.id);
        setInitialCards(cards.map((card: Card) => ({
          front: card.front || "",
          back: card.back || "",
        })));
        setNewCards([]);
      } else {
        setInitialCards([]);
        setNewCards([]);
      }
    };

    if (isOpen) {
      loadCards();
    }
  }, [isOpen, currentMaterial]);

  useEffect(() => {
    if (currentMaterial) {
      setMaterialTitle(currentMaterial.title || "");
    } else {
      setMaterialTitle("");
    }
  }, [currentMaterial, setMaterialTitle]);

  const handleAddCard = () => {
    setNewCards((prev) => [...prev, { front: "", back: "" }]);
  };

  const handleRemoveCard = (index: number) => {
    setNewCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardChange = (
    index: number,
    side: "front" | "back",
    value: string
  ) => {
    setNewCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [side]: value } : card))
    );
  };

  const handleSave = () => {
    if (!materialTitle.trim()) {
      alert("Please provide a material title.");
      return;
    }

    const allCards = [...initialCards, ...newCards];
    if (allCards.every((card) => card.front.trim() && card.back.trim())) {
      onSave(materialTitle, allCards);
      onClose();
    } else {
      alert("Please fill in all card fronts and backs.");
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
            Add material details and associated cards.
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
              className="input w-full p-2 border border-2 border-input rounded-lg bg-[--card]"
            />
          </div>
          <div>
            <label className="font-medium">Cards: </label>
            {newCards.map((card, index) => (
              <div key={index} className="flex gap-2 items-center m-2">
                <input
                  type="text"
                  value={card.front}
                  onChange={(e) =>
                    handleCardChange(index, "front", e.target.value)
                  }
                  placeholder="Front"
                  className="input w-full p-2 border border-2 border-input rounded-lg bg-[--card]"
                />
                <input
                  type="text"
                  value={card.back}
                  onChange={(e) =>
                    handleCardChange(index, "back", e.target.value)
                  }
                  placeholder="Back"
                  className="input w-full p-2 border border-2 border-input rounded-lg bg-[--card]"
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
            <Button onClick={handleAddCard} variant="outline" className="mt-3">
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