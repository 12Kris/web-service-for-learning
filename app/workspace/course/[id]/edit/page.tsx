"use client";
import { useEffect, useState } from "react";
import { getCourseById } from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { use } from "react";
import Link from "next/link";
import { Course } from "@/lib/definitions";
import { updateCourse } from "@/lib/courses/actions";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const { id } = use(params);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);

      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);
        setName(courseData?.name || "");
        setDescription(courseData?.description || "");
        setType(courseData?.type || "");
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleUpdateCourse() {
    if (!id) return;
    await updateCourse(id, {
      creator_id: course?.creator_id,
      name,
      description,
      type,
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 flex w-full gap-4">
      <div className="flex-1 bg-zinc-100 rounded-3xl p-6">
        <h1 className="text-3xl font-bold mb-6">
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </h1>
        <div className="mb-6">
          <input
            required
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <span className="font-bold">Type:</span>{" "}
        <input
          required
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <div>
          <span className="font-bold">Instructor:</span>{" "}
          {course?.creator?.full_name}
        </div>
        <div className="my-4">
          <Link className="" href={`/workspace/course/${course?.id}`}>
            <Button variant="outline" className="bg-white">
              Cancel
            </Button>
          </Link>
          <Link className="ml-4" href={`/workspace/course/${course?.id}`}>
            <Button onClick={handleUpdateCourse}>Save</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
