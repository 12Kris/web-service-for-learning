import type React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';


interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center flex-col text-[--neutral] z-50">
      <div className="bg-white p-5 rounded-lg border shadow-md">
      <Loader2 className={cn(className, "animate-spin duration-30 size-8")} />
      </div>
    </div>
  );
};

export default LoadingSpinner;

