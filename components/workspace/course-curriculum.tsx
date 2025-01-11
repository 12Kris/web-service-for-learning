import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import { Module } from "@/lib/definitions";
import Link from "next/link";

interface CourseCurriculumProps {
  modules: Module[] | undefined;
  onModuleClick?: (moduleId: number) => void;
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  modules,
  onModuleClick,
}) => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Course Curriculum</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {modules === undefined ? (
          // Loading state
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
          // Modules available
          modules.map((module) => (
            <Card
              key={module.id}
              className="transition-colors hover:bg-gray-50 cursor-pointer"
              onClick={() => onModuleClick?.(module.id)}
            >
              <CardHeader>
                  <Link href={`module/${module.id}`}>
                      <div className="space-y-1">
                          <h2 className="text-xl font-semibold">{module.name}</h2>
                          <p className="text-sm text-muted-foreground">
                              {module.description ?? "No description available."}
                          </p>
                      </div>
                  </Link>

              </CardHeader>
            </Card>
          ))
        ) : (
            // No modules available
            <div className="col-span-2 text-center text-gray-500">
                No modules available.
            </div>
        )}
      </div>
    </div>
  );
};

export default CourseCurriculum;
