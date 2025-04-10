"use client";
import ModuleProgression from "@/components/workspace/courses/modules/module-progression";
import { Module } from "@/lib/types/modules";
import { PageHeader } from "@/components/ui/page-header";
import { useEffect, useState } from "react";
import { use } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  getCourseById,
  getModulesByCourseId,
  isCourseAddedToUser,
} from "@/lib/courses/actions";
import ModulePage from "@/components/workspace/courses/modules/tasks-and-tests";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export interface PageData {
  title: string;
  logo: string;
  modules: Module[];
}

export default function EnroledModulePage({
  params,
}: {
  params: Promise<{ id: number; moduleId: number }>;
}) {
  const [isCourseAdded, setIsCourseAdded] = useState<boolean | undefined>(
    undefined
  );
  const [pageData, setPageData] = useState<PageData | null>(null);
  const { id, moduleId } = use(params);


  useEffect(() => {
    if (!id) return;
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
    if (!id) return;
    if (isCourseAdded === false) {
      window.location.href = `/workspace/courses/${id}`;
    }
  }, [isCourseAdded, id]);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const course = await getCourseById(id);
        const modules = await getModulesByCourseId(id);
        if (course && modules) {
          setPageData({
            title: course.name,
            logo: course.logo || "",
            modules,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [id]);

  if (!id || !moduleId || isCourseAdded !== true || !pageData) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Button>
        <Link href={`/workspace/courses/${id}`}>
          <ChevronLeft className="w-6 h-6" />
          {/* Back to modules */}
        </Link>
      </Button>
      <PageHeader className="mb-10" title={"Modules of " + pageData.title} />
      <ModuleProgression
        modules={pageData.modules}
        currentModuleId={moduleId}
        courseId={id}
      />
      <ModulePage />
    </div>
  );
}
