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