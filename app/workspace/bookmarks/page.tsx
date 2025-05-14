import { getCourses, getCoursesWithUserProgress, getUserCourses } from "@/lib/courses/actions";
import BookmarksPage from "@/components/workspace/bookmarks";
import type { Course } from "@/lib/types/course";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function groupCoursesByType(coursesToGroup: Course[]) {
  const groupedCourses = coursesToGroup.reduce((acc, course) => {
    const normalizedType = (course.type || "Uncategorized").toLowerCase();
    const displayType = normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);

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
  const fetchedCourses = await getCourses(0, 30);
  const fetchedCoursesWithProgress = await getCoursesWithUserProgress(0, 30);
  const fetchedEnrolledCourses = await getUserCourses(0, 30);

  const today = new Date().toISOString().split("T")[0];
  const coursesToRepeat = fetchedCoursesWithProgress.filter((course) => {
    try {
      const spacedRepetition = course.user_progress?.[0]?.spaced_repetition;
      return spacedRepetition && spacedRepetition.next_review_dates?.includes(today);
    } catch {
      return false;
    }
  });

  const { coursesByType, courseTypes } = groupCoursesByType(fetchedEnrolledCourses);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BookmarksPage
        initialCourses={fetchedCourses}
        initialEnrolledCourses={fetchedEnrolledCourses}
        initialCoursesToRepeat={coursesToRepeat}
        initialCoursesByType={coursesByType}
        initialCourseTypes={courseTypes}
      />
    </Suspense>
  );
}