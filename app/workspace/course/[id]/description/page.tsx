"use client";
import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CourseInfo from "@/components/workspace/courses/course-info";
import CourseCurriculum from "@/components/workspace/courses/course-curriculum";
import MeetTutor from "@/components/workspace/courses/meet-tutor";

import { getCourseById } from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/actions";
import { use } from "react";
import Link from "next/link";
import { Course } from "@/lib/definitions";
import { deleteCourse } from "@/lib/courses/actions";

import { Trash2, Edit, BookCheck } from "lucide-react";

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
  const { id } = use(params);

  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);

        const user = await getUser();
        if (user && courseData) {
          setIsCreator(user.id.toString() === courseData.creator_id.toString());
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  async function handleDeleteCourse() {
    if (!id) return;
    const result = await deleteCourse(id);
    if (result.success) {
      window.location.href = "/workspace/";
    } else {
      alert(`Failed to delete course: ${result.message}`);
    }
  }

  return (
    <div className="container pt-0 mx-auto py-10 px-4 flex flex-col w-full gap-4">
      <CourseInfo
        course_details={course?.course_details || []}
        what_you_learn={course?.what_w_learn || []}
        course_rating={4}
        reviews={12}
      />

      <CourseCurriculum modules={course?.curriculum || []} />

      <MeetTutor
        name={course?.creator?.full_name}
        description={course?.creator?.description || undefined}
        imageUrl=""
      />

      <div className="flex flex-col md:flex-row w-full gap-2">
        <Button className="w-full" disabled={true}></Button>

        <Link className="w-full" href={`/workspace/course/${course?.id}/cards`}>
          <Button className="w-full">
            {" "}
            <BookCheck />
            Take the test
          </Button>
        </Link>
        {isCreator && (
          <Link
            className="w-full"
            href={`/workspace/course/edit/${course?.id}/`}
          >
            <Button className="w-full">
              <Edit />
              Edit
            </Button>
          </Link>
        )}
        {isCreator && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full" variant="destructive">
                <Trash2 />
                Delete Course
              </Button>
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
