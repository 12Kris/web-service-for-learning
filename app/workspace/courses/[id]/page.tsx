"use client";

import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import type { Module } from "@/lib/types/modules";
import {
  getCourseById,
  getModulesByCourseId,
  addCourseToUser,
  isCourseAddedToUser,
  removeCourseFromUser,
  getCreatorTotalPoints,
  getCreatorCompletedCoursesCount,
  getCreatorCreatedCourses,
} from "@/lib/courses/actions";
import { getCourseRating, getUserRating, hasUserRatedCourse, rateCourse } from "@/lib/courses/rating-actions";
import type { Course } from "@/lib/types/course";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EditBar from "@/components/workspace/courses/edit-bar";
import { getUser } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, BookOpen, Award, UserPlus, UserCheck } from "lucide-react";
import Link from "next/link";
import { SpacedRepetitionModal } from "@/components/workspace/modals/spaced-repetition";
import { toast } from "sonner";
import CourseCurriculum from "@/components/workspace/courses/course-curriculum";
import MeetTutor from "@/components/workspace/courses/meet-tutor";
import CourseInfo from "@/components/workspace/courses/course-info";
import CompletedInfo from "@/components/workspace/courses/completed-info";
import CourseDescriptionJumpotron from "@/components/workspace/courses/course-description-jumbotron";
import RatingSection from "@/components/workspace/courses/rating-section";

const hexToRgba = (hex: string, alpha: number = 0.5): string => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

  const handleAddCourse = async (courseId: number) => {
    if (!courseId) return;
    await addCourseToUser(courseId);
    setIsCourseAdded(true);
    handleSubscriptionChange();
  };

  const handleRemoveCourse = async (courseId: number) => {
    if (!courseId) return;
    await removeCourseFromUser(courseId);
    setIsCourseAdded(false);
    handleSubscriptionChange();
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
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
          course_rating={courseRating}
          reviews={reviews}
          courseId={id}
          color={course.color}
          creatorId={course?.creator?.id}
          userId={userId}
        />

        <CourseCurriculum modules={modules} courseId={id} color={course.color}/>

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

// "use client";

// import { useEffect, useState } from "react";
// import "react-loading-skeleton/dist/skeleton.css";
// import { Module } from "@/lib/types/modules";
// import { getCourseById, getModulesByCourseId } from "@/lib/courses/actions";
// import { getCourseRating } from "@/lib/courses/rating-actions";
// import { Course } from "@/lib/types/course";
// import LoadingSpinner from "@/components/ui/loading-spinner";
// import EditBar from "@/components/workspace/courses/edit-bar";
// import CourseDescriptionJumpotron from "@/components/workspace/courses/course-description-jumbotron";
// import CourseInfo from "@/components/workspace/courses/course-info";
// import CourseCurriculum from "@/components/workspace/courses/course-curriculum";
// import MeetTutor from "@/components/workspace/courses/meet-tutor";
// import CompletedInfo from "@/components/workspace/courses/completed-info";
// import { getUser } from "@/utils/supabase/server";

// export default function FlashcardPage({
//   params,
// }: {
//   params: Promise<{ id: number }>;
// }) {
//   const [course, setCourse] = useState<Course | null>(null);
//   const [modules, setModules] = useState<Module[]>([]);
//   const [courseRating, setCourseRating] = useState<number>(0);
//   const [reviews, setReviews] = useState<number>(0);
//   const [id, setId] = useState<number | null>(null);
//   const [userId, setUserId] = useState<string | undefined>();

//   const fetchData = async (courseId: number) => {
//     try {
//       const user = await getUser();
//       if (user) {
//         setUserId(user.id);
//       }

//       const modulesData = await getModulesByCourseId(courseId);
//       setModules(modulesData);

//       const courseData = await getCourseById(courseId);

//       setCourse(courseData);

//       const ratingData = await getCourseRating(courseId);
//       setCourseRating(ratingData.rating);
//       setReviews(ratingData.count);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

//   useEffect(() => {
//     const resolveParams = async () => {
//       const resolvedParams = await params;
//       setId(resolvedParams.id);
//     };
//     resolveParams();
//   }, [params]);

//   useEffect(() => {
//     if (id !== null) {
//       fetchData(id);
//     }
//   }, [id]);

//   const handleSubscriptionChange = () => {
//     if (id !== null) {
//       fetchData(id);
//     }
//   };

//   if (!course || id === null) {
//     return <LoadingSpinner className="mx-auto" />;
//   }

//   return (
//     <div className="flex flex-wrap gap-4">
//       <CourseDescriptionJumpotron
//         title={course?.name}
//         description={course?.description}
//         type={course?.type}
//         id={id}
//         color={course.color}
//         onSubscriptionChange={handleSubscriptionChange}
//       />
//       {course?.isCourseCompleted && <CompletedInfo courseId={course.id} />}

//       <CourseInfo
//         course_details={course?.course_details || []}
//         what_you_learn={course?.what_w_learn || []}
//         course_rating={courseRating}
//         reviews={reviews}
//         courseId={id}
//         color={course.color}
//         creatorId={course?.creator?.id}
//         userId={userId}
//       />

//       <CourseCurriculum modules={modules} courseId={id} color={course.color}/>

//       <MeetTutor
//         name={course?.creator?.full_name || undefined}
//         description={course?.creator?.bio || undefined}
//         imageUrl=""
//       />
//       <EditBar id={id} />
//     </div>
//   );
// }