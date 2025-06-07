"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface RatingSectionProps {
  courseRating: number;
  reviews: number;
  userRating: number;
  hasRated: boolean;
  hoverRating: number;
  isCourseAdded: boolean | null;
  userId?: string;
  creatorId?: string;
  onRatingClick: (rating: number) => void;
  setHoverRating: (rating: number) => void;
  setUserRating: (rating: number) => void;
  setHasRated: (rated: boolean) => void;
}

const RatingSection: React.FC<RatingSectionProps> = ({
  courseRating,
  reviews,
  userRating,
  hasRated,
  hoverRating,
  isCourseAdded,
  userId,
  creatorId,
  onRatingClick,
  setHoverRating,
  setUserRating,
  setHasRated,
}) => {
  const handleRatingClick = (selectedRating: number) => {
    if (!userId || !isCourseAdded || (userId === creatorId)) return;

    onRatingClick(selectedRating);
    setUserRating(selectedRating);
    setHasRated(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Rate this course</h2>
      <Card className="border bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Course Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    (isCourseAdded && !(userId && creatorId && userId === creatorId))
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  } ${
                    star <= (hoverRating || userRating || courseRating)
                      ? "fill-current text-yellow-400"
                      : "text-muted"
                  }`}
                  onClick={
                    isCourseAdded && !(userId && creatorId && userId === creatorId)
                      ? () => handleRatingClick(star)
                      : undefined
                  }
                  onMouseEnter={
                    isCourseAdded && !(userId && creatorId && userId === creatorId)
                      ? () => setHoverRating(star)
                      : undefined
                  }
                  onMouseLeave={
                    isCourseAdded && !(userId && creatorId && userId === creatorId)
                      ? () => setHoverRating(0)
                      : undefined
                  }
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{courseRating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {reviews} reviews
          </p>
          {hasRated ? (
            <p className="text-sm text-muted-foreground">
              Your rating: {userRating}
            </p>
          ) : userId && creatorId && userId === creatorId ? (
            <p className="text-sm text-muted-foreground text-red-700">
              You cannot rate your own course.
            </p>
          ) : isCourseAdded ? (
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
  );
};

export default RatingSection;