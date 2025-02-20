"use client";

import { CourseCard } from "@/components/course-card/course-card";
import Link from "next/link";
import { Course } from "@/lib/definitions";

interface CourseGridProps {
  title: string;
  courses: Course[];
}

export function CourseGrid({ title, courses }: CourseGridProps) {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Link key={course.id} href={`/workspace/courses/${course.id}`}>
            <CourseCard
              title={course.name}
              topic={course.type || ""}
              thermsCount={0}
              description={course.description || ""}
              author={course.creator?.full_name || ""}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}