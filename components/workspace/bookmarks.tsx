"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { FilterModal } from "@/components/workspace/modals/filter-modal";
import type { Course } from "@/lib/types/course";

interface ClientComponentProps {
  initialCourses: Course[];
  initialEnrolledCourses: Course[];
  initialCoursesToRepeat: Course[];
  initialCoursesByType: Record<string, { displayName: string; courses: Course[] }>;
  initialCourseTypes: string[];
}

export default function BookmarksPage({
  initialCourses,
  initialEnrolledCourses,
  initialCoursesToRepeat,
  initialCoursesByType,
}: ClientComponentProps) {
  const [courses] = useState<Course[]>(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(initialCourses);
  const [enrolledCourses] = useState<Course[]>(initialEnrolledCourses);
  const [filteredEnrolledCourses, setFilteredEnrolledCourses] = useState<Course[]>(initialEnrolledCourses);
  const [repeatCourses] = useState<Course[]>(initialCoursesToRepeat);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [enrolledCoursesByType, setEnrolledCoursesByType] = useState(initialCoursesByType);

  const groupEnrolledCoursesByType = (coursesToGroup: Course[]) => {
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

    setEnrolledCoursesByType(groupedCourses);
  };

  const handleFilterApply = (newFilteredCourses: Course[], activeTypes: string[]) => {
    setFilteredCourses(newFilteredCourses);
    const enrolledIds = new Set(enrolledCourses.map((course) => course.id));
    const newFilteredEnrolled = newFilteredCourses.filter((course) =>
      enrolledIds.has(course.id)
    );
    setFilteredEnrolledCourses(newFilteredEnrolled);
    setSelectedTypes(activeTypes);

    const isFiltered =
      newFilteredEnrolled.length !== enrolledCourses.length ||
      newFilteredEnrolled.some((course, index) => course.id !== enrolledCourses[index]?.id);
    setIsFilterActive(isFiltered);

    groupEnrolledCoursesByType(newFilteredEnrolled);
  };

  return (
    <div>
      <div className="container mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4">
          <PageHeader className="mt-0 mb-3 md:mb-0" title="Bookmarks" />
          <div className="grid grid-cols-3 md:gap-0 gap-2 w-full sm:w-auto sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:mt-0">
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
            {repeatCourses.length >= 1 && (
              <CourseCarousel title="Repeat Today" courses={repeatCourses} />
            )}

            {filteredEnrolledCourses.length > 0 ? (
              isFilterActive ? (
                selectedTypes.length > 0 ? (
                  selectedTypes.map((type) => (
                    <div key={type} className="mb-12">
                      <CourseCarousel
                        title={
                          enrolledCoursesByType[type]?.displayName ||
                          type.charAt(0).toUpperCase() + type.slice(1)
                        }
                        courses={enrolledCoursesByType[type]?.courses || []}
                      />
                    </div>
                  ))
                ) : (
                  <CourseGrid
                    title="Search Results"
                    courses={filteredEnrolledCourses}
                  />
                )
              ) : (
                <CourseGrid
                  title="Enrolled Courses"
                  courses={filteredEnrolledCourses}
                />
              )
            ) : (
              <div className="text-center text-lg mt-8">       
                {`You haven't enrolled in any courses yet.`}
                <div className="mt-4">
                  <Link href="/workspace/courses/browse">
                    <Button variant="default">Browse Courses</Button>
                  </Link>
                </div>
              </div>
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