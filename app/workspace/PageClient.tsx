"use client";
import { CourseCarousel } from "@/components/course-slider/course-slider";

export default function PageClient({ courses }) {
    return (
        <main className="container py-8 space-y-12">
            <CourseCarousel title="Latest" courses={courses} />
            <CourseCarousel title="Popular" courses={courses} />
        </main>
    );
}
