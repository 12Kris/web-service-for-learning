// "use client";

// import {useState, useCallback, useEffect} from "react";
// import {useRouter} from "next/navigation";
// import {deleteFlashcard, deleteQuestion, updateCourse, updateFlashcard, updateQuestion} from "@/lib/courses/actions";
// import {createBlock, updateBlock, deleteBlock} from "@/lib/tests/actions";
// import {Button} from "@/components/ui/button";
// import {Input} from "@/components/ui/input";
// import {Textarea} from "@/components/ui/textarea";
// import {Label} from "@/components/ui/label";
// import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
// import {MaterialModal} from "@/components/workspace/modals/material";
// import {TestModal} from "@/components/workspace/modals/test";
// import {Card as CardDefinitions} from "@/lib/types/card";
// import {Module} from "@/lib/types/modules";

// import {type Course, CourseDetails, WhatWillLearn} from "@/lib/types/course";
// import {LearningMaterial} from "@/lib/types/learning";
// import {TestData, TestDataWithQuestion} from "@/lib/types/test";
// import {MaterialData} from "@/lib/types/learning";

// import {createMaterial, deleteMaterial, updateMaterial, createTest, updateTest, deleteTest} from "@/lib/tests/actions";
// import {getMaterialsByBlockId, getTestsByBlockId,} from "@/lib/courses/actions";
// import BlockModal from "@/components/workspace/modals/block";
// import LoadingSpinner from "@/components/ui/loading-spinner";
// import Modal from "@/components/workspace/modals/modal";

// type FormState = {
//     name: string | undefined;
//     description: string | undefined;
//     type: string | undefined;
//     course_details: CourseDetails[];
//     curriculum: Module[];
//     what_w_learn: WhatWillLearn[];
// };

// type EditData = {
//     id?: number | null | undefined;
//     front?: string;
//     back?: string;
//     question?: string;
// };



// type EditType = "question" | "card";

// export function CourseEditForm({course, modules}: { course: Course; modules: Module[];
// }) {
//     const router = useRouter();

//     const [formState, setFormState] = useState<FormState>({
//         name: course.name,
//         description: course.description,
//         type: course.type,
//         course_details: course.course_details || [],
//         curriculum: modules || [],
//         what_w_learn: course.what_w_learn || [],
//     });
//     const [materials, setMaterials] = useState<LearningMaterial[] | null>(null);
//     const [tests, setTests] = useState<TestData[] | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
//     const [isTestModalOpen, setTestModalOpen] = useState(false);
//     const [isBlockModalOpen, setBlockModalOpen] = useState(false);
//     const [currentMaterial, setCurrentMaterial] = useState<LearningMaterial | null>(null);
//     const [materialTitle, setMaterialTitle] = useState("");
//     const [materialContents, setMaterialContents] = useState<CardDefinitions[]>([]);
//     const [currentTest, setCurrentTest] = useState<TestData | null>(null);
//     const [currentBlock, setCurrentBlock] = useState<Module | null>(null);
//     const [blockName, setBlockName] = useState<string>("");
//     const [blockDescription, setBlockDescription] = useState<string>("");
//     const [currentBlockId, setCurrentBlockId] = useState(0);
//     const [isEditModalOpen, setEditModalOpen] = useState(false);
//     const [editType, setEditType] = useState<EditType>("question");
//     const [editData, setEditData] = useState<EditData | null>(null);

//     const openEditModal = (type: EditType, data: EditData) => {
//         setEditType(type);
//         setEditData(data);
//         setEditModalOpen(true);
//     };

//     const handleSaveEdit = async (updatedData: EditData) => {
//         setIsLoading(true);
//         try {
//             if (editType === "question" && editData?.id) {
//                 await updateQuestion(editData.id, updatedData.question || "");
//             } else if (editData?.id) {
//                 await updateFlashcard(editData.id, updatedData.front || "", updatedData.back || "");
//             }

//             window.location.reload(); // тимчасово
//             setEditModalOpen(false);
//         } catch (error) {
//             console.error("Error updating:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchBlockData = useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const fetchedMaterials = await Promise.all(
//                 modules.map((module) => getMaterialsByBlockId(module.id))
//             );
//             const fetchedTests = await Promise.all(
//                 modules.map((module) => getTestsByBlockId(module.id))
//             );

//             setMaterials(fetchedMaterials.flat());
//             setTests(fetchedTests.flat());
//         } catch (error) {
//             console.error("Error fetching materials or tests:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [modules]);

