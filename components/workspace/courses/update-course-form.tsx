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
import { Card as CardDefinitions } from "@/lib/types/card";
import { Module } from "@/lib/types/modules";


import {
    type Course,
    CourseDetails,
    WhatWillLearn,

} from "@/lib/types/course";
import { LearningMaterial } from "@/lib/types/learning";
import { TestData, TestDataWithQuestion } from "@/lib/types/test";
import { MaterialData } from "@/lib/types/learning";

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
    const [currentBlockId, setCurrentBlockId] = useState(0);

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
            router.push(`/workspace/courses/${course.id}`);
        } catch (err) {
            console.error("Error updating course:", err);
        }
    };

    const handleSaveBlock = async () => {
        try {
            const newModule = await createBlock(course.id, blockName, blockDescription);
            if (newModule) {
              setFormState((prev) => ({
                ...prev,
                curriculum: [
                  ...prev.curriculum,
                  {
                    id: newModule.id,
                    title: blockName, // was "name" before
                    description: blockDescription,
                    duration: "",     // Provide an appropriate default or calculated value
                    lessons: [],      // Initially empty
                    isActive: false,  // Default value; adjust as needed
                    isCompleted: false,
                    progress: 0,
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

    const updateFormState = <K extends keyof FormState>(
        key: K,
        value: FormState[K]
      ) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
      };
    
      const updateItem = <
        K extends "course_details" | "what_w_learn",
        F extends keyof FormState[K][number]
      >(
        key: K,
        index: number,
        field: F,
        value: string
      ) => {
        setFormState((prev) => ({
          ...prev,
          [key]: prev[key].map((item, i) =>
            i === index ? { ...item, [field]: value } : item
          ),
        }));
      };
    
      const addItem = <K extends "course_details" | "what_w_learn">(key: K) => {
        setFormState((prev) => ({
          ...prev,
          [key]: [
            ...prev[key],
            {
              id: prev[key].length + 1,
              description: "",
              ...(key === "course_details" ? { course_detail: "" } : {}),
            },
          ],
        }));
      };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Course: {course.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <div className="space-y-2">
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
                    </div> */}

          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              type="text"
              value={formState.name}
              onChange={(e) => updateFormState("name", e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formState.description}
              onChange={(e) => updateFormState("description", e.target.value)}
              aria-label="Course description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Course Type</Label>
            <Input
              id="type"
              type="text"
              value={formState.type}
              onChange={(e) => updateFormState("type", e.target.value)}
              aria-label="Course type"
            />
          </div>

          {/* Course Details */}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Course Details</legend>
            {formState.course_details.map((detail, index) => (
              <div key={detail.id} className="space-y-2">
                <Textarea
                  placeholder={`Course Detail ${detail.id}`}
                  value={detail.course_detail}
                  onChange={(e) =>
                    updateItem(
                      "course_details",
                      index,
                      "course_detail",
                      e.target.value
                    )
                  }
                  aria-label={`Course detail ${detail.id}`}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addItem("course_details")}
              variant="outline"
            >
              Add Course Detail
            </Button>
          </fieldset>

          {/* What Students Will Learn */}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
              What Students Will Learn
            </legend>
            {formState.what_w_learn.map((item, index) => (
              <div key={item.id} className="space-y-2">
                <Textarea
                  placeholder={`Learning Outcome ${item.id}`}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(
                      "what_w_learn",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  aria-label={`Learning outcome ${item.id}`}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addItem("what_w_learn")}
              variant="outline"
            >
              Add Learning Outcome
            </Button>
          </fieldset>

                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Curriculum</Label>
                        {formState.curriculum.map((module) => (
                            <Card key={module.id} className="p-4 space-y-4">
                                <div>
                                    <Label>Module Title</Label>
                                    <Input
                                        type="text" disabled
                                        value={module.title}
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
                                            handleUpdateBlock(module.id, module.title, e.target.value)
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
                                            setCurrentBlockId(module.id);
                                        }}
                                    >
                                        Add Tests
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMaterialModalOpen(true);
                                            setCurrentMaterial({ id: 0, title: "", content: "" });
                                            setMaterialTitle("");
                                            setMaterialContents([]);
                                            setCurrentBlockId(module.id);
                                        }}
                                    >
                                        Add Cards
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setBlockModalOpen(true);
                                            setCurrentBlock(module);
                                            setBlockName(module.title ?? "");
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
                                    .filter((material) => material.block_id == module.id)
                                    .map((material) => (
                                        <div key={material.id}>
                                            <Label>{material.title}</Label>
                                            <Button
                                                variant="outline"
                                                className="mx-3"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentMaterial(material);
                                                    // setCurrentBlock(module);
                                                    setCurrentBlockId(module.id);
                                                    setMaterialModalOpen(true);
                                                }}
                                            >
                                                Edit Cards
                                            </Button>
                                            <Button variant="destructive" onClick={() => deleteMaterialItem(material.id)}>
                                                Delete Cards
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
                                                className="mx-3"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentTest(test);
                                                    // setCurrentBlock(module);
                                                    setCurrentBlockId(module.id);
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
                    // handleSaveMaterial(formState.curriculum[0].id ?? null, { title: materialTitle }, materialContents)
                    handleSaveMaterial(currentBlockId, { title: materialTitle }, materialContents) 
                }
                materialTitle={materialTitle}
                setMaterialTitle={setMaterialTitle}
                currentMaterial={currentMaterial}
                // blockId={formState?.curriculum[0]?.id ?? null}
                // blockId={currentMaterial?.block_id ?? null}
                blockId={currentBlock?.id ?? null}
                materialContents={materialContents}
                setMaterialContents={setMaterialContents}
            />

            <TestModal
                isOpen={isTestModalOpen}
                onClose={() => setTestModalOpen(false)}
                onSave={handleSaveTest}
                testId={currentTest?.id || null}
                blockId={currentBlockId}
                // blockId={formState?.curriculum[0]?.id ?? null}
                // blockId={currentTest?.block_id ?? null}
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