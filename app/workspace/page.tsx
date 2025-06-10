"use server";

import { getCoursesWithUserProgress, getTopUsersByPoints, getUserCourses, getUserCreatedCourses, getCompletedCoursesCount, calculateWeeklyCardStats, calculateStreakAndPoints } from "@/lib/courses/actions";
import HomePage from "@/components/workspace/home";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { getUser } from "@/utils/supabase/server";

function getWeekRange(date: Date): string {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
}

async function getWeeklyStreakData(userId: string, dateRange: string) {
  const { totalMinutes, totalCards } = await calculateWeeklyCardStats(userId, dateRange);
  const { weeks, pointsToAddForWeek } = await calculateStreakAndPoints(userId);

  return {
    points: pointsToAddForWeek,
    weeks: weeks,
    courseMinutes: { completed: totalMinutes, total: totalMinutes },
    cardsStudied: { completed: totalCards, total: totalCards },
  };
}

export default async function Page() {
  const user = await getUser();

  const [topUsers, createdCourses, coursesInProgress, fetchedCoursesWithProgress, completedCoursesCount] = await Promise.all([
    getTopUsersByPoints(0, 10),
    getUserCreatedCourses(0, 100),
    getUserCourses(0, 100),
    getCoursesWithUserProgress(0, 100),
    getCompletedCoursesCount(),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const coursesToRepeat = fetchedCoursesWithProgress.filter((course) => {
    try {
      const spacedRepetition = course.user_progress?.[0]?.spaced_repetition;
      return spacedRepetition && spacedRepetition.next_review_dates?.includes(today);
    } catch {
      return false;
    }
  });

  const todayDate = new Date(today);
  const dateRange = getWeekRange(todayDate);

  const streakData = await getWeeklyStreakData(user.id, dateRange);
  const weeklyStreak = {
    ...streakData,
    dateRange,
  };

  return (
    <Suspense fallback={<LoadingSpinner className="mx-auto" />}>
      <HomePage
        weeklyStreak={weeklyStreak}
        createdCourses={createdCourses}
        coursesInProgress={coursesInProgress}
        upcomingEvents={coursesToRepeat}
        leaderboard={topUsers}
        completedCoursesCount={completedCoursesCount}
      />
    </Suspense>
  );
}
