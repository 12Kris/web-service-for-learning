"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  isCourseCompleted,
  addReceivedPointsForCourse,
  addPointsToProfile,
  isReceivedPointsForCourse,
} from "@/lib/courses/actions";

export default function CompletedInfo({
  courseId,
}: {
  courseId: number;
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAlreadyReceivedPoints, setIsAlreadyReceivedPoints] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      const completed = await isCourseCompleted(courseId);
      const received = await isReceivedPointsForCourse(courseId);
      setIsCompleted(completed);
      setIsAlreadyReceivedPoints(received);
    }
    fetchStatus();
  }, [courseId]);

  async function handleReceivePoints(courseId: number) {
    if (isCompleted && !isAlreadyReceivedPoints) {
      const { success } = await addPointsToProfile(5);
      if (success) {
        await addReceivedPointsForCourse(courseId);
        setIsAlreadyReceivedPoints(true);
      }
    }
  }

  return (
    <div className="flex w-full mb-2">
      <Card key={courseId} className="transition-colors bg-[--primary] flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Course completed</h2>
              <p className="text-sm text-muted-foreground">
                This course is completed and you can receive 5 points.
              </p>
            </div>
            <Button
              variant="solid"
              size="lg"
              onClick={() => handleReceivePoints(courseId)}
              disabled={!isCompleted || isAlreadyReceivedPoints}
            >
              Receive points
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
