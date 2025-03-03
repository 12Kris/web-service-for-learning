"use client";

import { useEffect, useState } from "react";
import Flashcard from "@/components/card/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-3xl p-8 shadow-sm">
        <div className="items-center gap-4">
          {/* <button
            onClick={handlePrev}
            className="flex items-center justify-center h-10 px-4 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
            aria-label="Previous card"
          >
            <ChevronLeft className="mr-1" size={20} />
            <span>Previous</span>
          </button> */}
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
          <div className="flex justify-center mt-5 space-x-5">
            <button
              onClick={handlePrev}
              // className="flex items-center justify-center h-10 px-4 rounded-lg bg-zinc-300 text-zinc-900 hover:bg-zinc-200 transition-colors"
              className="flex items-center justify-center h-10 px-4 rounded-lg bg-[--neutral] text-white hover:bg-[--neutral]/70 transition-colors"
              aria-label="Previous card"
            >
              <ChevronLeft className="mr-1" size={20} />
              <span className="w-28">Previous</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center h-10 px-4 rounded-lg bg-[--neutral] text-white hover:bg-[--neutral]/70 transition-colors"
              aria-label="Next card"
            >
              <span className="w-28">Next</span>
              <ChevronRight className="ml-1" size={20} />
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="flex gap-1">
            {flashcards.map((_, index) => (
              <div
                key={index}
                className={`w-16 h-1 rounded-full ${
                  index === currentCard ? "bg-[--neutral]" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
