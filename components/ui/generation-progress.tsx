"use client"

import * as React from "react"
import { ProgressBar } from "@/components/ui/progress-bar"

interface GenerationProgressProps {
  isLoading: boolean
  label?: string
}

export function GenerationProgress({ isLoading, label = "Generating course content..." }: GenerationProgressProps) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          const increment = Math.max(0.5, 5 * (1 - prev / 100))
          return Math.min(95, prev + increment)
        })
      }, 300)

      return () => {
        clearInterval(interval)
        setProgress(100)
      }
    } else {
      setProgress(0)
    }
  }, [isLoading])

  if (!isLoading && progress === 0) {
    return null
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
      </div>
      <ProgressBar value={progress} variant="primary" size="md" className="w-full" />
    </div>
  )
}