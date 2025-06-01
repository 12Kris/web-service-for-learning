import { getCourses } from "@/lib/courses/actions";
import BrowsePage from "@/components/workspace/browse";
import type { Course } from "@/lib/types/course";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

function groupCoursesByType(coursesToGroup: Course[]) {
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

  return {
    coursesByType: groupedCourses,
    courseTypes: Object.keys(groupedCourses),
  };
}

export default async function Page() {
  const fetchedCourses = await getCourses(0, 1000000);

  const latestCourses = [...fetchedCourses].sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  const popularCourses = [...fetchedCourses].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  );

  const { coursesByType, courseTypes } = groupCoursesByType(fetchedCourses);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BrowsePage
        initialCourses={fetchedCourses}
        initialLatestCourses={latestCourses}
        initialPopularCourses={popularCourses}
        initialCoursesByType={coursesByType}
        initialCourseTypes={courseTypes}
      />
    </Suspense>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { PageHeader } from "@/components/ui/page-header";
// import { CourseCarousel } from "@/components/course-slider/course-slider";
// import { CourseGrid } from "@/components/course-grid";
// import { LoadingSpinner } from "@/components/ui/loading-spinner";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Plus, Filter, Sparkles } from "lucide-react";
// import { FilterModal } from "@/components/workspace/modals/filter-modal";
// import { getCourses } from "@/lib/courses/actions";
// import type { Course } from "@/lib/types/course";
// import { getCourseRating } from "@/lib/courses/rating-actions";

// export default function Page() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [popularCourses, setPopularCourses] = useState<Course[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [isFilterActive, setIsFilterActive] = useState(false);
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
//   const [coursesByType, setCoursesByType] = useState<
//     Record<string, { displayName: string; courses: Course[] }>
//   >({});
//   const [courseTypes, setCourseTypes] = useState<string[]>([]);

//   useEffect(() => {
//     async function fetchData() {
//       setIsLoading(true);
//       try {
//         const fetchedCourses = await getCourses();

//         fetchedCourses.sort(
//           (a, b) =>
//             new Date(b.created_at || 0).getTime() -
//             new Date(a.created_at || 0).getTime()
//         );

//         const coursesWithRatings = await Promise.all(
//           fetchedCourses.map(async (course) => {
//             const { rating } = await getCourseRating(course.id);
//             return { ...course, averageRating: rating };
//           })
//         );

//         const sortedPopularCourses = [...coursesWithRatings].sort(
//           (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
//         );

//         setCourses(fetchedCourses);
//         setFilteredCourses(fetchedCourses);
//         setPopularCourses(sortedPopularCourses);
//         groupCoursesByType(fetchedCourses);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   useEffect(() => {
//     groupCoursesByType(filteredCourses);

//     const isFiltered =
//       filteredCourses.length !== courses.length ||
//       filteredCourses.some((course, index) => course.id !== courses[index]?.id);
//     setIsFilterActive(isFiltered);
//   }, [filteredCourses, courses]);

//   const groupCoursesByType = (coursesToGroup: Course[]) => {
//     const groupedCourses = coursesToGroup.reduce((acc, course) => {
//       const normalizedType = (course.type || "Uncategorized").toLowerCase();
//       const displayType =
//         normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);

//       if (!acc[normalizedType]) {
//         acc[normalizedType] = {
//           displayName: displayType,
//           courses: [],
//         };
//       }

//       acc[normalizedType].courses.push(course);
//       return acc;
//     }, {} as Record<string, { displayName: string; courses: Course[] }>);

//     setCoursesByType(groupedCourses);
//     setCourseTypes(Object.keys(groupedCourses));
//   };

//   const handleFilterApply = (
//     newFilteredCourses: Course[],
//     activeTypes: string[]
//   ) => {
//     setFilteredCourses(newFilteredCourses);
//     setSelectedTypes(activeTypes);
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div>
//       <div className="container mx-auto space-y-12">
//         <div className="flex flex-col sm:flex-row justify-between md:mt-6 md:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-0 pt-0 md:pt-4 ">
//           <PageHeader className="mt-0 mb-3 md:mb-0" title="Browse courses" />
//           <div className="grid grid-cols-3 md:gap-0 gap-2 w-full sm:w-auto sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:mt-0">
//             <Link href="/workspace/courses/create" className="col-span-1">
//               <Button
//                 variant="default"
//                 className="w-full sm:w-auto sm:size-wide flex items-center justify-center"
//               >
//                 <Plus strokeWidth={3} className="h-4 w-4" />
//                 <span className="hidden sm:inline">Create New</span>
//               </Button>
//             </Link>

//             <Link href="/workspace/courses/create-ai" className="col-span-1">
//               <Button
//                 variant="outline"
//                 className="w-full sm:w-auto sm:size-wide flex items-center justify-center"
//               >
//                 <Sparkles strokeWidth={3} className="h-4 w-4" />
//                 <span className="hidden sm:inline">AI Generate</span>
//               </Button>
//             </Link>

//             <Button
//               variant="default"
//               className="col-span-1 w-full sm:w-auto sm:size-wide flex items-center justify-center"
//               onClick={() => setIsFilterModalOpen(true)}
//             >
//               <Filter strokeWidth={3} className="h-4 w-4" />
//               <span className="hidden sm:inline">Filter</span>
//             </Button>
//           </div>
//         </div>

//         {filteredCourses.length === 0 ? (
//           <div className="text-center text-lg">No courses available!</div>
//         ) : (
//           <>
//             {isFilterActive ? (
//               selectedTypes.length > 0 ? (
//                 selectedTypes.map((type) => (
//                   <div key={type} className="mb-12">
//                     <CourseCarousel
//                       title={
//                         coursesByType[type]?.displayName ||
//                         type.charAt(0).toUpperCase() + type.slice(1)
//                       }
//                       courses={coursesByType[type]?.courses || []}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <CourseGrid title="Search Results" courses={filteredCourses} />
//               )
//             ) : (
//               <>
//                 <CourseCarousel title="Latest" courses={courses.slice(0, 10)} />
//                 <CourseCarousel title="Popular" courses={popularCourses.slice(0, 10)} />
//                 <CourseGrid title="All courses" courses={filteredCourses} />
//                 {courseTypes.map((type) => (
//                   <div key={type} className="mb-12">
//                     <CourseCarousel
//                       title={coursesByType[type].displayName}
//                       courses={coursesByType[type].courses}
//                     />
//                   </div>
//                 ))}
//               </>
//             )}
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
//   );
// }