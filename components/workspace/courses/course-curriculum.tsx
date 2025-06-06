import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import { Module } from "@/lib/types/modules";
import Link from "next/link";
import { isCourseAddedToUser } from "@/lib/courses/actions";

const hexToRgba = (hex: string, alpha: number = 0.5): string => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface CourseCurriculumProps {
  modules: Module[] | undefined;
  onModuleClick?: (moduleId: number) => void;
  courseId?: number;
  color?: string;
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  modules,
  onModuleClick,
  courseId,
  color,
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const subscribed = await isCourseAddedToUser(courseId ? courseId : 0);
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error("Error fetching rating data:", error);
      }
    };

    fetchRatingData();
  }, [courseId]);

  const bgColor = color ? hexToRgba(color, 0.5) : "rgba(98, 255, 187, 0.5)";

  const handleModuleClick = (moduleId: number) => {
    if (isSubscribed && onModuleClick) {
      onModuleClick(moduleId);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-[--neutral]">Course Curriculum</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {modules === undefined ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="space-y-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </CardHeader>
            </Card>
          ))
        ) : modules.length > 0 ? (
          modules.map((module) => (
            // <Card
            //   key={module.id}
            //   className="transition-colors hover:bg-gray-50"
            //   style={{ backgroundColor: bgColor }}
            // >
            <Card
              key={module.id}
              className="transition-colors hover:bg-gray-50 border-2 bg-white" 
              style={{borderColor: bgColor}}
            >
              <CardHeader
                className={
                  isSubscribed ? "cursor-pointer" : "cursor-not-allowed"
                }
                onClick={() => isSubscribed && handleModuleClick(module.id)}
              >
                {isSubscribed ? (
                  <Link href={`${courseId}/modules/${module.id}`}>
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold">{module.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {module.description ?? "No description available."}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold">{module.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {module.description ?? "No description available."}
                    </p>
                  </div>
                )}
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No modules available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCurriculum;