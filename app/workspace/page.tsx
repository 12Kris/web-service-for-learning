import { getCoursesWithUserProgress, getTopUsersByPoints, getUserCourses, getUserCreatedCourses } from "@/lib/courses/actions";
import HomePage from "@/components/workspace/home";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default async function Page() {
  const topUsers = await getTopUsersByPoints(0, 10);
  const createdCourses = await getUserCreatedCourses(0, 50);
  const coursesInProgress = await getUserCourses(0, 50);
  const fetchedCoursesWithProgress = await getCoursesWithUserProgress(0, 50);

  const today = new Date().toISOString().split("T")[0];
  const coursesToRepeat = fetchedCoursesWithProgress.filter((course) => {
    try {
      const spacedRepetition = course.user_progress?.[0]?.spaced_repetition;
      return spacedRepetition && spacedRepetition.next_review_dates?.includes(today);
    } catch {
      return false;
    }
  });

  const weeklyStreak = {
    points: 20,
    weeks: 1,
    courseMinutes: { completed: 22, total: 30 },
    cardsStudied: { completed: 12, total: 40 },
    dateRange: "Apr 20 - 26",
  };

  return (
    <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
      <HomePage
        weeklyStreak={weeklyStreak}
        createdCourses={createdCourses}
        coursesInProgress={coursesInProgress}
        upcomingEvents={coursesToRepeat}
        leaderboard={topUsers}
      />
    </Suspense>
  );
}