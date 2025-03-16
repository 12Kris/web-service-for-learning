"use client";

import { useEffect, useState } from "react";
import Flashcard from "@/components/card/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { getCardsByLearningMaterial } from "@/lib/courses/actions";
import { FlashCards } from "@/lib/definitions";
import { saveCardResult } from "@/lib/results/actions";

export default function CardPage() {
    const params = useParams();
    const cardId = Number(params.cardId);
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [flashcards, setFlashcards] = useState<FlashCards[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [selection, setSelection] = useState<Record<number, boolean>>({});
    const [rating, setRating] = useState<number | null>(null);

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

    const handleSelectionChange = (flashcardId: number, value: boolean) => {
        setSelection((prevSelection) => ({
            ...prevSelection,
            [flashcardId]: value,
        }));
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
        console.log(cardId, startTime, endTime, selection, rating)
        const result = await saveCardResult(cardId, startTime, endTime, selection, rating);
        if (result) {
            console.log("Success");
            console.log(result)
        } else {
            console.log(result)
        }
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
                <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSelectionChange(flashcards[currentCard]?.id, true)}
                            className="w-8 h-8 rounded-full bg-green-500 text-white"
                        >
                            ✓
                        </button>
                        <button
                            onClick={() => handleSelectionChange(flashcards[currentCard]?.id, false)}
                            className="w-8 h-8 rounded-full bg-red-500 text-white"
                        >
                            ✗
                        </button>
                    </div>
                    <div className="mt-4">
                        <label className="block text-center mb-2">How did you find the material?</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            value={rating || ""}
                            onChange={(e) => handleRatingChange(Number(e.target.value))}
                            className="w-16 text-center border border-gray-300 rounded-lg p-2"
                            placeholder="1-5"
                        />
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={saveCardResultsHandler}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Save Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
