"use client";

import { useState, useEffect } from "react";
import {
  getCourses,
  getCoursesWithUserProgress,
  getUserCourses,
} from "@/lib/courses/actions";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { FilterModal } from "@/components/workspace/modals/filter-modal";
import type { Course } from "@/lib/types/course";

export default function BookmarksPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [filteredEnrolledCourses, setFilteredEnrolledCourses] = useState<
    Course[]
  >([]);
  const [repeatCourses, setRepeatCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Новий стан для обраних типів
  const [enrolledCoursesByType, setEnrolledCoursesByType] = useState<
    Record<string, { displayName: string; courses: Course[] }>
  >({}); // Групування enrolled курсів за типами
  // const [enrolledCourseTypes, setEnrolledCourseTypes] = useState<string[]>([]); // Типи enrolled курсів

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const fetchedCourses = await getCourses();
        const fetchedCoursesWithProgress = await getCoursesWithUserProgress();
        const fetchedEnrolledCourses = await getUserCourses();

        fetchedCourses.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );

        setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses);
        setEnrolledCourses(fetchedEnrolledCourses);
        setFilteredEnrolledCourses(fetchedEnrolledCourses);

        const today = new Date().toISOString().split("T")[0];
        const coursesToRepeat = fetchedCoursesWithProgress.filter((course) => {
          try {
            const spacedRepetition =
              course.user_progress?.[0]?.spaced_repetition;
            return (
              spacedRepetition &&
              spacedRepetition.next_review_dates.includes(today)
            );
          } catch (error) {
            console.error(
              "Error accessing spaced_repetition for course",
              course.id,
              error
            );
            return false;
          }
        });
        setRepeatCourses(coursesToRepeat);

        // Групуємо enrolled курси за типами
        groupEnrolledCoursesByType(fetchedEnrolledCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Оновлюємо групування і перевіряємо, чи активний фільтр
  useEffect(() => {
    const isFiltered =
      filteredEnrolledCourses.length !== enrolledCourses.length ||
      filteredEnrolledCourses.some(
        (course, index) => course.id !== enrolledCourses[index]?.id
      );
    setIsFilterActive(isFiltered);

    // Групуємо відфільтровані enrolled курси за типами
    groupEnrolledCoursesByType(filteredEnrolledCourses);
  }, [filteredEnrolledCourses, enrolledCourses]);

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
    // setEnrolledCourseTypes(Object.keys(groupedCourses));
  };

  const handleFilterApply = (
    newFilteredCourses: Course[],
    activeTypes: string[]
  ) => {
    setFilteredCourses(newFilteredCourses);
    const enrolledIds = new Set(enrolledCourses.map((course) => course.id));
    const newFilteredEnrolled = newFilteredCourses.filter((course) =>
      enrolledIds.has(course.id)
    );
    setFilteredEnrolledCourses(newFilteredEnrolled);
    setSelectedTypes(activeTypes); // Зберігаємо обрані типи
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4 ">
            <PageHeader className="mt-0 mb-3 md:mb-0" title="Bookmarks" />
            <div className="grid grid-cols-3 md:gap-0 gap-2 w-full sm:w-auto sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:mt-0">
              <Button
                variant="default"
                // size="sm"
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
                  // Відображаємо секції лише для обраних типів
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
                    // Якщо типи не обрані, показуємо всі відфільтровані enrolled курси
                    <CourseGrid
                      title="Search Results"
                      courses={filteredEnrolledCourses}
                    />
                  )
                ) : (
                  // Якщо фільтр не активний, показуємо всі enrolled курси
                  <CourseGrid
                    title="Enrolled Courses"
                    courses={filteredEnrolledCourses}
                  />
                )
              ) : (
                <div className="text-center text-lg mt-8">
                  You haven&apos;t enrolled in any courses yet.
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
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        courses={courses}
        onFilter={handleFilterApply}
      />
    </div>
  );
}
