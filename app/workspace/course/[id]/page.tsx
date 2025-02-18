"use client";
import ModuleProgression from "@/components/workspace/courses/modules/module-progression";
import { Module } from "@/lib/types/learning";
import { PageHeader } from "@/components/ui/page-header";
import { useEffect } from "react";
import { use } from "react";
import { isCourseAddedToUser } from "@/lib/courses/actions";
import { useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export interface PageData {
  title: string;
  logo: string;
  modules: Module[];
}

export default function EnroledModulePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const [isCourseAdded, setIsCourseAdded] = useState<boolean | undefined>(
    undefined
  );
  const { id } = use(params);

  useEffect(() => {
    async function checkIfCourseIsAdded() {
      try {
        const result = await isCourseAddedToUser(id);
        setIsCourseAdded(result);
      } catch (err) {
        console.error(err);
        setIsCourseAdded(false);
      }
    }
    checkIfCourseIsAdded();
  }, [id]);

  useEffect(() => {
    if (isCourseAdded === false) {
      window.location.href = `${id}/about`;
    }
  }, [isCourseAdded, id]);

  if (isCourseAdded != true) {
    return <LoadingSpinner />;
  }

  const data: PageData = {
    title: "Master Web Development",
    logo: "Memorize",
    modules: [
      {
        id: 1,
        title: "Module 1",
        isActive: true,
        isCompleted: true,
        progress: 100,
        lessons: [
          {
            id: 1,
            title: "Introduction to HTML",
            duration: "45 min",
            type: "video",
            isCompleted: true,
          },
          {
            id: 2,
            title: "CSS Basics",
            duration: "1h",
            type: "video",
            isCompleted: true,
          },
          {
            id: 3,
            title: "JavaScript Fundamentals",
            duration: "1.5h",
            type: "video",
            isCompleted: true,
          },
          {
            id: 4,
            title: "Module 1 Quiz",
            duration: "30 min",
            type: "quiz",
            isCompleted: true,
          },
        ],
        description: "Learn the basics of HTML, CSS, and JavaScript",
        duration: "2 weeks",
      },
      {
        id: 2,
        title: "Module 2",
        isActive: true,
        isCompleted: false,
        progress: 100,
        lessons: [
          {
            id: 1,
            title: "Introduction to HTML",
            duration: "45 min",
            type: "video",
            isCompleted: true,
          },
          {
            id: 2,
            title: "CSS Basics",
            duration: "1h",
            type: "video",
            isCompleted: true,
          },
          {
            id: 3,
            title: "JavaScript Fundamentals",
            duration: "1.5h",
            type: "video",
            isCompleted: true,
          },
          {
            id: 4,
            title: "Module 1 Quiz",
            duration: "30 min",
            type: "quiz",
            isCompleted: true,
          },
        ],
        description: "Learn the basics of HTML, CSS, and JavaScript",
        duration: "2 weeks",
      },
      {
        id: 3,
        title: "Module 3",
        isActive: false,
        isCompleted: false,
        progress: 100,
        lessons: [
          {
            id: 1,
            title: "Introduction to HTML",
            duration: "45 min",
            type: "video",
            isCompleted: true,
          },
          {
            id: 2,
            title: "CSS Basics",
            duration: "1h",
            type: "video",
            isCompleted: true,
          },
          {
            id: 3,
            title: "JavaScript Fundamentals",
            duration: "1.5h",
            type: "video",
            isCompleted: true,
          },
          {
            id: 4,
            title: "Module 1 Quiz",
            duration: "30 min",
            type: "quiz",
            isCompleted: true,
          },
        ],
        description: "Learn the basics of HTML, CSS, and JavaScript",
        duration: "2 weeks",
      },
    ],
  };

  return (
    <div>
      <PageHeader className="mb-10" title={data.title} />
      <ModuleProgression modules={data.modules} />
    </div>
  );
}
