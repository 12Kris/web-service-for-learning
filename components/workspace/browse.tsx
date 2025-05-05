"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
// import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Sparkles } from "lucide-react";
import { FilterModal } from "@/components/workspace/modals/filter-modal";
import type { Course } from "@/lib/types/course";

interface ClientComponentProps {
  initialCourses: Course[];
  initialLatestCourses: Course[];
  initialPopularCourses: Course[];
  initialCoursesByType: Record<string, { displayName: string; courses: Course[] }>;
  initialCourseTypes: string[];
}

export default function BrowsePage({
  initialCourses,
  initialLatestCourses,
  initialPopularCourses,
  initialCoursesByType,
  initialCourseTypes,
}: ClientComponentProps) {
  const [courses] = useState<Course[]>(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(initialCourses);
  // const [popularCourses] = useState<Course[]>(initialPopularCourses);
  // const [isLoading] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [coursesByType, setCoursesByType] = useState(initialCoursesByType);
  const [courseTypes, setCourseTypes] = useState(initialCourseTypes);

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

  const handleFilterApply = (newFilteredCourses: Course[], activeTypes: string[]) => {
    setFilteredCourses(newFilteredCourses);
    setSelectedTypes(activeTypes);

    const isFiltered =
      newFilteredCourses.length !== courses.length ||
      newFilteredCourses.some((course, index) => course.id !== courses[index]?.id);
    setIsFilterActive(isFiltered);

    groupCoursesByType(newFilteredCourses);
  };

  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div>
      <div className="container mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4">
          <PageHeader className="mt-0 mb-3 md:mb-0" title="Browse courses" />
          <div className="grid grid-cols-3 md:gap-0 gap-2 w-full sm:w-auto sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:mt-0">
            <Link href="/workspace/courses/create" className="col-span-1">
              <Button
                variant="default"
                className="w-full sm:w-auto sm:size-wide flex items-center justify-center"
              >
                <Plus strokeWidth={3} className="h-4 w-4" />
                <span className="hidden sm:inline">Create New</span>
              </Button>
            </Link>

            <Link href="/workspace/courses/create-ai" className="col-span-1">
              <Button
                variant="outline"
                className="w-full sm:w-auto sm:size-wide flex items-center justify-center"
              >
                <Sparkles strokeWidth={3} className="h-4 w-4" />
                <span className="hidden sm:inline">AI Generate</span>
              </Button>
            </Link>

            <Button
              variant="default"
              className="col-span-1 w-full sm:w-auto sm:size-wide flex items-center justify-center"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter strokeWidth={3} className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center text-lg">No courses available!</div>
        ) : (
          <>
            {isFilterActive ? (
              selectedTypes.length > 0 ? (
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
                {courseTypes.map((type) => (
                  <div key={type} className="mb-12">
                    <CourseCarousel
                      title={coursesByType[type].displayName}
                      courses={coursesByType[type].courses}
                    />
                  </div>
                ))}
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