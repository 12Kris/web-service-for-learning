"use client";

import { useState, useEffect } from "react";
import { Check, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CourseDetails, WhatWillLearn } from "@/lib/types/course";
import { getCourseRating, getUserRating, hasUserRatedCourse, rateCourse } from "@/lib/courses/rating-actions";
import { isCourseAddedToUser } from "@/lib/courses/actions";
import { toast } from "sonner";

interface CourseInfoProps {
  course_details: CourseDetails[];
  what_you_learn: WhatWillLearn[];
  course_rating: number;
  reviews: number;
  courseId: number;
}

const CourseInfo: React.FC<CourseInfoProps> = ({
  course_details,
  what_you_learn,
  course_rating: initialRating,
  reviews: initialReviews,
  courseId,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [reviews, setReviews] = useState<number>(initialReviews);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const courseRatingData = await getCourseRating(courseId);
        setRating(courseRatingData.rating);
        setReviews(courseRatingData.count);

        const hasRatedResult = await hasUserRatedCourse(courseId);
        setHasRated(hasRatedResult);

        if (hasRatedResult) {
          const userRatingData = await getUserRating(courseId);
          setUserRating(userRatingData);
        }

        const subscribed = await isCourseAddedToUser(courseId);
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error("Error fetching rating data:", error);
      }
    };

    fetchRatingData();
  }, [courseId]);

  const handleRatingClick = async (selectedRating: number) => {
    if (!isSubscribed) {
      toast.error("Subscription Required", {
        description: "You must be subscribed to this course to rate it.",
      });
      return;
    }

    try {
      const result = await rateCourse(courseId, selectedRating);
      if (result.success) {
        const updatedRating = await getCourseRating(courseId);
        setRating(updatedRating.rating);
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

  return (
    <div className="container mx-auto pt-0 py-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Course details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {course_details.length > 0 ? (
              course_details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>{detail.course_detail}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                No information available.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              What you will learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside space-y-3">
              {what_you_learn.length > 0 ? (
                what_you_learn.map((item, index) => (
                  <li key={index} className="text-sm">
                    • {item.description}
                  </li>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500">
                  No information available.
                </div>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Course Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${isSubscribed ? "cursor-pointer" : "cursor-not-allowed"} ${
                      star <= (hoverRating || userRating || rating)
                        ? "fill-current text-primary"
                        : "text-muted"
                    }`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => isSubscribed && setHoverRating(star)}
                    onMouseLeave={() => isSubscribed && setHoverRating(0)}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {reviews} reviews
            </p>
            {hasRated ? (
              <p className="text-sm text-muted-foreground">
                Your rating: {userRating}
              </p>
            ) : isSubscribed ? (
              <p className="text-sm text-muted-foreground">
                You can rate this course by clicking on a star
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Subscribe to this course to rate it
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseInfo;