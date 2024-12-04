"use client";
import { useEffect, useState } from "react";
import {
  addCourseToUser,
  getCourseById,
  isCourseAddedToUser,
} from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/authActions";
import { use } from "react";
import Link from "next/link";
import { Course } from "@/lib/definitions";
import { deleteCourse } from "@/lib/courses/actions";
import { useRouter } from "next/navigation";

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
  const [userId, setUserId] = useState<string | null>(null);
  const { id } = use(params);

  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;
      const courseData = await getCourseById(id);
      setCourse(courseData);
    }

    fetchCourse();
  }, [id]);

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
        setIsCreator(user.id === course?.creator_id);
      }
    }

    fetchUser();
  }, [course]);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;
      const courseData = await getCourseById(id);
      setCourse(courseData);
    }

    fetchCourse();
  }, [id]);

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function checkCourse() {
      if (userId && id) {
        const result = await isCourseAddedToUser(userId, id);
        console.log(result);
        setIsCourseAdded(result);
      }
    }

    checkCourse();
  }, [userId, id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const handleAddCourse = async () => {
    if (!userId || !course.id) return;
    await addCourseToUser(course.id.toString(), userId);
    alert("Course added to your account!");
    setIsCourseAdded(true);
  };

  const handleDeleteCourse = async () => {
    if (!id) return;
    const result = await deleteCourse(id);
    if (result.success) {
      window.location.href = "/workspace/";
    } else {
      alert(`Failed to delete course: ${result.message}`);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 flex w-full gap-4">
      <div className="flex-1 bg-zinc-100 rounded-3xl p-6">
        <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
        <div className="mb-6">{course.description}</div>
        <div>
          <span className="font-bold">Instructor:</span>{" "}
          {course.creator?.full_name}
        </div>
        <div className="my-4">
          <Button onClick={handleAddCourse} disabled={isCourseAdded}>
            {isCourseAdded ? "Course Added" : "Add this course to my account"}
          </Button>

          <Link className="ml-4" href={`/workspace/course/${course.id}/cards`}>
            Пройти тест
          </Link>
        </div>
      </div>

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
  );
}
