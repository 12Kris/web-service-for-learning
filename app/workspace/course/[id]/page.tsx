"use client";

import { use, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
    getBlocksByCourseId,
    getCourseById,
    isCourseAddedToUser,
    deleteCourse,
    getMaterialsByBlockId,
    getTestsByBlockId
} from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/authActions";
import Link from "next/link";
import { Course } from "@/lib/definitions";
import { deleteMaterial } from "@/lib/tests/actions";
import BlockSection from "./BlockSection";
import { MaterialModal } from "@/components/workspace/modals/material";
import { BlockModal } from "@/components/workspace/modals/block";
import { TestModal } from "@/components/workspace/modals/test";
import {
    handleOpenModal,
    handleCloseModal,
    handleCreateOrEditBlock,
    handleOpenMaterialModal,
    handleCloseMaterialModal,
    handleCreateOrEditMaterial,
    handleOpenTestModal,
    handleCloseTestModal,
    handleCreateOrEditTest
} from "@/lib/tests/handlers";

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: number }> }) {
    const [course, setCourse] = useState<Course | null>(null);
    const [isCourseAdded, setIsCourseAdded] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [tests, setTests] = useState({});
    const [materials, setMaterials] = useState({});
    const [modals, setModals] = useState({ block: false, material: false, test: false });
    const [currentBlockId, setCurrentBlockId] = useState<number | null>(null);
    const [currentBlock, setCurrentBlock] = useState<any>(null);
    const [blockName, setBlockName] = useState("");

    const [currentMaterial, setCurrentMaterial] = useState<any>(null);
    const [materialTitle, setMaterialTitle] = useState("");
    const [materialContent, setMaterialContent] = useState("");

    const [currentTest, setCurrentTest] = useState<any>(null);
    const [testData, setTestData] = useState({});

    const { id } = use(params);

    const handleCloseTestModal = (
        setModals: (modals: any) => void,
        setCurrentTest: (test: any) => void
    ) => {
        setModals((prev) => ({ ...prev, test: false }));
        setCurrentTest(null); // Сброс теста при закрытии модалки
    };


    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            try {
                const [courseData, user, blocksData] = await Promise.all([
                    getCourseById(id),
                    getUser(),
                    getBlocksByCourseId(id),
                ]);

                setCourse(courseData);
                setIsCreator(user?.id.toString() === courseData.creator_id.toString());

                const isAdded = await isCourseAddedToUser(id);
                setIsCourseAdded(isAdded);

                const testsData: any = {};
                const materialsData: any = {};
                const blocksPromises = blocksData.map(async (block) => {
                    testsData[block.id] = await getTestsByBlockId(block.id);
                    materialsData[block.id] = await getMaterialsByBlockId(block.id);
                });

                await Promise.all(blocksPromises);
                setBlocks(blocksData);
                setTests(testsData);
                setMaterials(materialsData);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [id]);

    const handleAddCourse = async () => {
        await addCourseToUser(id);
        setIsCourseAdded(true);
    };

    const handleDeleteCourse = async () => {
        const result = await deleteCourse(id);
        if (result.success) window.location.href = "/workspace/";
        else alert(`Failed to delete course: ${result.message}`);
    };

    return (
        <div className="container mx-auto py-10 px-4 grid grid-cols-[1fr_300px] gap-4">
            {/* Course Details */}
            <div className="bg-zinc-100 rounded-3xl p-6">
                <h1 className="text-3xl font-bold mb-6">{course?.name || <Skeleton count={1} />}</h1>
                <p className="mb-6">{course?.description || <Skeleton count={3} />}</p>
                <div>
                    <strong>Type:</strong> {course?.type || <Skeleton width={130} />}
                </div>
                <div>
                    <strong>Instructor:</strong> {course?.creator?.full_name || <Skeleton width={130} />}
                </div>
                <div className="my-4">
                    <Button onClick={handleAddCourse} disabled={isCourseAdded}>
                        {isCourseAdded ? "Subscribed" : "Subscribe"}
                    </Button>
                    <Link href={`/workspace/course/${course?.id}/cards`} className="ml-4">
                        <Button>Take the test</Button>
                    </Link>
                </div>
            </div>

            {/* Blocks Section */}
            {isCreator && (
                <div className="flex flex-col gap-4">
                    {blocks.map((block) => (
                        <BlockSection
                            key={block.id}
                            block={block}
                            tests={tests[block.id]}
                            setCurrentTest={setCurrentTest}
                            materials={materials[block.id]}
                            setModals={setModals}
                            setCurrentBlockId={setCurrentBlockId}
                            currentBlockId={currentBlockId}
                            handleOpenMaterialModal={(material) =>
                                handleOpenMaterialModal(
                                    material,
                                    block.id,
                                    setCurrentBlockId,
                                    setCurrentMaterial,
                                    setMaterialTitle,
                                    setMaterialContent,
                                    setModals
                                )
                            }
                            handleOpenTestModal={(test) =>
                                handleOpenTestModal(
                                    test,
                                    block.id,
                                    setCurrentTest,
                                    setCurrentBlockId,
                                    setModals
                                )
                            }
                            handleOpenBlockModal={() =>
                                handleOpenModal(block, setCurrentBlock, setBlockName, setModals)
                            }
                        />
                    ))}
                    <Button onClick={() => handleOpenModal(null, setCurrentBlock, setBlockName, setModals)}>
                        Create Block
                    </Button>
                </div>
            )}

            {/* Modals */}
            <BlockModal
                isOpen={modals.block}
                onClose={() => handleCloseModal(setModals, setCurrentBlock, setBlockName)}
                onSave={() =>
                    handleCreateOrEditBlock(
                        blockName,
                        currentBlock,
                        id,
                        setModals,
                        setBlocks,
                        getBlocksByCourseId
                    )
                }
                blockName={blockName}
                setBlockName={setBlockName}
            />
            <MaterialModal
                isOpen={modals.material}
                onClose={() => handleCloseMaterialModal(setModals, setCurrentMaterial, setMaterialTitle, setMaterialContent)}
                onSave={() =>
                    handleCreateOrEditMaterial(
                        materialTitle,
                        materialContent,
                        currentMaterial,
                        currentBlockId,
                        setModals,
                        setMaterials
                    )
                }

                materialTitle={materialTitle}
                setMaterialTitle={setMaterialTitle}
                materialContent={materialContent}
                setMaterialContent={setMaterialContent}
            />
            <TestModal
                isOpen={modals.test}
                onClose={() => handleCloseTestModal(setModals, setCurrentTest)}
                currentTest={currentTest}
                blockId={currentBlockId}
                onSave={(testData) => {
                    handleCreateOrEditTest(testData, currentTest, setModals, setTests);
                }}
            />
        </div>
    );
}
