"use client";

import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import type { Module } from "@/lib/types/modules";
import {
  getCourseById,
  getModulesByCourseId,
  isCourseAddedToUser,
  getCreatorTotalPoints,
  getCreatorCompletedCoursesCount,
  getCreatorCreatedCourses,
} from "@/lib/courses/actions";
import { getCourseRating, getUserRating, hasUserRatedCourse, rateCourse } from "@/lib/courses/rating-actions";
import type { Course } from "@/lib/types/course";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EditBar from "@/components/workspace/courses/edit-bar";
import { getUser } from "@/utils/supabase/server";
import { SpacedRepetitionModal } from "@/components/workspace/modals/spaced-repetition";
import { toast } from "sonner";
import CourseCurriculum from "@/components/workspace/courses/course-curriculum";
import MeetTutor from "@/components/workspace/courses/meet-tutor";
import CourseInfo from "@/components/workspace/courses/course-info";
import CompletedInfo from "@/components/workspace/courses/completed-info";
import CourseDescriptionJumpotron from "@/components/workspace/courses/course-description-jumbotron";
import RatingSection from "@/components/workspace/courses/rating-section";

export default function CoursePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [courseRating, setCourseRating] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [id, setId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | undefined>();
  const [coursesCreated, setCoursesCreated] = useState<Course[]>([]);
  const [completedCoursesCount, setCompletedCoursesCount] = useState<number>();
  const [userTotalPoints, setUserTotalPoints] = useState<number | undefined>();
  const [isCourseAdded, setIsCourseAdded] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const fetchData = async (courseId: number) => {
    try {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
      }

      const modulesData = await getModulesByCourseId(courseId);
      setModules(modulesData);

      const courseData = await getCourseById(courseId);
      setCourse(courseData);

      const ratingData = await getCourseRating(courseId);
      setCourseRating(ratingData.rating);
      setReviews(ratingData.count);

      if (courseData?.creator?.id) {
        setCoursesCreated(await getCreatorCreatedCourses(0, 100, courseData.creator.id));
        setCompletedCoursesCount(await getCreatorCompletedCoursesCount(courseData.creator.id));
        setUserTotalPoints(await getCreatorTotalPoints(courseData.creator.id));
      } else {
        setCoursesCreated([]);
        setCompletedCoursesCount(0);
        setUserTotalPoints(0);
      }

      const subscribed = await isCourseAddedToUser(courseId);
      setIsCourseAdded(subscribed);

      const hasRatedResult = await hasUserRatedCourse(courseId);
      setHasRated(hasRatedResult);
      if (hasRatedResult && userId) {
        const userRatingData = await getUserRating(courseId);
        setUserRating(userRatingData);
      }
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

  const handleRatingClick = async (selectedRating: number) => {
    if (!id || !userId || (userId === course?.creator?.id)) return;

    try {
      const result = await rateCourse(id, selectedRating);
      if (result.success) {
        const updatedRating = await getCourseRating(id);
        setCourseRating(updatedRating.rating);
        setReviews(updatedRating.count);
        setUserRating(selectedRating);
        setHasRated(true);
        toast.success("Rating Submitted", {
          description: "Thank you for rating this course!",
        });
      } else {
        toast.error("Error", {
          description: result.message || "Failed to rate the course.",
        });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Error", {
        description: "An error occurred while rating the course.",
      });
    }
  };

  if (!course || id === null) {
    return <LoadingSpinner className="mx-auto" />;
  }

  // const bgColor = hexToRgba(course.color || "#10B981");
  // <Card className="border-2 bg-white" style={{ borderColor: bgColor }}></Card>

  return (
    <div className="min-h-screen">
      <CourseDescriptionJumpotron
        course={course}
        reviews={reviews}
        courseRating={courseRating}
        id={id}
        color={course.color}
        onSubscriptionChange={handleSubscriptionChange}
      />

      {course?.isCourseCompleted && <CompletedInfo courseId={course.id} />}
      
      <div className="mx-auto py-8 space-y-12 text-[--neutral]">
        <CourseInfo
          course_details={course?.course_details || []}
          what_you_learn={course?.what_w_learn || []}
        />

        <CourseCurriculum modules={modules} courseId={id}/>

        <MeetTutor
          course={course}
          coursesCreated={coursesCreated}
          completedCoursesCount={completedCoursesCount}
          userTotalPoints={userTotalPoints}
        />

        <RatingSection
          courseRating={courseRating}
          reviews={reviews}
          userRating={userRating}
          hasRated={hasRated}
          hoverRating={hoverRating}
          isCourseAdded={isCourseAdded}
          userId={userId}
          creatorId={course?.creator?.id}
          onRatingClick={handleRatingClick}
          setHoverRating={setHoverRating}
          setUserRating={setUserRating}
          setHasRated={setHasRated}
        />

        <EditBar id={id} />
      </div>

      {isModalOpen && (
        <SpacedRepetitionModal courseId={id} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}