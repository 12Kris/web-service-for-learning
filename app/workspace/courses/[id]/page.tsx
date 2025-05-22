"use client";

import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { Module } from "@/lib/types/modules";
import { getCourseById, getModulesByCourseId } from "@/lib/courses/actions";
import { getCourseRating } from "@/lib/courses/rating-actions";
import { Course } from "@/lib/types/course";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EditBar from "@/components/workspace/courses/edit-bar";
import CourseDescriptionJumpotron from "@/components/workspace/courses/course-description-jumbotron";
import CourseInfo from "@/components/workspace/courses/course-info";
import CourseCurriculum from "@/components/workspace/courses/course-curriculum";
import MeetTutor from "@/components/workspace/courses/meet-tutor";
import CompletedInfo from "@/components/workspace/courses/completed-info";

export default function FlashcardPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseRating, setCourseRating] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [id, setId] = useState<number | null>(null);

  const fetchData = async (courseId: number) => {
    try {
      const modulesData = await getModulesByCourseId(courseId);
      setModules(modulesData);

      const courseData = await getCourseById(courseId);
      // console.log("Is course finished:", await isCourseCompleted(courseId));

      setCourse(courseData);

      const ratingData = await getCourseRating(courseId);
      setCourseRating(ratingData.rating);
      setReviews(ratingData.count);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (id !== null) {
      fetchData(id);
    }
  }, [id]);

  const handleSubscriptionChange = () => {
    if (id !== null) {
      fetchData(id);
    }
  };

  if (!course || id === null) {
    return <LoadingSpinner className="mx-auto" />;
  }

  return (
    <div className="flex flex-wrap gap-4">
      <CourseDescriptionJumpotron
        title={course?.name}
        description={course?.description}
        type={course?.type}
        id={id}
        color={course.color}
        onSubscriptionChange={handleSubscriptionChange}
      />
      {course?.isCourseCompleted && <CompletedInfo courseId={course.id} />}
      {/* <CompletedInfo /> */}

      <CourseInfo
        course_details={course?.course_details || []}
        what_you_learn={course?.what_w_learn || []}
        course_rating={courseRating}
        reviews={reviews}
        courseId={id}
        color={course.color}
      />

      <CourseCurriculum modules={modules} courseId={id} color={course.color}/>

      <MeetTutor
        name={course?.creator?.full_name || undefined}
        description={course?.creator?.bio || undefined}
        imageUrl=""
      />
      <EditBar id={id} />
    </div>
  );
}