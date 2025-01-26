import { Suspense } from "react";
import { CourseEditForm } from "@/components/workspace/courses/update-course-form";
import { getCourseById } from "@/lib/courses/actions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseEditPage({ params }: PageProps) {
  const { id } = await params;

  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <CourseEditForm course={course} />
      </Suspense>
    </div>
  );
}
