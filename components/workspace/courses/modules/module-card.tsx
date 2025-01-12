'use client'

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, PlayCircle, CheckCircle2, Trophy, Brain, Code } from 'lucide-react'
import { cn } from "@/lib/utils"
import { type Module } from "@/types/learning"
import { useState } from "react"

interface ModuleCardProps {
  module: Module
  isFirst?: boolean
  isLast?: boolean
}

export function ModuleCard({ module, isFirst, isLast }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />
      case 'quiz':
        return <Brain className="w-4 h-4" />
      case 'exercise':
        return <Code className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="relative w-full">
      {!isFirst && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-[#f8c4bc]" />
      )}
      <Card
        className={cn(
          "w-full max-w-lg mx-auto border-2 transition-all duration-300",
          module.isCompleted
            ? "bg-[#f8c4bc] border-[#f8c4bc]"
            : module.isActive
            ? "border-[#f8c4bc]"
            : "bg-[#e8f4f1] border-[#e8f4f1]"
        )}
      >
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {module.isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : module.progress > 0 ? (
                <Trophy className="w-6 h-6 text-yellow-500" />
              ) : null}
              <div>
                <h3 
                  className={cn(
                    "font-semibold text-lg",
                    module.isCompleted ? "text-white" : "text-[#4a746a]"
                  )}
                >
                  {module.title}
                </h3>
                <p 
                  className={cn(
                    "text-sm",
                    module.isCompleted ? "text-white/90" : "text-[#4a746a]/80"
                  )}
                >
                  {module.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p 
                className={cn(
                  "text-sm font-medium",
                  module.isCompleted ? "text-white" : "text-[#4a746a]"
                )}
              >
                {module.duration}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Progress 
                  value={module.progress} 
                  className={cn(
                    "w-24",
                    module.isCompleted ? "bg-white/20" : "bg-[#4a746a]/20"
                  )}
                />
                <span 
                  className={cn(
                    "text-sm",
                    module.isCompleted ? "text-white" : "text-[#4a746a]"
                  )}
                >
                  {module.progress}%
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full mt-2",
              module.isCompleted ? "text-white hover:text-white/90" : "text-[#4a746a]"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform",
              isExpanded ? "rotate-180" : ""
            )} />
            <span className="ml-2">{isExpanded ? "Hide" : "Show"} lessons</span>
          </Button>
        </CardHeader>
        {isExpanded && (
          <CardContent className="px-6 pb-6">
            <div className="space-y-3">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    module.isCompleted
                      ? "bg-white/10"
                      : module.isActive
                      ? "bg-[#f8c4bc]/10"
                      : "bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getLessonIcon(lesson.type)}
                    <span 
                      className={cn(
                        "text-sm font-medium",
                        module.isCompleted ? "text-white" : "text-[#4a746a]"
                      )}
                    >
                      {lesson.title}
                    </span>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        module.isCompleted ? "bg-white/20 text-white" : "bg-[#4a746a]/10 text-[#4a746a]"
                      )}
                    >
                      {lesson.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span 
                      className={cn(
                        "text-sm",
                        module.isCompleted ? "text-white/90" : "text-[#4a746a]/80"
                      )}
                    >
                      {lesson.duration}
                    </span>
                    {lesson.isCompleted && (
                      <CheckCircle2 
                        className={cn(
                          "w-4 h-4",
                          module.isCompleted ? "text-white" : "text-green-500"
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      {!isLast && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-[#f8c4bc]" />
      )}
    </div>
  )
}

