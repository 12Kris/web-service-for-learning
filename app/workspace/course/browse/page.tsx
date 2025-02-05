import { getCourses } from "@/lib/courses/actions";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCarousel } from "@/components/course-slider/course-slider";

export default async function Page() {
  const courses = await getCourses();

  return (
    <div>
      <PageHeader title="Browse courses" />
      <div className="container bg-[--background] mx-auto py-8 space-y-12">
        <CourseCarousel title="Latest" courses={courses} />
        <CourseCarousel title="Popular" courses={courses} />
      </div>
    </div>
  );
}