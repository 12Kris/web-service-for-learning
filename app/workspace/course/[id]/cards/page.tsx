'use client';

import { useEffect, useState } from 'react';
import Flashcard from '@/components/card/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCardsByBlock } from '@/lib/courses/actions';
import { useRouter } from 'next/navigation';
import { use } from 'react';



export default function FlashcardPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [cards, setCards] = useState<{ question: string; answer: string }[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);


  const { id } = use(params);
  
  useEffect(() => {
    async function fetchCards() {
      try {
        const data = await getCardsByBlock(id);
        if (!data || data.length === 0) {
          router.push('/');
        } else {
          setCards(data.map((card) => ({ question: card.question, answer: card.answer })));
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
        router.push('/');
      }
    }

    fetchCards();
  }, [id, router]);

  if (cards.length === 0) {
    return <div>Loading...</div>;
  }



  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };



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
                frontContent={cards[currentCard].question}
                backContent={cards[currentCard].answer}
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
  );
}
