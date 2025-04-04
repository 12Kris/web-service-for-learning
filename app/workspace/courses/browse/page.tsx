// "use client"

// import { useEffect, useState } from "react"
// import { PageHeader } from "@/components/ui/page-header"
// import { CourseCarousel } from "@/components/course-slider/course-slider"
// import { CourseGrid } from "@/components/course-grid"
// import { LoadingSpinner } from "@/components/ui/loading-spinner"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Plus, Filter, Sparkles } from "lucide-react"
// import { FilterModal } from "@/components/workspace/modals/filter-modal"
// // import { getCourses, getCoursesWithUserProgress } from "@/lib/courses/actions"
// import { getCourses } from "@/lib/courses/actions"
// import type { Course } from "@/lib/types/course"

// export default function Page() {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
//   // const [coursesWithUserProgress, setCoursesWithUserProgress] = useState<Course[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
//   // const [repeatCourses, setRepeatCourses] = useState<Course[]>([])
//   const [coursesByType, setCoursesByType] = useState<Record<string, { displayName: string; courses: Course[] }>>({})
//   const [courseTypes, setCourseTypes] = useState<string[]>([])

//   useEffect(() => {
//     async function fetchData() {
//       setIsLoading(true)
//       try {
//         const fetchedCourses = await getCourses()
//         // const fetchedCoursesWithProgress = await getCoursesWithUserProgress()

//         fetchedCourses.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

//         setCourses(fetchedCourses)
//         setFilteredCourses(fetchedCourses)
//         // setCoursesWithUserProgress(fetchedCoursesWithProgress)

//         // const today = new Date().toISOString().split("T")[0]
//         // const coursesToRepeat = fetchedCoursesWithProgress.filter((course) => {
//         //   try {
//         //     const spacedRepetition = course.user_progress?.[0]?.spaced_repetition
//         //     return spacedRepetition && spacedRepetition.next_review_dates.includes(today)
//         //   } catch (error) {
//         //     console.error("Error accessing spaced_repetition for course", course.id, error)
//         //     return false
//         //   }
//         // })
//         // setRepeatCourses(coursesToRepeat)

//         // Group courses by type
//         groupCoursesByType(fetchedCourses)
//       } catch (error) {
//         console.error("Error fetching courses:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Apply filters when filtered courses change
//   useEffect(() => {
//     groupCoursesByType(filteredCourses)
//   }, [filteredCourses])

//   // Group courses by their type (case-insensitive)
//   const groupCoursesByType = (coursesToGroup: Course[]) => {
//     const groupedCourses = coursesToGroup.reduce(
//       (acc, course) => {
//         // Normalize the type to lowercase for comparison, default to "Uncategorized" if no type
//         const normalizedType = (course.type || "Uncategorized").toLowerCase()

//         // Create a display version with first letter capitalized
//         const displayType = normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)

//         if (!acc[normalizedType]) {
//           acc[normalizedType] = {
//             displayName: displayType,
//             courses: [],
//           }
//         }

//         acc[normalizedType].courses.push(course)
//         return acc
//       },
//       {} as Record<string, { displayName: string; courses: Course[] }>,
//     )

//     setCoursesByType(groupedCourses)
//     setCourseTypes(Object.keys(groupedCourses))
//   }

//   const handleFilterApply = (newFilteredCourses: Course[]) => {
//     setFilteredCourses(newFilteredCourses)
//   }

//   if (isLoading) {
//     return <LoadingSpinner />
//   }

