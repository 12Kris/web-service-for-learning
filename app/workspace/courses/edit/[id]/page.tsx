import { Suspense } from "react";
import { CourseEditForm } from "@/components/workspace/courses/update-course-form";
import {getCourseById, getMaterialsByBlockId, getModulesByCourseId, getTestsByBlockId} from "@/lib/courses/actions";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: number }>;
}

export default async function CourseEditPage({ params }: PageProps) {
    const { id } = await params;
    const course = await getCourseById(id);

    if (!course) {
        notFound();
    }
    const modules = await getModulesByCourseId(id);

    const materialsAndTests = await Promise.all(
        modules.map(async (module) => {
            const [materials, tests] = await Promise.all([
                getMaterialsByBlockId(module.id),
                getTestsByBlockId(module.id),
            ]);
            return { moduleId: module.id, materials, tests };
        })
    );

    const modulesWithData = modules.map((module) => {
        const data = materialsAndTests.find((m) => m.moduleId === module.id);
        return {
            ...module,
            materials: data?.materials || [],
            tests: data?.tests || [],
        };
    });

    return (
        <div className="container mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
                <CourseEditForm course={course} modules={modulesWithData} />
            </Suspense>
        </div>
    );
}