//     useEffect(() => {
//         fetchBlockData();
//     }, [fetchBlockData]);

//     const handleSaveMaterial = async (
//         blockId: number,
//         materialData: MaterialData,
//         materialContents: { front: string; back: string }[]
//     ) => {
//         setIsLoading(true);
//         try {
//             if (!currentMaterial?.id) {
//                 await createMaterial(
//                     {title: materialData.title, block_id: blockId},
//                     materialContents
//                 );
//             } else {
//                 await updateMaterial(
//                     currentMaterial.id,
//                     {title: materialData.title},
//                     materialContents
//                 );
//             }
//             await fetchBlockData();
//             setMaterialModalOpen(false);
//         } catch (error) {
//             console.error("Error saving material:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSaveTest = async (
//         testId: number | null,
//         testData: TestDataWithQuestion
//     ) => {
//         setIsLoading(true);
//         try {
//             if (testId) {
//                 await updateTest(testId, testData);
//             } else {
//                 await createTest(testData);
//             }
//             await fetchBlockData();
//             setTestModalOpen(false);
//         } catch (error) {
//             console.error("Error saving test:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const deleteMaterialItem = async (materialId: number) => {
//         setIsLoading(true);
//         try {
//             await deleteMaterial(materialId);
//             await fetchBlockData();
//         } catch (error) {
//             console.error("Error deleting material:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const deleteTestItem = async (testId: number) => {
//         setIsLoading(true);
//         try {
//             await deleteTest(testId);
//             await fetchBlockData();
//         } catch (error) {
//             console.error("Error deleting test:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             await updateCourse(course.id, formState, course.creator_id);
//             router.push(`/workspace/courses/${course.id}`);
//         } catch (err) {
//             console.error("Error updating course:", err);
//         }
//     };

//     const handleSaveBlock = async () => {
//         try {
//             const newModule = await createBlock(
//                 course.id,
//                 blockName,
//                 blockDescription
//             );
//             if (newModule) {
//                 setFormState((prev) => ({
//                     ...prev,
//                     curriculum: [
//                         ...prev.curriculum,
//                         {
//                             id: newModule.id,
//                             title: blockName, // was "name" before
//                             description: blockDescription,
//                             duration: "", // Provide an appropriate default or calculated value
//                             lessons: [], // Initially empty
//                             isActive: false, // Default value; adjust as needed
//                             isCompleted: false,
//                             progress: 0,
//                         },
//                     ],
//                 }));
//             }
//         } catch (error) {
//             console.error("Error saving block:", error);
//         } finally {
//             setBlockModalOpen(false);
//             setBlockName("");
//             setBlockDescription("");
//         }
//     };

//     const handleUpdateBlock = async (
//         blockId: number,
//         newName: string | undefined,
//         newDescription: string | undefined
//     ) => {
//         try {
//             if (newName) {
//                 await updateBlock(blockId, newName, newDescription);
//             }
//             setFormState((prev) => ({
//                 ...prev,
//                 curriculum: prev.curriculum.map((block) =>
//                     block.id === blockId
//                         ? {...block, name: newName, description: newDescription ?? ""}
//                         : block
//                 ),
//             }));
//         } catch (error) {
//             console.error("Error updating block:", error);
//         }
//     };

//     const handleDeleteBlock = async (blockId: number) => {
//         try {
//             await deleteBlock(blockId);
//             setFormState((prev) => ({
//                 ...prev,
//                 curriculum: prev.curriculum.filter((block) => block.id !== blockId),
//             }));
//         } catch (error) {
//             console.error("Error deleting block:", error);
//         }
//     };

//     if (isLoading || materials === null || tests === null) {
//         return <LoadingSpinner className="mx-auto"/>;
//         // return <Skeleton height={200} className="mb-4" />;
//     }

//     const updateFormState = <K extends keyof FormState>(
//         key: K,
//         value: FormState[K]
//     ) => {
//         setFormState((prev) => ({...prev, [key]: value}));
//     };

//     const updateItem = <
//         K extends "course_details" | "what_w_learn",
//         F extends keyof FormState[K][number]
//     >(
//         key: K,
//         index: number,
//         field: F,
//         value: string
//     ) => {
//         setFormState((prev) => ({
//             ...prev,
//             [key]: prev[key].map((item, i) =>
//                 i === index ? {...item, [field]: value} : item
//             ),
//         }));
//     };

