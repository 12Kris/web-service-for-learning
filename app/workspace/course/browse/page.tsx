import { getCourses } from "@/lib/courses/actions";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { CourseGrid } from "@/components/course-grid";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default async function Page() {
  const courses = await getCourses();
  

  return (
    <div>
      
      <Suspense fallback={<LoadingSpinner />}>

      <div className="container bg-[--background] mx-auto space-y-12">
      <PageHeader title="Browse courses" />
        <CourseCarousel title="Latest" courses={courses} />
        <CourseCarousel title="Popular" courses={courses} />
        <CourseGrid title="All courses" courses={courses} />
      </div>
    </Suspense>
    </div>
  );
}
