"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "swiper/css/pagination";

import { Card } from "@/components/study-card/card";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Swiper as SwiperType } from "swiper";

interface StudyTopic {
  id: string;
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
  textColor?: string;
  variant: "top" | "bottom";
  imagePosition: "top" | "bottom";
  arrowPosition: "top-left" | "bottom-left";
}

interface StudyCarouselProps {
  title: string;
  topics: StudyTopic[];
  autoplay?: boolean;
  showPagination?: boolean;
}

export function StudyCarousel({
  title,
  topics,
  autoplay = false,
  showPagination = false,
}: StudyCarouselProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <section className="w-full max-w-[90vw] mx-auto">
      <div className="flex flex-row items-center justify-between mb-6 w-full">
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-[--neutral] mb-4 sm:mb-0">
          {title}
        </h2>
        <div className="flex items-center justify-end   gap-2">
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
        {topics.map((topic) => (
          <SwiperSlide key={topic.id}>
            <Card {...topic} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
