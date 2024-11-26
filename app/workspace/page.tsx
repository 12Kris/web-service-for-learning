"use client"
import { CourseCarousel } from "@/components/course-slider/course-slider"
import {getCourses} from "@/lib/courses/actions";

export default async function Page() {
  const courses = await getCourses();
  return (
      <main className="container py-8 space-y-12">
        <CourseCarousel title="Latest" courses={courses}/>
        <CourseCarousel title="Popular" courses={courses} />
      </main>
  )
}

