"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { isCourseAddedToUser } from "@/lib/courses/actions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ModuleCard } from "@/components/workspace/courses/modules/module-card";
import { Module } from "@/lib/types/learning";

export default function FlashcardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isCourseAdded, setIsCourseAdded] = useState<boolean | null>(null);
  const { id } = use(params);

  async function fetchData(id: string) {
    if (!id) return;

    try {
      const result = await isCourseAddedToUser(id);
      setIsCourseAdded(result);
    } catch (err) {
      console.error(err);
      setIsCourseAdded(false);
    }
  }

  const modules: Module[] = [
    {
      id: 1,
      title: "Module 1: Web Fundamentals",
      description: "Learn the basics of HTML, CSS, and JavaScript",
      duration: "2 weeks",
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
    },
    {
      id: 2,
      title: "Module 2: Advanced CSS",
      description: "Master modern CSS techniques and frameworks",
      duration: "2 weeks",
      isActive: true,
      isCompleted: false,
      progress: 60,
      lessons: [
        {
          id: 1,
          title: "Flexbox & Grid",
          duration: "1h",
          type: "video",
          isCompleted: true,
        },
        {
          id: 2,
          title: "CSS Animations",
          duration: "45 min",
          type: "video",
          isCompleted: true,
        },
        {
          id: 3,
          title: "Building a Responsive Layout",
          duration: "2h",
          type: "exercise",
          isCompleted: false,
        },
        {
          id: 4,
          title: "Module 2 Quiz",
          duration: "30 min",
          type: "quiz",
          isCompleted: false,
        },
      ],
    },
    {
      id: 3,
      title: "Module 3: JavaScript Deep Dive",
      description: "Advanced JavaScript concepts and patterns",
      duration: "3 weeks",
      isActive: false,
      isCompleted: false,
      progress: 0,
      lessons: [
        {
          id: 1,
          title: "ES6+ Features",
          duration: "1.5h",
          type: "video",
          isCompleted: false,
        },
        {
          id: 2,
          title: "Async Programming",
          duration: "2h",
          type: "video",
          isCompleted: false,
        },
        {
          id: 3,
          title: "Building a JavaScript App",
          duration: "3h",
          type: "exercise",
          isCompleted: false,
        },
      ],
    },
    {
      id: 4,
      title: "Module 4: React Fundamentals",
      description: "Learn the basics of React development",
      duration: "3 weeks",
      isActive: false,
      isCompleted: false,
      progress: 0,
      lessons: [
        {
          id: 1,
          title: "React Basics",
          duration: "2h",
          type: "video",
          isCompleted: false,
        },
        {
          id: 2,
          title: "State & Props",
          duration: "1.5h",
          type: "video",
          isCompleted: false,
        },
        {
          id: 3,
          title: "React Hooks",
          duration: "2h",
          type: "video",
          isCompleted: false,
        },
      ],
    },
  ];

  useEffect(() => {
    fetchData(id);
  }, [id]);

  if (isCourseAdded === null) {
    return (
      <div className="flex flex-wrap gap-4">
        <div className="w-full h-96 bg-gray-100 rounded-xl flex justify-center items-center">
          <Skeleton height={384} width="100%" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {isCourseAdded ? (
        <div className="w-full max-w-4xl mx-auto p-6">
          <div className="space-y-8">
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                isFirst={index === 0}
                isLast={index === modules.length - 1}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-96 bg-gray-100 rounded-xl flex justify-center items-center flex-col gap-3">
          <h1 className="text-2xl text-gray-500">
            You need to subscribe to this course to view it
          </h1>
          <p className="text-md text-gray-500">
            After you clicked subscribe button you may need to refresh page to
            see your course.
          </p>
        </div>
      )}
    </div>
  );
}
