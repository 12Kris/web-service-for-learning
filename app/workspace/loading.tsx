import React from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <LoadingSpinner />
    </div>
  );
}