//     const addItem = <K extends "course_details" | "what_w_learn">(key: K) => {
//         setFormState((prev) => ({
//             ...prev,
//             [key]: [
//                 ...prev[key],
//                 {
//                     id: prev[key].length + 1,
//                     description: "",
//                     ...(key === "course_details" ? {course_detail: ""} : {}),
//                 },
//             ],
//         }));
//     };

//     return (
//         <Card className="w-full max-w-3xl mx-auto">
//             <CardHeader>
//                 <CardTitle>Edit Course: {course.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* <div className="space-y-2">
//                         <Label>Course Name</Label>
//                         <Input
//                             type="text"
//                             value={formState.name}
//                             onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
//                             required
//                         />
//                     </div>

//                     <div className="space-y-2">
//                         <Label>Description</Label>
//                         <Textarea
//                             value={formState.description}
//                             onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
//                         />
//                     </div> */}

//                     <div className="space-y-2">
//                         <Label htmlFor="name">Course Name</Label>
//                         <Input
//                             id="name"
//                             type="text"
//                             value={formState.name}
//                             onChange={(e) => updateFormState("name", e.target.value)}
//                             required
//                             aria-required="true"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="description">Description</Label>
//                         <Textarea
//                             id="description"
//                             value={formState.description}
//                             onChange={(e) => updateFormState("description", e.target.value)}
//                             aria-label="Course description"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="type">Course Type</Label>
//                         <Input
//                             id="type"
//                             type="text"
//                             value={formState.type}
//                             onChange={(e) => updateFormState("type", e.target.value)}
//                             aria-label="Course type"
//                         />
//                     </div>

//                     {/* Course Details */}
//                     <fieldset className="space-y-2">
//                         <legend className="text-sm font-medium">Course Details</legend>
//                         {formState.course_details.map((detail, index) => (
//                             <div key={detail.id} className="space-y-2">
//                                 <Textarea
//                                     placeholder={`Course Detail ${detail.id}`}
//                                     value={detail.course_detail}
//                                     onChange={(e) =>
//                                         updateItem(
//                                             "course_details",
//                                             index,
//                                             "course_detail",
//                                             e.target.value
//                                         )
//                                     }
//                                     aria-label={`Course detail ${detail.id}`}
//                                 />
//                             </div>
//                         ))}
//                         <Button
//                             type="button"
//                             onClick={() => addItem("course_details")}
//                             variant="outline"
//                         >
//                             Add Course Detail
//                         </Button>
//                     </fieldset>

//                     {/* What Students Will Learn */}
//                     <fieldset className="space-y-2">
//                         <legend className="text-sm font-medium">
//                             What Students Will Learn
//                         </legend>
//                         {formState.what_w_learn.map((item, index) => (
//                             <div key={item.id} className="space-y-2">
//                                 <Textarea
//                                     placeholder={`Learning Outcome ${item.id}`}
//                                     value={item.description}
//                                     onChange={(e) =>
//                                         updateItem(
//                                             "what_w_learn",
//                                             index,
//                                             "description",
//                                             e.target.value
//                                         )
//                                     }
//                                     aria-label={`Learning outcome ${item.id}`}
//                                 />
//                             </div>
//                         ))}
//                         <Button
//                             type="button"
//                             onClick={() => addItem("what_w_learn")}
//                             variant="outline"
//                         >
//                             Add Learning Outcome
//                         </Button>
//                     </fieldset>

//                     <div className="space-y-4">
//                         <Label className="text-lg font-semibold">Curriculum</Label>
//                         {formState.curriculum.map((module) => (
//                             <Card key={module.id} className="p-4 space-y-4">
//                                 <div>
//                                     <Label>Module Title</Label>
//                                     <Input
//                                         type="text"
//                                         disabled
//                                         value={module.title}
//                                         onChange={(e) =>
//                                             handleUpdateBlock(
//                                                 module.id,
//                                                 e.target.value,
//                                                 module.description
//                                             )
//                                         }
//                                     />
//                                 </div>
//                                 <div>
//                                     <Label>Module Description</Label>
//                                     <Textarea
//                                         disabled
//                                         value={module.description}
//                                         onChange={(e) =>
//                                             handleUpdateBlock(module.id, module.title, e.target.value)
//                                         }
//                                     />
//                                 </div>

//                                 <div className="flex space-x-2">
//                                     <Button
//                                         variant="outline"
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             setTestModalOpen(true);
//                                             setCurrentTest(null);
//                                             setCurrentBlockId(module.id);
//                                         }}
//                                     >
//                                         Add Tests
//                                     </Button>

