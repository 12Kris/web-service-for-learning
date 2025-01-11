"use client";

import Header from "@/components/workspace/courses/header";
import { useEffect, useState } from "react";
import CourseDescriptionJumpotron from "@/components/workspace/course-description-jumbotron";

// import { getUser } from "@/lib/auth/actions";
import { use } from "react";
import { Course } from "@/lib/definitions";

import {addCourseToUser, getCourseById} from "@/lib/courses/actions"; // isCourseAddedToUser

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  // const [isCourseAdded, setIsCourseAdded] = useState(false);
  const { id } = use(params);

  //   const [isCreator, setIsCreator] = useState(false);

  async function onEnrollNow() {
    console.log("Enroll now clicked");
    const res = await addCourseToUser(id);
    console.log(res)
  }

  function onLearnMore() {
    console.log("Learn more clicked");
  }

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);

        // const user = await getUser();
        // if (user && courseData) {
        //   setIsCreator(user.id.toString() === courseData.creator_id.toString());
        // }

        // const result = await isCourseAddedToUser(id);
        // setIsCourseAdded(result);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);
  return (
    <div>
      <CourseDescriptionJumpotron
        title={course?.name}
        description={course?.description}
        type={course?.type}
        onEnrollNow={onEnrollNow}
        onLearnMore={onLearnMore}
        // isCourseAdded={isCourseAdded}
      />
      <Header />
      <main className="container mx-auto mt-8 px-4">{children}</main>
    </div>
  );
}
