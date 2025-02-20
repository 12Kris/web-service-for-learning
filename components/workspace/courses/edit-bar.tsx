import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteCourse } from "@/lib/courses/actions";
import { useState, useEffect } from "react";
import { Course } from "@/lib/definitions";


import { getUser } from "@/lib/auth/actions";
import { getCourseById } from "@/lib/courses/actions";

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

interface EditBarProps {
  id: number;
}

const EditBar: React.FC<EditBarProps> = ({ id }) => {
  const [course, setCourse] = useState<Course | null>(null);

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
    <div className="flex flex-col md:flex-row w-full gap-4">
      {/* <Button className="w-full" disabled={true}></Button> */}

      <Link className="w-full" href={`/workspace/courses/${course?.id}/cards`}>
        <Button className="w-full">
          {" "}
          <BookCheck />
          Take the test
        </Button>
      </Link>
      {isCreator && (
        <Link className="w-full" href={`/workspace/courses/edit/${course?.id}/`}>
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
  );
};
export default EditBar;
