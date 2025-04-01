"use server";
import {getCourses, getCoursesWithUserProgress} from "@/lib/courses/actions";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Sparkles } from "lucide-react";

export default async function Page() {
  const courses = await getCourses();
  const coursesWithUserProgress = await getCoursesWithUserProgress();

  courses.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  const today = new Date().toISOString().split("T")[0];

  const repeatCourses = coursesWithUserProgress.filter(course => {
    try {
      const spacedRepetition = course.user_progress?.[0]?.spaced_repetition;
      return spacedRepetition && spacedRepetition.next_review_dates.includes(today);
    } catch (error) {
      console.error("Error accessing spaced_repetition for course", course.id, error);
      return false;
    }
  });

  return (
      <div>
        {!courses && <LoadingSpinner />}

        <div className="container  mx-auto space-y-12">
          <div className="flex items-center justify-between mt-6 lg:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-4">
            <PageHeader className="mt-0" title="Bookmarks" />
          </div>
          {courses.length === 0 ? (
              <div className="text-center text-lg">No courses available!</div>
          ) : (
              <>
                {repeatCourses.length >= 1 ? (
                  <CourseCarousel title="Repeat" courses={repeatCourses} />
                ) : null}
              </>
          )}
        </div>
      </div>
  );
}