//                                     <Button
//                                         variant="outline"
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             setMaterialModalOpen(true);
//                                             setCurrentMaterial({id: 0, title: "", content: ""});
//                                             setMaterialTitle("");
//                                             setMaterialContents([]);
//                                             setCurrentBlockId(module.id);
//                                         }}
//                                     >
//                                         Add Cards
//                                     </Button>

//                                     <Button
//                                         variant="outline"
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             setBlockModalOpen(true);
//                                             setCurrentBlock(module);
//                                             setBlockName(module.title ?? "");
//                                             setBlockDescription(module.description ?? "");
//                                         }}
//                                     >
//                                         Edit Module
//                                     </Button>

//                                     <Button
//                                         variant="destructive"
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             handleDeleteBlock(module.id);
//                                         }}
//                                     >
//                                         Delete Module
//                                     </Button>
//                                 </div>

//                                 <div className="border rounded-xl shadow p-4">
//                                     {materials
//                                         .filter((material) => material.block_id == module.id)
//                                         .map((material) => (
//                                             <div key={material.id} className="mb-3 border rounded-xl shadow p-4">
//                                                 <div className="mb-4">
//                                                     <Label>{material.title}</Label>
//                                                     <Button
//                                                         variant="outline"
//                                                         className="mx-3"
//                                                         onClick={(e) => {
//                                                             e.preventDefault();
//                                                             setCurrentMaterial(material);
//                                                             // setCurrentBlock(module);
//                                                             setCurrentBlockId(module.id);
//                                                             setMaterialModalOpen(true);
//                                                         }}
//                                                     >
//                                                         Edit Cards
//                                                     </Button>
//                                                     <Button
//                                                         variant="destructive"
//                                                         onClick={() => deleteMaterialItem(material.id)}
//                                                     >
//                                                         Delete Cards
//                                                     </Button>
//                                                 </div>

//                                                 <hr></hr>

//                                                 {material.flashcards && material.flashcards.length > 0 && (
//                                                     <ul className="my-1 pt-2">
//                                                         {material.flashcards.map((flashcard) => (
//                                                             <li key={flashcard.id} className="my-2">
//                                                                 - {flashcard.front}
//                                                                 <Button
//                                                                     variant="outline"
//                                                                     className="mx-3"
//                                                                     onClick={(e) => {
//                                                                         e.preventDefault()
//                                                                         openEditModal("card", flashcard)
//                                                                     }}
//                                                                 >
//                                                                     Edit Card
//                                                                 </Button>
//                                                                 <Button variant="destructive" onClick={(e) => {
//                                                                     e.preventDefault()
//                                                                     deleteFlashcard(flashcard.id)
//                                                                     window.location.href = `/workspace/courses/edit/${course.id}`
//                                                                 }}>
//                                                                     Delete Card
//                                                                 </Button>
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 )}

//                                                 <Button className="my-3">Add New Card</Button>
//                                             </div>
//                                         ))}

//                                     {tests
//                                         .filter((test) => test.block_id === module.id)
//                                         .map((test) => (
//                                             <div key={test.id} className="border rounded-xl shadow p-4">
//                                                 <div className="mb-4">
//                                                     <Label>{test.question}</Label>
//                                                     <Button
//                                                         variant="outline"
//                                                         className="mx-3"
//                                                         onClick={(e) => {
//                                                             e.preventDefault();
//                                                             setCurrentTest(test);
//                                                             // setCurrentBlock(module);
//                                                             setCurrentBlockId(module.id);
//                                                             setTestModalOpen(true);
//                                                         }}
//                                                     >
//                                                         Edit Test
//                                                     </Button>
//                                                     <Button
//                                                         variant="destructive"
//                                                         onClick={() => deleteTestItem(test.id)}
//                                                     >
//                                                         Delete Test
//                                                     </Button>
//                                                 </div>

//                                                 <hr></hr>

