"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Flashcard from "@/components/card/card";
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { getCardsByLearningMaterial } from "@/lib/courses/actions";
import type { FlashCards } from "@/lib/types/card";
import { saveCardResult } from "@/lib/results/actions";
import { PageHeader } from "@/components/ui/page-header";
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

import { completeMaterial } from "@/lib/courses/actions";
import Link from "next/link";

import { updateSpacedRepetitionWithAi } from "@/lib/courses/spaced-repetition-ai-actions";
import { Button } from "@/components/ui/button";

export default function CardPage() {
  const params = useParams() as {
    cardId: string;
    id: string;
    moduleId: string;
  };

  const cardId = Number(params.cardId);
  const courseId = Number(params.id);
  const moduleId = Number(params.moduleId);

  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<FlashCards[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selection, setSelection] = useState<Record<number, boolean>>({});
  const [rating, setRating] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, boolean | undefined>
  >({});
  const [isResultsUpdated, setIsResultsUpdated] = useState(false);

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const allAnswered =
    flashcards.length > 0 &&
    flashcards.every(
      (card) => card.id !== undefined && selectedAnswers[card.id] !== undefined
    );

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

  const handleupdateSpacedRepetitionWithAi = async () => {
    if (cardId) {
      await updateSpacedRepetitionWithAi(courseId, cardId);
      window.location.href = `/workspace/courses/${courseId}/modules/${moduleId}`;
    }
  };

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

  const handleSelectionChange = (
    flashcardId: number | undefined,
    value: boolean
  ) => {
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
    handleNext();
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
    await completeMaterial(cardId);
    setIsResultsUpdated(true);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
      // Prevent text selection when dragging with the cursor
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setTouchStart({ x: clientX, y: clientY });
    setTouchEnd(null);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart || !isDragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setTouchEnd({ x: clientX, y: clientY });

    const deltaX = clientX - touchStart.x;
    const deltaY = Math.abs(clientY - touchStart.y);

    if (deltaY < 50) {
      setSwipeOffset(Math.max(-150, Math.min(150, deltaX)));
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging) {
      setIsDragging(false);
      setSwipeOffset(0);
      return;
    }

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = Math.abs(touchEnd.y - touchStart.y);
    const minSwipeDistance = 100;

    if (deltaY < 50 && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        handleSelection(currentFlashcard?.id, true);
      } else {
        handleSelection(currentFlashcard?.id, false);
      }
    }

    setIsDragging(false);
    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
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
    <div className="flex flex-col items-center justify-center md:p-8 select-none text-[--neutral]">
      <div className="w-full max-w-4xl rounded-3xl md:p-8">
        <div className="items-center gap-4">
          {!allAnswered && (
            <>
              <div className="flex-1">
                <div className="w-full h-[425px] flex items-center gap-3">
                  <div
                    className="relative flex-1 touch-none select-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                    onMouseMove={isDragging ? handleTouchMove : undefined}
                    onMouseUp={handleTouchEnd}
                    onMouseLeave={handleTouchEnd}
                  >
                    <div
                      className="transition-transform duration-200 ease-out"
                      style={{
                        transform: `translateX(${swipeOffset}px)`,
                        opacity: isDragging ? 0.8 : 1,
                      }}
                    >
                      <Flashcard
                        frontContent={currentFlashcard.front}
                        backContent={currentFlashcard.back}
                        isFlipped={isFlipped}
                        onClick={handleFlip}
                      />
                    </div>

                    <div className="text-center mt-4 text-sm text-gray-600">
                      Swipe left to mark as unclear, swipe right to mark as clear
                    </div>
                    {isDragging && (
                      <>
                        <div
                          className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-200 ${
                            swipeOffset > 50 ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          <div className="bg-green-500 text-white p-3 rounded-full">
                            <Check className="w-6 h-6" />
                          </div>
                        </div>
                        <div
                          className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-200 ${
                            swipeOffset < -50 ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          <div className="bg-red-500 text-white p-3 rounded-full">
                            <X className="w-6 h-6" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-5 space-x-5 items-center md:hidden">
                <div className="text-center text-lg font-medium text-gray-700">
                  {currentCard + 1} / {flashcards.length}
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

              <div className="flex justify-center mt-5 space-x-5 items-center">
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
            </>
          )}
          {allAnswered && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="mt-4">
                <PageHeader
                  className="mb-10 text-center"
                  title={"How difficult were the cards?"}
                />

                <div className="mt-4 flex gap-3 flex-col align-center justify-center items-center">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={rating || ""}
                    onChange={(e) => handleRatingChange(Number(e.target.value))}
                    className="w-fit text-center border border-gray-300  rounded-lg p-2 text-3xl mb-7"
                    placeholder="0-5"
                  />
                  <Button
                    variant="default"
                    size="lg"
                    onClick={saveCardResultsHandler}
                  >
                    Save Results
                  </Button>
                </div>
              </div>
              <div></div>
            </div>
          )}

          {isResultsUpdated && (
            <AlertDialog open>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Do you want also to update spaced repetition?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will update the studying plan for the course
                    based on the results of this card.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col sm:flex-row justify-center gap-1 p-4">
                  <Link
                    href={`/workspace/courses/${courseId}/modules/${moduleId}`}
                    className="w-full sm:w-auto"
                  >
                    <AlertDialogCancel className="w-full sm:w-auto">Do not update</AlertDialogCancel>
                  </Link>
                  <AlertDialogAction
                    className="w-full sm:w-auto text-white bg-[--neutral] border-2 border-[--neutral] hover:text-white hover:bg-[--neutral]"
                    onClick={handleupdateSpacedRepetitionWithAi}
                  >
                    Update Spaced Repetition
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