//   return (
//     <div>
//       <div className="container mx-auto space-y-12">
//         <div className="flex items-center justify-between mt-6 lg:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-4">
//           <PageHeader className="mt-0" title="Browse courses" />
//           <div className="flex items-center space-x-4">
//             <Link href="/workspace/courses/create">
//               <Button variant="default" size="wide" className="flex">
//                 <Plus strokeWidth={3} className="mr-0 h-4 w-4" />
//                 Create New
//               </Button>
//             </Link>
//             <Link href="/workspace/courses/create-ai">
//               <Button variant="outline" size="wide" className="flex">
//                 <Sparkles strokeWidth={3} className="mr-0 h-4 w-4" />
//                 AI Generate
//               </Button>
//             </Link>
//             <Button variant="default" size="wide" className="flex" onClick={() => setIsFilterModalOpen(true)}>
//               <Filter strokeWidth={3} className="mr-0 h-4 w-4" />
//               Filter
//             </Button>
//           </div>
//         </div>

//         {filteredCourses.length === 0 ? (
//           <div className="text-center text-lg">No courses available!</div>
//         ) : (
//           <>
//             {/* {repeatCourses.length >= 1 && <CourseCarousel title="Repeat Today" courses={repeatCourses} />} */}

//             <CourseCarousel title="Latest" courses={courses} />
//             <CourseCarousel title="Popular" courses={courses} />
//             <CourseGrid title="All courses" courses={filteredCourses} />

//             {courseTypes.map((type) => (
//               <div key={type} className="mb-12">
//                 <CourseCarousel title={coursesByType[type].displayName} courses={coursesByType[type].courses} />
//               </div>
//             ))}

//           </>
//         )}
//       </div>

//       <FilterModal
//         isOpen={isFilterModalOpen}
//         onClose={() => setIsFilterModalOpen(false)}
//         courses={courses}
//         onFilter={handleFilterApply}
//       />
//     </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Sparkles } from "lucide-react";
import { FilterModal } from "@/components/workspace/modals/filter-modal";
import { getCourses } from "@/lib/courses/actions";
import type { Course } from "@/lib/types/course";

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Новий стан для обраних типів
  const [coursesByType, setCoursesByType] = useState<
    Record<string, { displayName: string; courses: Course[] }>
  >({});
  const [courseTypes, setCourseTypes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const fetchedCourses = await getCourses();

        fetchedCourses.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );

        setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses);

        groupCoursesByType(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    groupCoursesByType(filteredCourses);

    const isFiltered =
      filteredCourses.length !== courses.length ||
      filteredCourses.some((course, index) => course.id !== courses[index]?.id);
    setIsFilterActive(isFiltered);
  }, [filteredCourses, courses]);

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

  const handleFilterApply = (
    newFilteredCourses: Course[],
    activeTypes: string[]
  ) => {
    setFilteredCourses(newFilteredCourses);
    setSelectedTypes(activeTypes); // Зберігаємо обрані типи
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="container mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4 ">
          <PageHeader className="mt-0 mb-3 md:mb-0" title="Browse courses" />
          <div className="grid grid-cols-3 md:gap-0 gap-2 w-full sm:w-auto sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:mt-0">
            <Link href="/workspace/courses/create" className="col-span-1">
              <Button
                variant="default"
                // size="sm"
                className="w-full sm:w-auto sm:size-wide flex items-center justify-center"
              >
                <Plus strokeWidth={3} className="h-4 w-4" />
                <span className="hidden sm:inline">Create New</span>
              </Button>
            </Link>

            <Link href="/workspace/courses/create-ai" className="col-span-1">
              <Button
                variant="outline"
                // size="sm"
                className="w-full sm:w-auto sm:size-wide flex items-center justify-center"
              >
                <Sparkles strokeWidth={3} className="h-4 w-4" />
                <span className="hidden sm:inline">AI Generate</span>
              </Button>
            </Link>

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
            {isFilterActive ? (
              // Відображаємо секції лише для обраних типів
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
                // Якщо типи не обрані, показуємо всі відфільтровані курси
                <CourseGrid title="Search Results" courses={filteredCourses} />
              )
            ) : (
              // Відображаємо всі секції, якщо фільтр не активний
              <>
                <CourseCarousel title="Latest" courses={courses} />
                <CourseCarousel title="Popular" courses={courses} />
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
