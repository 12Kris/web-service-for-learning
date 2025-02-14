// import { Suspense } from "react";
// import { CourseEditForm } from "@/components/workspace/courses/update-course-form";
// import {getCourseById, getMaterialsByBlockId, getModulesByCourseId, getTestsByBlockId} from "@/lib/courses/actions";
// import { notFound } from "next/navigation";

// interface PageProps {
//     params: Promise<{ id: number }>;
// }

// export default async function CourseEditPage({ params }: PageProps) {
//     const { id } = await params;

//     const course = await getCourseById(id);

//     if (!course) {
//         notFound();
//     }
//     const modules = await getModulesByCourseId(id);

//     const materialsAndTests = await Promise.all(
//         modules.map(async (module) => {
//             const [materials, tests] = await Promise.all([
//                 getMaterialsByBlockId(module.id),
//                 getTestsByBlockId(module.id),
//             ]);
//             return { moduleId: module.id, materials, tests };
//         })
//     );

//     const modulesWithData = modules.map((module) => {
//         const data = materialsAndTests.find((m) => m.moduleId === module.id);
//         return {
//             ...module,
//             materials: data?.materials || [],
//             tests: data?.tests || [],
//         };
//     });

//     return (
//         <div className="container mx-auto">
//             <Suspense fallback={<div>Loading...</div>}>
//                 <CourseEditForm course={course} modules={modulesWithData} />
//             </Suspense>
//         </div>
//     );
// }


"use client"
import { useEffect, useState, useCallback, useMemo, use, Suspense } from "react";
import dynamic from "next/dynamic";
import { getCourseById, getModulesByCourseId } from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import Skeleton from "react-loading-skeleton";
// import Link from "next/link";
import { Block, Course } from "@/lib/definitions";
import { createBlock, updateBlock } from "@/lib/tests/actions";
import { CourseEditForm } from "@/components/workspace/courses/update-course-form";

const BlockSection = dynamic(() => import("@/components/workspace/courses/block-section"), { ssr: false });
const BlockModal = dynamic(() => import("@/components/workspace/modals/block"), { ssr: false });

export default function EditCoursePage({ params }: { params: Promise<{ id: number }> }) {
    const [course, setCourse] = useState<Course | null>(null);
    const { id } = use(params);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modals, setModals] = useState({ block: false });
    const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
    const [blockName, setBlockName] = useState("");
    // const [blockDescription, setBlockDescription] = useState("");
    const [blockDescription, setBlockDescription] = useState<string>("");


    const fetchCourseData = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        try {
            const [courseData, blocksData] = await Promise.all([
                getCourseById(id),
                getModulesByCourseId(id),
            ]);
            setCourse(courseData);
            setBlocks(blocksData);
        } catch (error) {
            console.error("Error fetching course data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    const handleSaveBlock = useCallback(async () => {
        try {
            if (currentBlock) {
                const response = await updateBlock(currentBlock.id, id, blockName);
                if (response?.id) {
                    setBlocks((prev) =>
                        prev.map((block) =>
                            block.id === currentBlock.id ? { ...block, name: blockName } : block
                        )
                    );
                }
            } else {
                const response = await createBlock(id, blockName);
                if (response?.id) {
                    const newBlock: Block = {
                        id: response.id,
                        name: blockName,
                        course_id: course?.id || null,
                    };
                    setBlocks((prev) => [...prev, newBlock]);
                }
            }

            setModals({ ...modals, block: false });
            setBlockName("");
            setBlockDescription("");
            setCurrentBlock(null);
        } catch (error) {
            console.error("Error saving block:", error);
        }
    }, [blockName, currentBlock, course?.id, id, modals]);

    const handleOpenBlockModal = useCallback((block: Block | null) => {
        setCurrentBlock(block);
        setBlockName(block?.name || "");
        setBlockDescription(block?.name || "");
        setModals({ ...modals, block: true });        
    }, [modals]);

    const renderedBlocks = useMemo(
        () =>
            blocks.map((block) => (
                <BlockSection
                    key={block.id}
                    block={block}
                    setModals={setModals}
                    handleOpenBlockModal={handleOpenBlockModal}
                />
            )),
        [blocks, setModals, handleOpenBlockModal]
    );

    if (isLoading) {
        return <Skeleton height={400} />;
    }

    return (
        <div className="container mx-auto py-10 px-4 flex w-full gap-4">
            {/* <div className="flex-1 bg-zinc-100 rounded-3xl p-6">
                <h2 className="font-bold text-xl mb-6">Edit Course</h2>
                <div className="mb-4">
                    <label className="block font-bold">Course Name:</label>
                    <input
                        type="text"
                        value={course?.name || ""}
                        readOnly
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold">Description:</label>
                    <textarea
                        value={course?.description || ""}
                        readOnly
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="flex justify-between">
                    <Link href={`/workspace/course/${course?.id}`}>
                        <Button variant="outline">Back</Button>
                    </Link>
                    <Button variant="primary">Save</Button>
                </div>
            </div> */}

            <div className="w-1/2 mx-auto">
                <Suspense fallback={<div>Loading...</div>}>
                    <CourseEditForm course={course} />
                </Suspense>
            </div>

            <div className="flex-1 bg-[--card] rounded-xl p-6 w-1/2 border">
                <h2 className="font-bold text-xl mb-6">Curriculum</h2>
                {renderedBlocks}
                <Button onClick={() => handleOpenBlockModal(null)}>Add Module</Button>
            </div>

            <BlockModal
                isOpen={modals.block}
                onClose={() => setModals({ ...modals, block: false })}
                onSave={handleSaveBlock}
                blockName={blockName}
                setBlockName={setBlockName}
                blockDescription={blockDescription}
                setBlockDescription={setBlockDescription}
                currentBlock={currentBlock}
            />
        </div>
    );
}