//                                                 {test.TestQuestions && test.TestQuestions.length > 0 && (
//                                                     <ul className="my-1 pt-2">
//                                                         {test.TestQuestions.map((question) => (
//                                                             <li key={question.id} className="my-2">
//                                                                 - {question.question}
//                                                                 <Button
//                                                                     variant="outline"
//                                                                     className="mx-3"
//                                                                     onClick={(e) => {
//                                                                         e.preventDefault();
//                                                                         openEditModal("question", question);
//                                                                     }}
//                                                                 >
//                                                                     Edit Question
//                                                                 </Button>
//                                                                 <Button variant="destructive" onClick={(e) => {
//                                                                     e.preventDefault();
//                                                                     deleteQuestion(question.id);
//                                                                     window.location.href = `/workspace/courses/edit/${course.id}`
//                                                                 }}>
//                                                                     Delete Question
//                                                                 </Button>
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 )}
                                                
//                                                 <Button className="my-3">Add New Question</Button>
//                                             </div>
//                                         ))}
//                                 </div>
//                             </Card>
//                         ))}
//                     </div>
//                     <Button
//                         type="button"
//                         onClick={() => {
//                             setBlockModalOpen(true);
//                             setCurrentBlock(null);
//                             setBlockName("");
//                         }}
//                         variant="outline"
//                     >
//                         Add Module
//                     </Button>
//                     <Button type="submit" className="w-full">
//                         Update Course
//                     </Button>
//                 </form>
//             </CardContent>

//             <MaterialModal
//                 isOpen={isMaterialModalOpen}
//                 onClose={() => setMaterialModalOpen(false)}
//                 onSave={(materialTitle: string, materialContents: CardDefinitions[]) =>
//                     // handleSaveMaterial(formState.curriculum[0].id ?? null, { title: materialTitle }, materialContents)
//                     handleSaveMaterial(
//                         currentBlockId,
//                         {title: materialTitle},
//                         materialContents
//                     )
//                 }
//                 materialTitle={materialTitle}
//                 setMaterialTitle={setMaterialTitle}
//                 currentMaterial={currentMaterial}
//                 // blockId={formState?.curriculum[0]?.id ?? null}
//                 // blockId={currentMaterial?.block_id ?? null}
//                 blockId={currentBlock?.id ?? null}
//                 materialContents={materialContents}
//                 setMaterialContents={setMaterialContents}
//             />

//             <TestModal
//                 isOpen={isTestModalOpen}
//                 onClose={() => setTestModalOpen(false)}
//                 onSave={handleSaveTest}
//                 testId={currentTest?.id || null}
//                 blockId={currentBlockId}
//                 // blockId={formState?.curriculum[0]?.id ?? null}
//                 // blockId={currentTest?.block_id ?? null}
//             />

//             <Modal
//                 isOpen={isEditModalOpen}
//                 onClose={() => setEditModalOpen(false)}
//                 onSave={handleSaveEdit}
//                 type={editType}
//                 initialData={editData || null}
//             />

//             <BlockModal
//                 isOpen={isBlockModalOpen}
//                 onClose={() => setBlockModalOpen(false)}
//                 onSave={
//                     currentBlock
//                         ? () =>
//                             handleUpdateBlock(currentBlock.id, blockName, blockDescription)
//                         : () => handleSaveBlock()
//                 }
//                 blockName={blockName}
//                 setBlockName={setBlockName}
//                 blockDescription={blockDescription}
//                 setBlockDescription={setBlockDescription}
//                 currentBlock={currentBlock}
//             />
//         </Card>
//     );
// }



"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { deleteFlashcard, deleteQuestion, updateCourse, updateFlashcard, updateQuestion } from "@/lib/courses/actions"
import { createBlock, updateBlock, deleteBlock } from "@/lib/tests/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MaterialModal } from "@/components/workspace/modals/material"
import { TestModal } from "@/components/workspace/modals/test"
import type { Card as CardDefinitions } from "@/lib/types/card"
import type { Module } from "@/lib/types/modules"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Course, CourseDetails, WhatWillLearn } from "@/lib/types/course"
import type { LearningMaterial } from "@/lib/types/learning"
import type { TestData, TestDataWithQuestion } from "@/lib/types/test"
import type { MaterialData } from "@/lib/types/learning"
import { createMaterial, deleteMaterial, updateMaterial, createTest, updateTest, deleteTest } from "@/lib/tests/actions"
import { getMaterialsByBlockId, getTestsByBlockId } from "@/lib/courses/actions"
import BlockModal from "@/components/workspace/modals/block"
import LoadingSpinner from "@/components/ui/loading-spinner"
import Modal from "@/components/workspace/modals/modal"

type FormState = {
  name: string | undefined
  description: string | undefined
  type: string | undefined
  course_details: CourseDetails[]
  curriculum: Module[]
  what_w_learn: WhatWillLearn[]
}

