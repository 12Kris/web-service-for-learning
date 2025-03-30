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
      const spacedRepetition = course.user_progress?.[0]?.spaced_repetition ? JSON.parse(course.user_progress[0].spaced_repetition) : null;
      return spacedRepetition && spacedRepetition.next_review_dates.includes(today);
    } catch (error) {
      console.error("Error parsing spaced_repetition for course", course.id, error);
      return false;
    }
  });

  return (
      <div>
        {!courses && <LoadingSpinner />}

        <div className="container  mx-auto space-y-12">
          <div className="flex items-center justify-between mt-6 lg:sticky top-0 z-10 bg-[--background] backdrop-blur-sm border-b border-b-[--border] py-4 px-4">
            <PageHeader className="mt-0" title="Browse courses" />
            <div className="flex items-center space-x-4">
              <Link href="/workspace/courses/create">
                <Button variant="default" size="wide" className="flex">
                  <Plus strokeWidth={3} className="mr-0 h-4 w-4" />
                  Create New
                </Button>
              </Link>
              <Link href="/workspace/courses/create-ai">
                <Button variant="outline" size="wide" className="flex">
                  <Sparkles strokeWidth={3} className="mr-0 h-4 w-4" />
                  AI Generate
                </Button>
              </Link>
              <Button variant="default" size="wide" className="hidden sm:flex">
                <Filter strokeWidth={3} className="mr-0 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          {courses.length === 0 ? (
              <div className="text-center text-lg">No courses available!</div>
          ) : (
              <>
                <CourseCarousel title="Repeat" courses={repeatCourses} />
                <CourseCarousel title="Latest" courses={courses} />
                <CourseCarousel title="Popular" courses={courses} />
                <CourseGrid title="All courses" courses={courses} />
              </>
          )}
        </div>
      </div>
  );
}
