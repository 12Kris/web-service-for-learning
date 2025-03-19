"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressBarVariants = cva("relative overflow-hidden rounded-full transition-all", {
  variants: {
    variant: {
      default: "bg-secondary",
      primary: "bg-muted",
      success: "bg-muted",
      warning: "bg-muted",
      danger: "bg-muted",
    },
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

const progressBarIndicatorVariants = cva("h-full w-full flex-1 transition-all", {
  variants: {
    variant: {
      default: "bg-gray-500",
      primary: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
    },
    animation: {
      none: "",
      pulse: "animate-pulse",
      bounce: "animate-bounce",
    },
  },
  defaultVariants: {
    variant: "default",
    animation: "none",
  },
})

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressBarVariants> {
  value?: number
  max?: number
  indeterminate?: boolean
  indicatorVariant?: VariantProps<typeof progressBarIndicatorVariants>["variant"]
  indicatorAnimation?: VariantProps<typeof progressBarIndicatorVariants>["animation"]
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      indeterminate = false,
      variant,
      size,
      indicatorVariant,
      indicatorAnimation,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100)

    return (
      <div
        ref={ref}
        className={cn(progressBarVariants({ variant, size }), className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuetext={indeterminate ? undefined : `${percentage.toFixed(0)}%`}
        {...props}
      >
        {indeterminate ? (
          <div
            className={cn(
              progressBarIndicatorVariants({
                variant: indicatorVariant || variant,
                animation: indicatorAnimation,
              }),
              "animate-indeterminate-progress",
            )}
          />
        ) : (
          <div
            className={cn(
              progressBarIndicatorVariants({
                variant: indicatorVariant || variant,
                animation: indicatorAnimation,
              }),
            )}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    )
  },
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }

