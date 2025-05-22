"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { FilterModal } from "@/components/workspace/modals/filter-modal";
import type { Course } from "@/lib/types/course";
import { Card, CardContent } from "../ui/card";
// import { Input } from "../ui/input";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import type { Swiper as SwiperType } from "swiper";

interface ClientComponentProps {
  initialCourses: Course[];
  initialLatestCourses: Course[];
  initialPopularCourses: Course[];
  initialCoursesByType: Record<string, { displayName: string; courses: Course[] }>;
  initialCourseTypes: string[];
  autoplay?: boolean;
  showPagination?: boolean;
}

export default function BrowsePage({
  initialCourses,
  initialLatestCourses,
  initialPopularCourses,
  initialCoursesByType,
  initialCourseTypes,
  autoplay = false,
  showPagination = false,
}: ClientComponentProps) {
  const [courses] = useState<Course[]>(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(initialCourses);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [coursesByType, setCoursesByType] = useState(initialCoursesByType);
  const [courseTypes, setCourseTypes] = useState(initialCourseTypes);
  const [searchText, setSearchText] = useState("");
  // const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  // const [isBeginning, setIsBeginning] = useState(true);
  // const [isEnd, setIsEnd] = useState(false);

  const groupCoursesByType = (coursesToGroup: Course[]) => {
    const groupedCourses = coursesToGroup.reduce((acc, course) => {
      const normalizedType = (course.type || "Uncategorized").toLowerCase();
      const displayType =
        normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);

      if (!acc[normalizedType]) {
        acc[normalizedType] = {
          displayName: displayType,
          courses: [],
        };
      }

      acc[normalizedType].courses.push(course);
      return acc;
    }, {} as Record<string, { displayName: string; courses: Course[] }>);

    setCoursesByType(groupedCourses);
    setCourseTypes(Object.keys(groupedCourses));
  };

  const applySearchFilter = (search: string, types: string[]) => {
    let newFilteredCourses = [...courses];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      newFilteredCourses = newFilteredCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchLower) ||
          (course.type && course.type.toLowerCase().includes(searchLower)),
      );
    }

    if (types.length > 0) {
      newFilteredCourses = newFilteredCourses.filter((course) =>
        types.includes((course.type || "Uncategorized").toLowerCase()),
      );
    }

    setFilteredCourses(newFilteredCourses);
    setIsFilterActive(newFilteredCourses.length !== courses.length || search.trim() !== "" || types.length > 0);
    groupCoursesByType(newFilteredCourses);
  };

  const handleCategoryClick = (type: string) => {
    const normalizedType = type.toLowerCase();
    let newSelectedTypes = [...selectedTypes];

    if (newSelectedTypes.includes(normalizedType)) {
      newSelectedTypes = newSelectedTypes.filter((t) => t !== normalizedType);
    } else {
      newSelectedTypes.push(normalizedType);
    }

    setSelectedTypes(newSelectedTypes);
    applySearchFilter(searchText, newSelectedTypes);
  };

  useEffect(() => {
    applySearchFilter(searchText, selectedTypes);
  }, [searchText, courses]);

  const handleFilterApply = (newFilteredCourses: Course[], activeTypes: string[]) => {
    setFilteredCourses(newFilteredCourses);
    setSelectedTypes(activeTypes);

    const isFiltered =
      newFilteredCourses.length !== courses.length ||
      newFilteredCourses.some((course, index) => course.id !== courses[index]?.id);
    setIsFilterActive(isFiltered);

    groupCoursesByType(newFilteredCourses);
  };

  return (
    <div>
      <div className="container mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4">
          <PageHeader className="mt-0 mb-3 md:mb-0" title="Browse courses" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7d73]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {/* <Input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c7d73]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            /> */}
          </div>
          <Button
            variant="default"
            className="col-span-1 w-full sm:w-auto sm:size-wide flex items-center justify-center"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter strokeWidth={3} className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
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
            // onSwiper={(swiper) => setSwiperInstance(swiper)}
            // onSlideChange={(swiper) => {
            //   setIsBeginning(swiper.isBeginning);
            //   setIsEnd(swiper.isEnd);
            // }}
            className="w-full"
          >
            {courseTypes.map((type) => (
              <SwiperSlide key={coursesByType[type].displayName} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Card
                  onClick={() => handleCategoryClick(type)}
                  className={cn(
                    "transition-colors",
                    selectedTypes.includes(type.toLowerCase())
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  )}
                >
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">{coursesByType[type].displayName}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{coursesByType[type].courses.length} courses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* <div className=" border-b border-b-[--border] "></div> */}

        {filteredCourses.length === 0 ? (
          <div className="text-center text-lg">No courses available!</div>
        ) : (
          <>
            {isFilterActive ? (
              selectedTypes.length === 1 ? (
                <CourseGrid
                  title={
                    coursesByType[selectedTypes[0]]?.displayName ||
                    selectedTypes[0].charAt(0).toUpperCase() + selectedTypes[0].slice(1)
                  }
                  courses={coursesByType[selectedTypes[0]]?.courses || []}
                />
              ) : selectedTypes.length > 1 ? (
                selectedTypes.map((type) => (
                  <div key={type} className="mb-12">
                    <CourseCarousel
                      title={
                        coursesByType[type]?.displayName ||
                        type.charAt(0).toUpperCase() + type.slice(1)
                      }
                      courses={coursesByType[type]?.courses || []}
                    />
                  </div>
                ))
              ) : (
                <CourseGrid title="Search Results" courses={filteredCourses} />
              )
            ) : (
              <>
                <CourseCarousel
                  title="Latest"
                  courses={initialLatestCourses.slice(0, 10)}
                />
                <CourseCarousel
                  title="Popular"
                  courses={initialPopularCourses.slice(0, 10)}
                />
                <CourseGrid title="All courses" courses={filteredCourses} />
              </>
            )}
          </>
        )}
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        courses={courses}
        onFilter={handleFilterApply}
      />
    </div>
  );
}