"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card/course-card";
import { Course } from "@/lib/types/course";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { cn } from "@/lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Swiper as SwiperType } from "swiper";

interface CourseCarouselProps {
  title: string;
  courses: Course[];
  className?: string;
  autoplay?: boolean;
  showPagination?: boolean;
}

export function CourseCarousel({
  title,
  courses,
  className,
  autoplay = false,
  showPagination = false,
}: CourseCarouselProps) {
  // Custom navigation references
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Responsive breakpoints
  // const isDesktop = useMediaQuery("(min-width: 1024px)");
  // const isTablet = useMediaQuery("(min-width: 640px)");

  // Handle empty courses array
  if (!courses || courses.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">
          No courses available at the moment.
        </p>
      </div>
    );
  }

  return (
    <section className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => swiperInstance?.slidePrev()}
            disabled={isBeginning}
            className="transition-opacity"
            aria-label="Previous courses"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => swiperInstance?.slideNext()}
            disabled={isEnd}
            className="transition-opacity"
            aria-label="Next courses"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 24 },
          }}
          pagination={showPagination ? { clickable: true } : false}
          autoplay={
            autoplay ? { delay: 5000, disableOnInteraction: false } : false
          }
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          className="w-full"
        >
          {courses.map((course, index) => (
            <SwiperSlide key={course.id || index} className="h-auto all">
              <CourseCard
                id={course.id}
                title={course.name}
                topic={course.type}
                color={course.color}
                studentsCount={course.student_count}
                description={course.description}
                instructor={course.creator?.full_name || "Unknown Instructor"}
                duration={course.last_completion_date || "Self-paced"}
                price="Free"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
