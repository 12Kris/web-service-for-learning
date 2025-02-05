"use client";

import Header from "@/components/workspace/courses/header";
import { useEffect, useState } from "react";
import CourseDescriptionJumpotron from "@/components/workspace/courses/course-description-jumbotron";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { use } from "react";
import { Course } from "@/lib/definitions";

import { getCourseById } from "@/lib/courses/actions";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: number }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const { id } = use(params);

  function onLearnMore() {
    console.log("Learn more clicked");
  }

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  if (!course) {
    return <LoadingSpinner className="mx-auto" />;
  }

  return (
    <div>
      <CourseDescriptionJumpotron
        title={course?.name}
        description={course?.description}
        type={course?.type}
        id={id}
        onLearnMore={onLearnMore}
      />
      <Header />
      <main className="container mx-auto mt-8 px-4">{children}</main>
    </div>
  );
}