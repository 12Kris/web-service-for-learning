import React, { useState, useEffect } from "react";
// import { Button } from "../../ui/button";

import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getSpacedRepetition,
  // updateSpacedRepetition,
} from "@/lib/courses/spaced-repetition-actions";
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
  // const [updateError, setUpdateError] = useState<string | null>(null);

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



  // const handleSave = async () => {
  //   if (!spacedRepetition) return;

  //   try {
  //     const updatedSpacedRepetition = {
  //       start_date: spacedRepetition.start_date,
  //       schedule: spacedRepetition.schedule,
  //       next_review_dates: spacedRepetition.next_review_dates,
  //     };

  //     await updateSpacedRepetition(courseId, updatedSpacedRepetition);
  //     onClose();
  //   } catch (error) {
  //     console.error("Error saving spaced repetition:", error);
  //   }
  // };

  // const handleDateChange = (index: number, newDate: string) => {
  //   if (spacedRepetition && spacedRepetition.next_review_dates) {
  //     const updatedDates = [...spacedRepetition.next_review_dates];
  //     updatedDates[index] = newDate;
  //     setSpacedRepetition({
  //       ...spacedRepetition,
  //       next_review_dates: updatedDates,
  //     });
  //   }
  // };

  // const handleAddDate = () => {
  //   if (spacedRepetition && spacedRepetition.next_review_dates) {
  //     const updatedDates = [...spacedRepetition.next_review_dates, ""];
  //     setSpacedRepetition({
  //       ...spacedRepetition,
  //       next_review_dates: updatedDates,
  //     });
  //   }
  // };

  // const handleRemoveDate = (index: number) => {
  //   if (spacedRepetition && spacedRepetition.next_review_dates) {
  //     const updatedDates = spacedRepetition.next_review_dates.filter(
  //       (_, i) => i !== index
  //     );
  //     setSpacedRepetition({
  //       ...spacedRepetition,
  //       next_review_dates: updatedDates,
  //     });
  //   }
  // };

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
                    // onChange={(e) => handleDateChange(index, e.target.value)}
                    readOnly
                    className="p-2 border rounded-lg bg-[--card] flex-1"
                  />
                  {/* <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveDate(index)}
                    className="h-8 w-8 p-0 flex items-center justify-center"
                  >
                    -
                  </Button> */}
                </div>
              ))
            ) : (
              <p>No review dates available.</p>
            )}
          </div>
        </div>

        {/* <div className="flex justify-end mt-2">
          <Button variant="outline" onClick={handleAddDate} className="mr-2">
            Add Date
          </Button>
        </div> */}
        <div className="flex flex-col mt-2 gap-2">

          {/* {updateError && <p className="text-red-500">{updateError}</p>} */}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};