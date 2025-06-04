"use client";

import { CourseCard } from "@/components/course-card/course-card";
import { Course } from "@/lib/types/course";

interface CourseGridProps {
  title: string;
  courses: Course[];
}

export function CourseGrid({ title, courses }: CourseGridProps) {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-[--neutral]">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.name}
            topic={course.type}
            color={course.color}
            studentsCount={course.student_count}
            description={course.description}
            instructor={course.creator?.full_name || "Unknown Instructor"}
            duration={course.last_completion_date || "Self-paced"}
            price="Free"
          />
        ))}
      </div>
    </section>
  );
}
