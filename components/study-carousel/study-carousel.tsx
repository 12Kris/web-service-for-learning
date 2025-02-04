'use client'

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/study-card/card"

interface StudyTopic {
    id: string;
    title: string;
    description: string;
    image: string;
    backgroundColor: string;
    textColor?: string;
    variant: 'top' | 'bottom';
    imagePosition: 'top' | 'bottom';
    arrowPosition: 'top-left' | 'bottom-left';
}

interface StudyCarouselProps {
    title: string
    topics: StudyTopic[]
}

export function StudyCarousel({ title, topics }: StudyCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [cardsPerView, setCardsPerView] = useState(1)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1440) {
                setCardsPerView(3)
            } else if (window.innerWidth >= 1024) {
                setCardsPerView(3)
            } else if (window.innerWidth >= 768) {
                setCardsPerView(2)
            } else {
                setCardsPerView(1)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex - cardsPerView + topics.length) % topics.length)
    }

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + cardsPerView) % topics.length)
    }

    return (
        <section className="w-full max-w-[90vw] mx-auto">
            <div className="flex items-center justify-between mb-6 w-full">
                <h2 className="text-4xl font-bold text-center text-[--neutral] w-full">{title}</h2>
                <div className="flex gap-2 ml-auto">
                    <Button variant="outline" size="icon" onClick={handlePrevClick}>
                        <ArrowLeft className="h-4 w-4"/>
                        <span className="sr-only">Previous topics</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextClick}>
                        <ArrowRight className="h-4 w-4"/>
                        <span className="sr-only">Next topics</span>
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-in-out gap-0.5"
                    style={{transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`}}
                >
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className={`flex-none ${
                            cardsPerView === 3 ? 'lg:w-1/3' :
                            cardsPerView === 2 ? 'sm:w-1/2' : 'w-full'
                            }`}
                        >
                            <Card {...topic} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


