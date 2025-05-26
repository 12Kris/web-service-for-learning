"use client";

import type React from "react";


interface LoadingSpinnerProps {
  className?: string;
  color?: string;
  height?: number;

}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,

  height = 4,
}) => {
   return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`} style={{ height: `${height}px` }}>
      <div className="h-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full w-1/3 animate-pulse bg-[--neutral] "
          style={{

            animation: "indeterminate 2s infinite linear",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes indeterminate {
          0% { 
            transform: translateX(-100%);
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% { 
            transform: translateX(300%);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
};

export default LoadingSpinner;

