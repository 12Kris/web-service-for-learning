import React, { useState, useEffect } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getSpacedRepetition } from "@/lib/courses/spaced-repetition-actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SpacedRepetition } from "@/lib/types/learning";

export const SpacedRepetitionModal = ({
  courseId,
  onClose,
}: {
  courseId: number;
  onClose: () => void;
}) => {
  const [spacedRepetition, setSpacedRepetition] =
    useState<SpacedRepetition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSpacedRepetition() {
      try {
        const data = await getSpacedRepetition(courseId);
        if (data.spaced_repetition) {
          setSpacedRepetition(data.spaced_repetition);
        }
      } catch (error) {
        console.error("Error fetching spaced repetition:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpacedRepetition();
  }, [courseId]);

  if (isLoading) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Loading Spaced Repetition plan</AlertDialogTitle>
          </AlertDialogHeader>
          <LoadingSpinner />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Your Spaced Repetition plan</AlertDialogTitle>
          <AlertDialogDescription>
            Review dates for Spaced Repetition.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            <label className="font-medium">Next Review Dates:</label>
            {spacedRepetition?.next_review_dates?.length ? (
              spacedRepetition.next_review_dates.map((date, index) => (
                <div key={index} className="flex items-center gap-2 my-2">
                  <input
                    type="date"
                    value={date}
                    readOnly
                    className="p-2 border rounded-lg bg-[--card] flex-1"
                  />
                </div>
              ))
            ) : (
              <p>No review dates available.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col mt-2 gap-2"></div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
