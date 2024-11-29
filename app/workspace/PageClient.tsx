"use client";
import { CourseCarousel } from "@/components/course-slider/course-slider";
import { Course } from "@/lib/definitions";

export default function PageClient({ courses }: { courses: Course[] }) {
    return (
        <main className="container mx-auto py-8 space-y-12">
            <CourseCarousel title="Latest" courses={courses} />
            <CourseCarousel title="Popular" courses={courses} />
        </main>
    );
}
