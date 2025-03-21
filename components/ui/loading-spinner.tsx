import type React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
}) => {
  return (
    <div className="flex items-center justify-center flex-col text-[--neutral]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#52796f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin duration-50 ease-linear", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Loading please wait...
    </div>
  );
};

export default LoadingSpinner;
