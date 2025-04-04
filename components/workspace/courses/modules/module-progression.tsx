import { Module } from "@/lib/types/modules";
import Link from "next/link"; // added import
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { cn } from "@/lib/utils";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// interface CourseCarouselProps {
//   title: string;
//   courses: Course[];
//   className?: string;
//   autoplay?: boolean;
//   showPagination?: boolean;
// }

interface ModuleProgressionProps {
  modules: Module[];
  currentModuleId: number;
  courseId: number; // added prop

  className?: string;
  autoplay?: boolean;
  showPagination?: boolean;
}

export function ModuleProgression({
  modules,
  currentModuleId,
  courseId,
  className,
  autoplay = false,
  showPagination = false,
}: ModuleProgressionProps) {
  // Ensure the currentModuleId is an integer.
  const currentModuleIdInt = Math.floor(currentModuleId);

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative flex justify-between items-center mb-16">
      {/* Connecting Lines */}
      {/* <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[--accent-light] -translate-y-1/2" /> */}

      <section className={cn("w-full", className)}>
        <div className="flex items-center justify-between mb-6">
          {/* <h2 className="text-2xl font-bold">{title}</h2> */}
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
            {modules.map((module, index) => {
              // Convert module.id to an integer for comparison.               ${module.isCompleted ? 'text-white bg-[--accent] border-[--accent]' : 'bg-[--background]'}

              const moduleIdInt = Math.floor(module.id);
              const isActive = moduleIdInt === currentModuleIdInt;
              return (
                <SwiperSlide key={module.id || index} className="h-auto all">
                  <Link
                    key={module.id}
                    href={`/workspace/courses/${courseId}/modules/${module.id}`}
                  >
                    <div className="relative z-10 cursor-pointer">
                      <div
                        className={`px-4 py-2 rounded-2xl font-bold border-2 hover:bg-[--accent] hover:text-white ${
                          isActive
                            ? "text-[--accent] border-[--accent] bg-[--accent] text-white "
                            : "text-[--accent] border-[--accent] bg-[--background]"
                        }
                `}
                      >
                        {module.title}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}

            {/* {courses.map((course, index) => (
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
          ))} */}
          </Swiper>
        </div>
      </section>

      {/* {modules.map((module) => {
        // Convert module.id to an integer for comparison.               ${module.isCompleted ? 'text-white bg-[--accent] border-[--accent]' : 'bg-[--background]'}

        const moduleIdInt = Math.floor(module.id);
        const isActive = moduleIdInt === currentModuleIdInt;
        return (
          <Link key={module.id} href={`/workspace/courses/${courseId}/modules/${module.id}`}>
            <div className="relative z-10 cursor-pointer">
              <div 
                className={`px-4 py-2 rounded-2xl font-bold border-2 hover:bg-[--accent] hover:text-white ${
                  isActive
                    ? 'text-[--accent] border-[--accent] bg-[--accent] text-white '
                    : 'text-[--accent] border-[--accent] bg-[--background]'
                }
                `}
              >
                {module.title}
              </div>
            </div> 
          </Link>
        );
      })} */}
    </div>
  );
}

export default ModuleProgression;
