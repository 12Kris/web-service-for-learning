'use client'

import { useEffect, useState } from 'react'
import Flashcard from '@/components/card/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import { getCardsByLearningMaterial } from '@/lib/courses/actions'

export default function CardPage() {
    const params = useParams();
    const cardId = params.cardId;
    const [currentCard, setCurrentCard] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [flashcards, setFlashcards] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await getCardsByLearningMaterial(cardId);
            if (res && res.length > 0) {
                setFlashcards(res);
            }
        };

        fetchData();
    }, [cardId]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleNext = () => {
        setIsFlipped(false)
        setCurrentCard((prev) => (prev + 1) % flashcards.length)
    }

    const handlePrev = () => {
        setIsFlipped(false)
        setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }

    if (flashcards.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div>flashcards.length = 0...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl aspect-video border border-zinc-700 rounded-3xl p-6 flex items-center">
                <button
                    onClick={handlePrev}
                    className="text-zinc-500 hover:text-black transition-colors"
                    aria-label="Previous card"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 mx-4">
                    <Flashcard
                        frontContent={flashcards[currentCard].front}
                        backContent={flashcards[currentCard].back}
                        isFlipped={isFlipped}
                        onClick={handleFlip}
                    />
                </div>
                <button
                    onClick={handleNext}
                    className="text-zinc-500 hover:text-black transition-colors"
                    aria-label="Next card"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    )
}