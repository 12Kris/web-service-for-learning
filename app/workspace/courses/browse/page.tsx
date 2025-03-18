"use server";
import { getCourses } from "@/lib/courses/actions";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Sparkles } from "lucide-react";

export default async function Page() {
  const courses = await getCourses();

  return (
    <div>
      {!courses && <LoadingSpinner />}

      <div className="container bg-[--background] mx-auto space-y-12">
        <div className="flex items-center justify-between mt-6">
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
            <CourseCarousel title="Latest" courses={courses} />
            <CourseCarousel title="Popular" courses={courses} />
            <CourseGrid title="All courses" courses={courses} />
          </>
        )}
      </div>
    </div>
  );
}
