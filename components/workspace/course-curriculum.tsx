import React from "react"
import { Card, CardHeader } from "@/components/ui/card"
import Skeleton from "react-loading-skeleton"

interface Module {
  id: number
  title: string
  description: string
}

interface CourseCurriculumProps {
  modules?: Module[]
  onModuleClick?: (moduleId: number) => void
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ 
  modules, 
  onModuleClick 
}) => {
  const defaultModules: Module[] = [
    {
      id: 1,
      title: "Module 1",
      description: "Introduction to Web Development"
    },
    {
      id: 2,
      title: "Module 2",
      description: "Introduction to Web Development"
    },
    {
      id: 3,
      title: "Module 3",
      description: "Introduction to Web Development"
    },
    {
      id: 4,
      title: "Module 4",
      description: "Introduction to Web Development"
    },
    {
      id: 5,
      title: "Module 5",
      description: "Introduction to Web Development"
    },
    {
      id: 6,
      title: "Module 6",
      description: "Introduction to Web Development"
    },
    {
      id: 7,
      title: "Module 7",
      description: "Introduction to Web Development"
    },
    {
      id: 8,
      title: "Module 8",
      description: "Introduction to Web Development"
    }
  ]

  const displayModules = modules || defaultModules

  return (
    <div className="container mx-auto p-6 bg-zinc-100">
      <h1 className="text-3xl font-bold mb-8">Course Curriculum</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {displayModules ? (
          displayModules.map((module) => (
            <Card 
              key={module.id}
              className="transition-colors hover:bg-gray-50 cursor-pointer"
              onClick={() => onModuleClick?.(module.id)}
            >
              <CardHeader>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">
                    {module.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="space-y-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default CourseCurriculum

