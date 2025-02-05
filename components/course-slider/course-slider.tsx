"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card/course-card";
import Link from "next/link";
import { Course } from "@/lib/definitions";

interface CourseCarouselProps {
  title: string;
  courses: Course[];
}

export function CourseCarousel({ title, courses }: CourseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - cardsPerView + courses.length) % courses.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + cardsPerView) % courses.length);
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="default" size="icon" onClick={handlePrevClick}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous courses</span>
          </Button>
          <Button variant="default" size="icon" onClick={handleNextClick}>
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next courses</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
          }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className={`w-full flex-none px-2 ${
                cardsPerView === 3
                  ? "lg:w-1/3"
                  : cardsPerView === 2
                  ? "sm:w-1/2"
                  : "w-full"
              }`}
            >
              <Link href={`/workspace/course/${course.id}`}>
                <CourseCard
                  title={course.name}
                  topic={course.type || ""}
                  thermsCount={0}
                  description={course.description || ""}
                  author={course.creator?.full_name || ""}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}