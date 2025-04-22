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
    <div className="flex items-center justify-center flex-col text-[--neutral]">
      <Loader2 className={cn(className, "animate-spin duration-50 size-8")} />
      Loading please wait...
    </div>
  );
};

export default LoadingSpinner;

