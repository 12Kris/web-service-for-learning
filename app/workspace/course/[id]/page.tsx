"use client";
import { useEffect, useState } from "react";
import {
  addCourseToUser,
  getCourseById,
  isCourseAddedToUser,
} from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/authActions";
import { use } from "react";
import Link from "next/link";
import { Course } from "@/lib/definitions";
import { deleteCourse } from "@/lib/courses/actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isCourseAdded, setIsCourseAdded] = useState(false);
  const { id } = use(params);

  const [isCreator, setIsCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);

      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);

        const user = await getUser();
        if (user && courseData) {
          setIsCreator(user.id.toString() === courseData.creator_id.toString());
        }

        const result = await isCourseAddedToUser(id);
        setIsCourseAdded(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleAddCourse() {
    if (!id) return;
    await addCourseToUser(id);
    setIsCourseAdded(true);
  }

  async function handleDeleteCourse() {
    if (!id) return;
    const result = await deleteCourse(id);
    if (result.success) {
      window.location.href = "/workspace/";
    } else {
      alert(`Failed to delete course: ${result.message}`);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 flex w-full gap-4">
      <div className="flex-1 bg-zinc-100 rounded-3xl p-6">
        <h1 className="text-3xl font-bold mb-6">{course?.name}</h1>
        <div className="mb-6">{course?.description}</div>
        <div>
          <span className="font-bold">Type:</span> {course?.type}
        </div>
        <div>
          <span className="font-bold">Instructor:</span>{" "}
          {course?.creator?.full_name}
        </div>

        <div className="my-4">
          <Button onClick={handleAddCourse} disabled={isCourseAdded}>
            {isCourseAdded ? "Subscribed" : "Subscribe"}
          </Button>

          <Link className="ml-4" href={`/workspace/course/${course?.id}/cards`}>
            <Button>Take the test</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {isCreator && (
          <Link href={`/workspace/course/${course?.id}/edit`}>
            <Button className="w-full">Edit</Button>
          </Link>
        )}
        {isCreator && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Course</Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  course and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDeleteCourse}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
