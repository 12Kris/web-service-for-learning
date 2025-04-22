"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { Module } from "@/lib/types/modules";
import { getCourseById, getModulesByCourseId } from "@/lib/courses/actions";
import { getCourseRating } from "@/lib/courses/rating-actions";
import { Course } from "@/lib/types/course";
import {LoadingSpinner} from "@/components/ui/loading-spinner";
import EditBar from "@/components/workspace/courses/edit-bar";
import CourseDescriptionJumpotron from "@/components/workspace/courses/course-description-jumbotron";
import CourseInfo from "@/components/workspace/courses/course-info";
import CourseCurriculum from "@/components/workspace/courses/course-curriculum";
import MeetTutor from "@/components/workspace/courses/meet-tutor";

export default function FlashcardPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseRating, setCourseRating] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const { id } = use(params);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const modulesData = await getModulesByCourseId(id);
        setModules(modulesData);

        const courseData = await getCourseById(id);
        setCourse(courseData);

        const ratingData = await getCourseRating(id);
        setCourseRating(ratingData.rating);
        setReviews(ratingData.count);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, [id]);

  if (!course) {
    return <LoadingSpinner className="mx-auto" />;
  }

  return (
    <div className="flex flex-wrap gap-4">
      <CourseDescriptionJumpotron
        title={course?.name}
        description={course?.description}
        type={course?.type}
        id={id}
      />

      <CourseInfo
        course_details={course?.course_details || []}
        what_you_learn={course?.what_w_learn || []}
        course_rating={courseRating}
        reviews={reviews}
        courseId={id}
      />

      <CourseCurriculum modules={modules} courseId={id} />

      <MeetTutor
        name={course?.creator?.full_name || undefined}
        description={course?.creator?.bio || undefined}
        imageUrl=""
      />
      <EditBar id={id} />
    </div>
  );
}

// "use client"

// import { useEffect, useState } from "react"
// import { use } from "react"
// import "react-loading-skeleton/dist/skeleton.css"
// import type { Module } from "@/lib/types/modules"
// import { getCourseById, getModulesByCourseId } from "@/lib/courses/actions"
// import type { Course } from "@/lib/types/course"
// import LoadingSpinner from "@/components/ui/loading-spinner"
// import EditBar from "@/components/workspace/courses/edit-bar"
// import CourseDescriptionJumpotron from "@/components/workspace/courses/course-description-jumbotron"
// import "react-loading-skeleton/dist/skeleton.css"
// import CourseInfo from "@/components/workspace/courses/course-info"
// import CourseCurriculum from "@/components/workspace/courses/course-curriculum"
// import MeetTutor from "@/components/workspace/courses/meet-tutor"
// import CourseRating from "@/components/workspace/courses/course-rating"
// import { getCourseRating } from "@/lib/courses/rating-actions"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// export default function CoursePage({
//   params,
// }: {
//   params: Promise<{ id: number }>
// }) {
//   const [course, setCourse] = useState<Course | null>(null)
//   const [modules, setModules] = useState<Module[]>([])
//   const [courseRating, setCourseRating] = useState<{ rating: number; count: number }>({ rating: 0, count: 0 })
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const { id } = use(params)

//   useEffect(() => {
//     async function fetchData() {
//       if (!id) return

//       try {
//         setIsLoading(true)
//         // Fetch course data
//         const courseData = await getCourseById(id)
//         setCourse(courseData)

//         // Fetch modules
//         const modulesData = await getModulesByCourseId(id)
//         setModules(modulesData)

//         // Fetch rating data
//         const ratingData = await getCourseRating(id)
//         setCourseRating(ratingData)
//       } catch (err) {
//         console.error("Error fetching course data:", err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [id])

//   if (isLoading || !course) {
//     return <LoadingSpinner className="mx-auto" />
//   }

//   return (
//     <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4">
//       <CourseDescriptionJumpotron title={course?.name} description={course?.description} type={course?.type} id={id} />

//       <CourseInfo
//         course_details={course?.course_details || []}
//         what_you_learn={course?.what_w_learn || []}
//         course_id={id}
//         course_rating={courseRating.rating}
//         reviews={courseRating.count}
//       />

//       <CourseCurriculum modules={modules} courseId={id} />

//       <div className="grid md:grid-cols-2 gap-6">
//         <MeetTutor
//           name={course?.creator?.full_name || undefined}
//           description={course?.creator?.bio || undefined}
//           imageUrl=""
//         />

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">Rate this course</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <CourseRating courseId={id} initialRating={courseRating.rating} />
//           </CardContent>
//         </Card>
//       </div>

//       <EditBar id={id} />
//     </div>
//   )
// }
