"use client";

import { useEffect, useState } from "react";
import Flashcard from "@/components/card/card";
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { getCardsByLearningMaterial } from "@/lib/courses/actions";
import { FlashCards } from "@/lib/types/card";
import { saveCardResult } from "@/lib/results/actions";

export default function CardPage() {
  const params = useParams() as {
    cardId: string;
    id: string;
    moduleId: string;
  };

  const cardId = Number(params.cardId);
  const courseId = params.id;
  const moduleId = params.moduleId;

  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<FlashCards[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const [rating, setRating] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, boolean | undefined>
  >({});

  const allAnswered =
    flashcards.length > 0 &&
    flashcards.every((card) => card.id !== undefined && selectedAnswers[card.id] !== undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (cardId) {
        const res = await getCardsByLearningMaterial(cardId);
        if (res && res.length > 0) {
          setFlashcards(res);
        }
      }
    };
    setStartTime(Date.now());
    fetchData();
  }, [cardId]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => Math.min(prev + 1, flashcards.length - 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => Math.max(prev - 1, 0));
  };

  const handleSelectionChange = (flashcardId: number | undefined, value: boolean) => {
    if (flashcardId === undefined) return;

    setSelection((prevSelection) => ({
      ...prevSelection,
      [flashcardId]: value,
    }));

    setSelectedAnswers((prev) => ({
      ...prev,
      [flashcardId]: value,
    }));
  };

  const handleSelection = (flashcardId: number | undefined, value: boolean) => {
    handleSelectionChange(flashcardId, value);
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const saveCardResultsHandler = async () => {
    const endTime = Date.now();
    if (rating === null) {
      alert("Please provide a rating.");
      return;
    }
    await saveCardResult(cardId, startTime, endTime, selection, rating);
    window.location.href = `/workspace/courses/${courseId}/modules/${moduleId}`;
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-zinc-600">Loading flashcards...</div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentCard];

  return (
    <div className="flex flex-col items-center justify-center md:p-8">
      <div className="w-full max-w-4xl rounded-3xl md:p-8">
        <div className="items-center gap-4">
          <div className="flex-1">
            <div className="w-full h-[425px] flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentCard === 0}
                className={`flex items-center justify-center h-10 w-24 border rounded-full transition-colors 
                  ${
                    currentCard === 0
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-white hover:bg-[--neutral]"
                  }`}
                aria-label="Previous card"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <Flashcard
                frontContent={currentFlashcard.front}
                backContent={currentFlashcard.back}
                isFlipped={isFlipped}
                onClick={handleFlip}
              />

              <button
                onClick={handleNext}
                disabled={currentCard === flashcards.length - 1}
                className={`flex items-center justify-center h-10 w-24 border rounded-full transition-colors 
                  ${
                    currentCard === flashcards.length - 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:text-white hover:bg-[--neutral]"
                  }`}
                aria-label="Next card"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-5 space-x-5 items-center">
            <button
              onClick={() => handleSelection(currentFlashcard?.id, false)}
              className={`flex items-center justify-center h-10 w-24 border rounded-full transition-colors
                ${
                  currentFlashcard?.id !== undefined && selectedAnswers[currentFlashcard?.id] === false
                    // ? "text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]"
                    ? "text-white bg-[--accent]"
                    : "hover:bg-[--accent] hover:text-white"
                }`}
              aria-label="Incorrect"
            >
              
              <X className="w-6 h-6" />
            </button>

            <div className="text-center text-lg font-medium text-gray-700">
              {currentCard + 1} / {flashcards.length}
            </div>

            <button
              onClick={() => handleSelection(currentFlashcard?.id, true)}
              className={`flex items-center justify-center h-10 w-24 border rounded-full transition-colors
                ${
                  currentFlashcard?.id !== undefined && selectedAnswers[currentFlashcard?.id] === true
                    // ? "text-[--neutral] bg-transparent border-2 border-[--neutral] hover:text-white hover:bg-[--neutral]"
                    ? "text-white bg-[--neutral]"
                    : "hover:bg-[--neutral] hover:text-white"
                }`}
              aria-label="Correct"
            >
              <Check className="w-6 h-6" />
            </button>
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

          {allAnswered && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="mt-4">
                <label className="block text-center mb-2">
                  How easy were the cards?
                </label>
                <div className="mt-4 flex gap-3">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rating || ""}
                    onChange={(e) =>
                      handleRatingChange(Number(e.target.value))
                    }
                    className="w-16 text-center border border-gray-300 rounded-lg p-2"
                    placeholder="1-5"
                  />
                  <button
                    onClick={saveCardResultsHandler}
                    className="px-6 py-2 hover:text-white hover:bg-[--neutral] rounded-lg border transition-colors"
                  >
                    Save Results
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}