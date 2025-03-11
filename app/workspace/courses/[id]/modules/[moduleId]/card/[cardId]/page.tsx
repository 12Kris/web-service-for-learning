"use client";

import { useEffect, useState } from "react";
import Flashcard from "@/components/card/card";
import { X, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { getCardsByLearningMaterial } from "@/lib/courses/actions";
import { FlashCards } from "@/lib/types/card";

export default function CardPage() {
  const params = useParams();
  const cardId = Number(params.cardId);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashCards[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (cardId) {
        const res = await getCardsByLearningMaterial(cardId);
        if (res && res.length > 0) {
          setFlashcards(res);
        }
      }
    };

    fetchData();
  }, [cardId]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-zinc-600">Loading flashcards...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl rounded-3xl p-8">
        <div className="items-center gap-4">
          <div className="flex-1">
            <div className="w-full h-[450px]">
              <Flashcard
                frontContent={flashcards[currentCard].front}
                backContent={flashcards[currentCard].back}
                isFlipped={isFlipped}
                onClick={handleFlip}
              />
            </div>
          </div>
          <div className="flex justify-center mt-5 space-x-5 items-center">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center h-10 w-24 border rounded-full transition-colors"
              aria-label="Previous card"
            >
              <X className="w-6 h-6 text-red-500" />
            </button>

          {/* Лічильник карток */}
          <div className="text-center text-lg font-medium text-gray-700 ">
            {currentCard + 1} / {flashcards.length}
          </div>

            <button
              onClick={handleNext}
              className="flex items-center justify-center h-10 w-24 border  rounded-full transition-colors"
              aria-label="Next card"
            >
              <Check className="w-6 h-6 text-green-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
