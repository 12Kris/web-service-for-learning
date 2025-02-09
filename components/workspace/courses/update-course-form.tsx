"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/lib/courses/actions";
import { createBlock, updateBlock, deleteBlock } from "@/lib/tests/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import { MaterialModal } from "@/components/workspace/modals/material";
import { TestModal } from "@/components/workspace/modals/test";
import { Card as CardDefinitions } from "@/lib/definitions";
import {
    type Course,
    CourseDetails,
    Module,
    WhatWillLearn,
    LearningMaterial,
    MaterialData,
    TestData,
    TestDataWithQuestion,
} from "@/lib/definitions";
import {
    createMaterial,
    deleteMaterial,
    updateMaterial,
    createTest,
    updateTest,
    deleteTest,
} from "@/lib/tests/actions";
import { getMaterialsByBlockId, getTestsByBlockId } from "@/lib/courses/actions";
import BlockModal from "@/components/workspace/modals/block";

type FormState = {
    name: string | undefined;
    description: string | undefined;
    type: string | undefined;
    course_details: CourseDetails[];
    curriculum: Module[];
    what_w_learn: WhatWillLearn[];
};

export function CourseEditForm({ course, modules }: { course: Course; modules: Module[] }) {
    const [formState, setFormState] = useState<FormState>({
        name: course.name,
        description: course.description,
        type: course.type,
        course_details: course.course_details || [],
        curriculum: modules || [],
        what_w_learn: course.what_w_learn || [],
    });
    const [materials, setMaterials] = useState<LearningMaterial[] | null>(null);
    const [tests, setTests] = useState<TestData[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
    const [isTestModalOpen, setTestModalOpen] = useState(false);
    const [isBlockModalOpen, setBlockModalOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState<LearningMaterial | null>(null);
    const [materialTitle, setMaterialTitle] = useState("");
    const [materialContents, setMaterialContents] = useState<CardDefinitions[]>([]);
    const [currentTest, setCurrentTest] = useState<TestData | null>(null);
    const [currentBlock, setCurrentBlock] = useState<Module | null>(null);
    const [blockName, setBlockName] = useState<string>("");
    const [blockDescription, setBlockDescription] = useState<string>("");

    const router = useRouter();

    const fetchBlockData = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedMaterials = await Promise.all(
                modules.map((module) => getMaterialsByBlockId(module.id))
            );
            const fetchedTests = await Promise.all(
                modules.map((module) => getTestsByBlockId(module.id))
            );
            console.log(fetchedMaterials.flat());
            console.log(fetchedTests.flat());
            setMaterials(fetchedMaterials.flat());
            setTests(fetchedTests.flat());
        } catch (error) {
            console.error("Error fetching materials or tests:", error);
        } finally {
            setIsLoading(false);
        }
    }, [modules]);

    useEffect(() => {
        fetchBlockData();
    }, [fetchBlockData]);

    const handleSaveMaterial = async (blockId: number, materialData: MaterialData, materialContents: { front: string; back: string }[]) => {
        setIsLoading(true);
        try {
            if (!currentMaterial?.id) {
                await createMaterial({ title: materialData.title, block_id: blockId }, materialContents);
            } else {
                await updateMaterial(currentMaterial.id, { title: materialData.title }, materialContents);
            }
            await fetchBlockData();
            setMaterialModalOpen(false);
        } catch (error) {
            console.error("Error saving material:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveTest = async (testId: number | null, testData: TestDataWithQuestion) => {
        setIsLoading(true);
        try {
            if (testId) {
                await updateTest(testId, testData);
            } else {
                await createTest(testData);
            }
            await fetchBlockData();
            setTestModalOpen(false);
        } catch (error) {
            console.error("Error saving test:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMaterialItem = async (materialId: number) => {
        setIsLoading(true);
        try {
            await deleteMaterial(materialId);
            await fetchBlockData();
        } catch (error) {
            console.error("Error deleting material:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTestItem = async (testId: number) => {
        setIsLoading(true);
        try {
            await deleteTest(testId);
            await fetchBlockData();
        } catch (error) {
            console.error("Error deleting test:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateCourse(course.id, formState, course.creator_id);
            router.push(`/workspace/course/${course.id}`);
        } catch (err) {
            console.error("Error updating course:", err);
        }
    };

    const handleSaveBlock = async () => {
        try {
            const newBlock = await createBlock(course.id, blockName, blockDescription);
            if(newBlock) {
                setFormState((prev) => ({
                    ...prev,
                    curriculum: [
                        ...prev.curriculum,
                        {
                            id: newBlock.id,
                            name: blockName,
                            description: blockDescription,
                        },
                    ],
                }));
            }
        } catch (error) {
            console.error("Error saving block:", error);
        } finally {
            setBlockModalOpen(false);
            setBlockName("");
            setBlockDescription("");
        }
    };

    const handleUpdateBlock = async (blockId: number, newName: string | undefined, newDescription: string | undefined) => {
        try {
            if(newName){
                await updateBlock(blockId, newName, newDescription);
            }
            setFormState((prev) => ({
                ...prev,
                curriculum: prev.curriculum.map((block) =>
                    block.id === blockId ? { ...block, name: newName, description: newDescription ?? "" } : block
                ),
            }));
        } catch (error) {
            console.error("Error updating block:", error);
        }
    };

    const handleDeleteBlock = async (blockId: number) => {
        try {
            await deleteBlock(blockId);
            setFormState((prev) => ({
                ...prev,
                curriculum: prev.curriculum.filter((block) => block.id !== blockId),
            }));
        } catch (error) {
            console.error("Error deleting block:", error);
        }
    };

    if (isLoading || materials === null || tests === null) {
        return <Skeleton height={200} className="mb-4" />;
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Course: {course.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Course Name</Label>
                        <Input
                            type="text"
                            value={formState.name}
                            onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={formState.description}
                            onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Curriculum</Label>
                        {formState.curriculum.map((module) => (
                            <Card key={module.id} className="p-4 space-y-4">
                                <div>
                                    <Label>Module Title</Label>
                                    <Input
                                        type="text" disabled
                                        value={module.name}
                                        onChange={(e) =>
                                            handleUpdateBlock(module.id, e.target.value, module.description)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Module Description</Label>
                                    <Textarea
                                        disabled
                                        value={module.description}
                                        onChange={(e) =>
                                            handleUpdateBlock(module.id, module.name, e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setTestModalOpen(true);
                                            setCurrentTest(null);
                                        }}
                                    >
                                        Add Test
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMaterialModalOpen(true);
                                            setCurrentMaterial({ id: 0, title: "", content: "" });
                                            setMaterialTitle("");
                                            setMaterialContents([]);
                                        }}
                                    >
                                        Add Material
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setBlockModalOpen(true);
                                            setCurrentBlock(module);
                                            setBlockName(module.name ?? "");
                                            setBlockDescription(module.description ?? "");
                                        }}
                                    >
                                        Edit Module
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteBlock(module.id)
                                        }}
                                    >
                                        Delete Module
                                    </Button>
                                </div>

                                {materials
                                    .filter((material) => material.block_id === module.id)
                                    .map((material) => (
                                        <div key={material.id}>
                                            <Label>{material.title}</Label>
                                            <Button
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentMaterial(material);
                                                    setMaterialModalOpen(true);
                                                }}
                                            >
                                                Edit Material
                                            </Button>
                                            <Button variant="destructive" onClick={() => deleteMaterialItem(material.id)}>
                                                Delete Material
                                            </Button>
                                        </div>
                                    ))}

                                {tests
                                    .filter((test) => test.block_id === module.id)
                                    .map((test) => (
                                        <div key={test.id}>
                                            <Label>{test.question}</Label>
                                            <Button
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentTest(test);
                                                    setTestModalOpen(true);
                                                }}
                                            >
                                                Edit Test
                                            </Button>
                                            <Button variant="destructive" onClick={() => deleteTestItem(test.id)}>
                                                Delete Test
                                            </Button>
                                        </div>
                                    ))}
                            </Card>
                        ))}
                    </div>
                    <Button
                        type="button"
                        onClick={() => {
                            setBlockModalOpen(true);
                            setCurrentBlock(null);
                            setBlockName("");
                        }}
                        variant="outline"
                    >
                        Add Module
                    </Button>
                    <Button type="submit" className="w-full">
                        Update Course
                    </Button>
                </form>
            </CardContent>

            <MaterialModal
                isOpen={isMaterialModalOpen}
                onClose={() => setMaterialModalOpen(false)}
                onSave={(materialTitle: string, materialContents: CardDefinitions[]) =>
                    handleSaveMaterial(formState.curriculum[0].id ?? null, { title: materialTitle }, materialContents)
                }
                materialTitle={materialTitle}
                setMaterialTitle={setMaterialTitle}
                currentMaterial={currentMaterial}
                blockId={formState?.curriculum[0]?.id ?? null}
                materialContents={materialContents}
                setMaterialContents={setMaterialContents}
            />

            <TestModal
                isOpen={isTestModalOpen}
                onClose={() => setTestModalOpen(false)}
                onSave={handleSaveTest}
                testId={currentTest?.id || null}
                blockId={formState?.curriculum[0]?.id ?? null}
            />

            <BlockModal
                isOpen={isBlockModalOpen}
                onClose={() => setBlockModalOpen(false)}
                onSave={currentBlock
                    ? () => handleUpdateBlock(currentBlock.id, blockName, blockDescription)
                    : () => handleSaveBlock()
                }
                blockName={blockName}
                setBlockName={setBlockName}
                blockDescription={blockDescription}
                setBlockDescription={setBlockDescription}
                currentBlock={currentBlock}
            />
        </Card>
    );
}