"use client";

import { useEffect, useState } from "react";
import { UserPlus, UserCheck, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SpacedRepetitionModal } from "@/components/workspace/modals/spaced-repetition";
import { addCourseToUser, isCourseAddedToUser, removeCourseFromUser } from "@/lib/courses/actions";
import { Course } from "@/lib/types/course";

const hexToRgba = (hex: string, alpha: number = 0.5): string => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface CourseDescriptionJumbotronProps {
  course: Course;
  id: number;
  courseRating?: number;
  reviews?: number;
  color?: string;
  onLearnMore?: () => void;
  onSubscriptionChange?: () => void;
}

const CourseDescriptionJumbotron: React.FC<CourseDescriptionJumbotronProps> = ({
  course,
  courseRating,
  reviews,
  id,
  color,
  onSubscriptionChange,
}) => {
  const [isCourseAdded, setIsCourseAdded] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const result = await isCourseAddedToUser(id);
        setIsCourseAdded(result);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [id]);

  async function handleAddCourse(id: number) {
    if (!id) return;
    await addCourseToUser(id);
    setIsCourseAdded(true);
    if (onSubscriptionChange) {
      onSubscriptionChange();
    }
    window.location.reload()
  }

  async function handleRemoveCourse(id: number) {
    if (!id) return;
    await removeCourseFromUser(id);
    setIsCourseAdded(false);
    if (onSubscriptionChange) {
      onSubscriptionChange();
    }
    window.location.reload()
  }

  const bgColor = color ? hexToRgba(color) : "#a8e6cf";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <section
      className="rounded-xl"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="relative px-6 py-16 text-center text-black rounded-t-xl"
        style={{ backgroundColor: course.color || "#a8e6cf" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">{course.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isCourseAdded !== null && (
              <div className="flex flex-col md:flex-row gap-2">
                {isCourseAdded && (
                  <Link href={`/workspace/courses/${id}/modules`}>
                    <Button size="lg"
                     variant={"solid"} className="w-full sm:w-auto hover:text-[--neutral] hover:bg-white">
                      Go to Modules
                    </Button>
                  </Link>
                )}
                <Button
                  size="lg"
                  variant={isCourseAdded ? "destructive" : "solid"}
                  className={`w-full sm:w-auto ${isCourseAdded ? "bg-white" : "hover:bg-white hover:text-[--neutral]"}`}
                  onClick={() => (isCourseAdded ? handleRemoveCourse(id) : handleAddCourse(id))}
                >
                  {isCourseAdded ? (
                    <>
                      <UserCheck /> Subscribed
                    </>
                  ) : (
                    <>
                      <UserPlus /> Subscribe
                    </>
                  )}
                </Button>
                {isCourseAdded && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white w-full sm:w-auto"
                    onClick={() => setIsModalOpen(true)}
                  >
                    View Spaced Repetition Plan
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white border rounded-b-xl flex justify-center text-[--neutral]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">{course.creator?.full_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.student_count} Students Enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(courseRating || 0)}
              <span className="ml-1 font-medium">{courseRating?.toFixed(1)}</span>
              <span>({reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <SpacedRepetitionModal
          courseId={id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default CourseDescriptionJumbotron;