type EditData = {
  id?: number | null | undefined
  front?: string
  back?: string
  question?: string
}

type EditType = "question" | "card"

export function CourseEditForm({ course, modules }: { course: Course; modules: Module[] }) {
  const router = useRouter()

  const [formState, setFormState] = useState<FormState>({
    name: course.name,
    description: course.description,
    type: course.type,
    course_details: course.course_details || [],
    curriculum: modules || [],
    what_w_learn: course.what_w_learn || [],
  })
  const [materials, setMaterials] = useState<LearningMaterial[] | null>(null)
  const [tests, setTests] = useState<TestData[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMaterialModalOpen, setMaterialModalOpen] = useState(false)
  const [isTestModalOpen, setTestModalOpen] = useState(false)
  const [isBlockModalOpen, setBlockModalOpen] = useState(false)
  const [currentMaterial, setCurrentMaterial] = useState<LearningMaterial | null>(null)
  const [materialTitle, setMaterialTitle] = useState("")
  const [materialContents, setMaterialContents] = useState<CardDefinitions[]>([])
  const [currentTest, setCurrentTest] = useState<TestData | null>(null)
  const [currentBlock, setCurrentBlock] = useState<Module | null>(null)
  const [blockName, setBlockName] = useState<string>("")
  const [blockDescription, setBlockDescription] = useState<string>("")
  const [currentBlockId, setCurrentBlockId] = useState(0)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [editType, setEditType] = useState<EditType>("question")
  const [editData, setEditData] = useState<EditData | null>(null)

  const openEditModal = (type: EditType, data: EditData) => {
    setEditType(type)
    setEditData(data)
    setEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedData: EditData) => {
    setIsLoading(true)
    try {
      if (editType === "question" && editData?.id) {
        await updateQuestion(editData.id, updatedData.question || "")
      } else if (editData?.id) {
        await updateFlashcard(editData.id, updatedData.front || "", updatedData.back || "")
      }

      window.location.reload() // тимчасово
      setEditModalOpen(false)
    } catch (error) {
      console.error("Error updating:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBlockData = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedMaterials = await Promise.all(modules.map((module) => getMaterialsByBlockId(module.id)))
      const fetchedTests = await Promise.all(modules.map((module) => getTestsByBlockId(module.id)))

      setMaterials(fetchedMaterials.flat())
      setTests(fetchedTests.flat())
    } catch (error) {
      console.error("Error fetching materials or tests:", error)
    } finally {
      setIsLoading(false)
    }
  }, [modules])

  useEffect(() => {
    fetchBlockData()
  }, [fetchBlockData])

  const handleSaveMaterial = async (
    blockId: number,
    materialData: MaterialData,
    materialContents: { front: string; back: string }[],
  ) => {
    setIsLoading(true)
    try {
      if (!currentMaterial?.id) {
        await createMaterial({ title: materialData.title, block_id: blockId }, materialContents)
      } else {
        await updateMaterial(currentMaterial.id, { title: materialData.title }, materialContents)
      }
      await fetchBlockData()
      setMaterialModalOpen(false)
    } catch (error) {
      console.error("Error saving material:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTest = async (testId: number | null, testData: TestDataWithQuestion) => {
    setIsLoading(true)
    try {
      if (testId) {
        await updateTest(testId, testData)
      } else {
        await createTest(testData)
      }
      await fetchBlockData()
      setTestModalOpen(false)
    } catch (error) {
      console.error("Error saving test:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMaterialItem = async (materialId: number) => {
    setIsLoading(true)
    try {
      await deleteMaterial(materialId)
      await fetchBlockData()
    } catch (error) {
      console.error("Error deleting material:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTestItem = async (testId: number) => {
    setIsLoading(true)
    try {
      await deleteTest(testId)
      await fetchBlockData()
    } catch (error) {
      console.error("Error deleting test:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await updateCourse(course.id, formState, course.creator_id)
      router.push(`/workspace/courses/${course.id}`)
    } catch (err) {
      console.error("Error updating course:", err)
    }
  }

  const handleSaveBlock = async () => {
    try {
      const newModule = await createBlock(course.id, blockName, blockDescription)
      if (newModule) {
        setFormState((prev) => ({
          ...prev,
          curriculum: [
            ...prev.curriculum,
            {
              id: newModule.id,
              title: blockName,
              description: blockDescription,
              duration: "",
              lessons: [],
              isActive: false,
              isCompleted: false,
              progress: 0,
            },
          ],
        }))
      }
    } catch (error) {
      console.error("Error saving block:", error)
    } finally {
      setBlockModalOpen(false)
      setBlockName("")
      setBlockDescription("")
    }
  }

  const handleUpdateBlock = async (
    blockId: number,
    newName: string | undefined,
    newDescription: string | undefined,
  ) => {
    try {
      if (newName) {
        await updateBlock(blockId, newName, newDescription)
      }
      setFormState((prev) => ({
        ...prev,
        curriculum: prev.curriculum.map((block) =>
          block.id === blockId ? { ...block, name: newName, description: newDescription ?? "" } : block,
        ),
      }))
    } catch (error) {
      console.error("Error updating block:", error)
    }
  }

  const handleDeleteBlock = async (blockId: number) => {
    try {
      await deleteBlock(blockId)
      setFormState((prev) => ({
        ...prev,
        curriculum: prev.curriculum.filter((block) => block.id !== blockId),
      }))
    } catch (error) {
      console.error("Error deleting block:", error)
    }
  }

  if (isLoading || materials === null || tests === null) {
    return <LoadingSpinner className="mx-auto" />
  }

  const updateFormState = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const updateItem = <K extends "course_details" | "what_w_learn", F extends keyof FormState[K][number]>(
    key: K,
    index: number,
    field: F,
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

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
    }))
  }

  return (
    <div className="bg-[--background] min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* <h1 className="text-2xl font-medium text-[#5c8d89] mb-2">Memorize</h1> */}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-[#faf8f1] rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium text-[#5c8d89] mb-6">Edit Course Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#5c8d89] font-medium">
                  Course Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formState.name}
                  onChange={(e) => updateFormState("name", e.target.value)}
                  required
                  className="border-[#e6e1d5] bg-white"
                  placeholder="Example"
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="type" className="text-[#5c8d89] font-medium">
                  Course Type
                </Label>
                <Select value={formState.type} onValueChange={(value) => updateFormState("type", value)}>
                  <SelectTrigger className="border-[#e6e1d5] bg-white">
                    <SelectValue placeholder="Example" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-[#5c8d89] font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formState.description}
                  onChange={(e) => updateFormState("description", e.target.value)}
                  className="border-[#e6e1d5] bg-white min-h-[100px]"
                  placeholder="Example"
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="level" className="text-[#5c8d89] font-medium">
                  Level
                </Label>
                <Select defaultValue="advanced">
                  <SelectTrigger className="border-[#e6e1d5] bg-white">
                    <SelectValue placeholder="Advanced" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <div className="space-y-2">
              <Label className="text-[#5c8d89] font-medium">What Students Will Learn</Label>
              {formState.what_w_learn.map((item, index) => (
                <Textarea
                  key={item.id}
                  placeholder="Example"
                  value={item.description}
                  onChange={(e) => updateItem("what_w_learn", index, "description", e.target.value)}
                  className="border-[#e6e1d5] bg-white mb-2"
                />
              ))}
              <Button
                type="button"
                onClick={() => addItem("what_w_learn")}
                variant="outline"
                className="text-[#5c8d89] border-[#5c8d89]"
              >
                Add Learning Outcome
              </Button>
            </div>
          </div>

          <div className="bg-[#faf8f1] rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium text-[#5c8d89] mb-6">Edit Course Curriculum</h2>

            {formState.curriculum.map((module) => (
              <div key={module.id} className="mb-6 border border-[#e6e1d5] rounded-lg p-4">
                <div className="space-y-4 mb-4">
                  <div>
                    <Label className="text-[#5c8d89] font-medium">Module Name</Label>
                    <Input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleUpdateBlock(module.id, e.target.value, module.description)}
                      className="border-[#e6e1d5] bg-white"
                      placeholder="Example"
                    />
                  </div>
                  <div>
                    <Label className="text-[#5c8d89] font-medium">Module Description</Label>
                    <Textarea
                      value={module.description}
                      onChange={(e) => handleUpdateBlock(module.id, module.title, e.target.value)}
                      className="border-[#e6e1d5] bg-white"
                      placeholder="Example"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      setTestModalOpen(true)
                      setCurrentTest(null)
                      setCurrentBlockId(module.id)
                    }}
                    className="text-[#5c8d89] border-[#5c8d89]"
                  >
                    Add Tests
                  </Button>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      setMaterialModalOpen(true)
                      setCurrentMaterial({ id: 0, title: "", content: "" })
                      setMaterialTitle("")
                      setMaterialContents([])
                      setCurrentBlockId(module.id)
                    }}
                    className="text-[#5c8d89] border-[#5c8d89]"
                  >
                    Add Cards
                  </Button>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      setBlockModalOpen(true)
                      setCurrentBlock(module)
                      setBlockName(module.title ?? "")
                      setBlockDescription(module.description ?? "")
                    }}
                    className="text-[#5c8d89] border-[#5c8d89]"
                  >
                    Edit Module
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteBlock(module.id)
                    }}
                    className="bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    Delete Module
                  </Button>
                </div>

                <div className="space-y-4">
                  {materials
                    .filter((material) => material.block_id == module.id)
                    .map((material) => (
                      <div key={material.id} className="border border-[#e6e1d5] rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">{material.title}</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentMaterial(material)
                                setCurrentBlockId(module.id)
                                setMaterialModalOpen(true)
                              }}
                              className="text-[#5c8d89] border-[#5c8d89]"
                            >
                              Edit Cards
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteMaterialItem(material.id)}
                              className="bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              Delete Cards
                            </Button>
                          </div>
                        </div>

                        <hr className="border-[#e6e1d5] my-3" />

                        {material.flashcards && material.flashcards.length > 0 && (
                          <ul className="space-y-3 my-3">
                            {material.flashcards.map((flashcard) => (
                              <li key={flashcard.id} className="flex items-center justify-between">
                                <span>- {flashcard.front}</span>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      openEditModal("card", flashcard)
                                    }}
                                    className="text-[#5c8d89] border-[#5c8d89]"
                                  >
                                    Edit Card
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      deleteFlashcard(flashcard.id)
                                    }}
                                    className="bg-red-100 text-red-600 hover:bg-red-200"
                                  >
                                    Delete Card
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        <Button className="mt-3 bg-[#5c8d89] text-white hover:bg-[#4a7a76]">Add New Card</Button>
                      </div>
                    ))}

                  {tests
                    .filter((test) => test.block_id === module.id)
                    .map((test) => (
                      <div key={test.id} className="border border-[#e6e1d5] rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">{test.question}</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentTest(test)
                                setCurrentBlockId(module.id)
                                setTestModalOpen(true)
                              }}
                              className="text-[#5c8d89] border-[#5c8d89]"
                            >
                              Edit Test
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteTestItem(test.id)}
                              className="bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              Delete Test
                            </Button>
                          </div>
                        </div>

                        <hr className="border-[#e6e1d5] my-3" />

                        {test.TestQuestions && test.TestQuestions.length > 0 && (
                          <ul className="space-y-3 my-3">
                            {test.TestQuestions.map((question) => (
                              <li key={question.id} className="flex items-center justify-between">
                                <span>- {question.question}</span>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      openEditModal("question", question)
                                    }}
                                    className="text-[#5c8d89] border-[#5c8d89]"
                                  >
                                    Edit Question
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      deleteQuestion(question.id)
                                    }}
                                    className="bg-red-100 text-red-600 hover:bg-red-200"
                                  >
                                    Delete Question
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        <Button className="mt-3 bg-[#5c8d89] text-white hover:bg-[#4a7a76]">Add New Question</Button>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={() => {
                setBlockModalOpen(true)
                setCurrentBlock(null)
                setBlockName("")
              }}
              variant="outline"
              className="text-[#5c8d89] border-[#5c8d89] mb-6"
            >
              Add New Module
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5c8d89] text-white hover:bg-[#4a7a76] py-6 rounded-lg text-lg font-medium"
          >
            Update Course
          </Button>
        </form>
      </div>

      <MaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        onSave={(materialTitle: string, materialContents: CardDefinitions[]) =>
          handleSaveMaterial(currentBlockId, { title: materialTitle }, materialContents)
        }
        materialTitle={materialTitle}
        setMaterialTitle={setMaterialTitle}
        currentMaterial={currentMaterial}
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
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        type={editType}
        initialData={editData || null}
      />

      <BlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onSave={
          currentBlock ? () => handleUpdateBlock(currentBlock.id, blockName, blockDescription) : () => handleSaveBlock()
        }
        blockName={blockName}
        setBlockName={setBlockName}
        blockDescription={blockDescription}
        setBlockDescription={setBlockDescription}
        currentBlock={currentBlock}
      />
    </div>
  )
}