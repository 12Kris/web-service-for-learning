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
import type { Course, CourseDetails, WhatWillLearn } from "@/lib/types/course"
import type { LearningMaterial } from "@/lib/types/learning"
import type { TestData, TestDataWithQuestion } from "@/lib/types/test"
import type { MaterialData } from "@/lib/types/learning"
import { createMaterial, deleteMaterial, updateMaterial, createTest, updateTest, deleteTest } from "@/lib/tests/actions"
import { getMaterialsByBlockId, getTestsByBlockId } from "@/lib/courses/actions"
import BlockModal from "@/components/workspace/modals/block"
import LoadingSpinner from "@/components/ui/loading-spinner"
import Modal from "@/components/workspace/modals/modal"
import { getTestById } from "@/lib/tests/actions"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

type FormState = {
  name: string | undefined
  description: string | undefined
  type: string | undefined
  course_details: CourseDetails[]
  curriculum: Module[]
  what_w_learn: WhatWillLearn[]
}

type EditData = {
  id?: number | undefined
  front?: string
  back?: string
  question?: string
  answers?: { id: number | string; text: string; correct: number | boolean }[]
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

  const openEditModal = async (type: EditType, data: EditData) => {
    setEditType(type)

    if (type === "question" && data.id) {
      setIsLoading(true)
      try {
        const test = tests?.find((test) => test.TestQuestions?.some((q) => q.id === data.id))
        if (test && test.id) {
          const testData = await getTestById(test.id)
          if (testData) {
            const questionWithAnswers = testData.questions.find((q) => q.id === Number(data.id))
            if (questionWithAnswers) {
              data = {
                ...data,
                question: questionWithAnswers.question,
                answers: questionWithAnswers.answers.map((a) => ({
                  id: a.id,
                  text: a.text,
                  correct: a.correct,
                })),
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching question answers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    setEditData(data)
    setEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedData: EditData) => {
    setIsLoading(true)
    try {
      if (editType === "question" && editData?.id) {
        await updateQuestion(editData.id, updatedData.question || "")
        if (updatedData.answers && updatedData.answers.length > 0) {
          const test = tests?.find((test) => test.TestQuestions?.some((q) => q.id === editData.id))
          if (test) {
            const testData = await getTestById(test.id)
            if (testData) {
              const updatedTestData: TestDataWithQuestion = {
                block_id: test.block_id,
                question: test.question,
                questions: testData.questions.map((q) => {
                  if (q.id === Number(editData.id)) {
                    return {
                      id: q.id,
                      question: updatedData.question || q.question,
                      answers:
                        updatedData.answers?.map((a) => ({
                          id: a.id.toString(),
                          text: a.text,
                          correct: a.correct,
                        })) || [],
                    }
                  }
                  return {
                    id: q.id,
                    question: q.question,
                    answers: q.answers.map((a) => ({
                      id: a.id.toString(),
                      text: a.text,
                      correct: a.correct,
                    })),
                  }
                }),
                answers: [],
              }
              await updateTest(test.id, updatedTestData)
            }
          }
        }
      } else if (editData?.id) {
        await updateFlashcard(editData.id, updatedData.front || "", updatedData.back || "")
      }
      await fetchBlockData()
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

  const deleteItem = <K extends "course_details" | "what_w_learn">(key: K, id: number) => {
    setFormState((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item.id !== id),
    }))
  }

  return (
    <div className="bg-[--background] min-h-screen p-6 w-full">
      <div className="max-w-4xl mx-auto">
        <Link href={`/workspace/courses/${course.id}`}>
          <Button className="mb-2">
              <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-[--background] rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-medium text-[--neutral] mb-6">Edit Course Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[--neutral] font-medium">
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-[--neutral] font-medium">
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
            </div>

            <div className="space-y-3 mb-3">
              <Label className="text-[--neutral] font-medium">Course Details</Label>
              {formState.course_details.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start md:items-center gap-2 mb-2">
                  <Textarea
                    placeholder="Example"
                    value={item.course_detail}
                    onChange={(e) => updateItem("course_details", index, "course_detail", e.target.value)}
                    className="border-[#e6e1d5] bg-white"
                  />
                  <Button
                    type="button"
                    onClick={() => deleteItem("course_details", item.id)}
                    variant="destructive"
                    className="text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]"
                    size="sm"
                    disabled={formState.course_details.length === 1}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addItem("course_details")}
                variant="outline"
                className="text-[--neutral] border-[--neutral]"
                size="sm"
              >
                Add Course Detail
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-[--neutral] font-medium">What Students Will Learn</Label>
              {formState.what_w_learn.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start md:items-center gap-2 mb-2">
                  <Textarea
                    placeholder="Example"
                    value={item.description}
                    onChange={(e) => updateItem("what_w_learn", index, "description", e.target.value)}
                    className="border-[#e6e1d5] bg-white"
                  />
                  <Button
                    type="button"
                    onClick={() => deleteItem("what_w_learn", item.id)}
                    variant="destructive"
                    className="text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]"
                    size="sm"
                    disabled={formState.what_w_learn.length === 1}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addItem("what_w_learn")}
                variant="outline"
                className="text-[--neutral] border-[--neutral]"
                size="sm"
              >
                Add Learning Outcome
              </Button>
            </div>
          </div>

          <div className="bg-[--background] rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-medium text-[--neutral] mb-6">Edit Course Curriculum</h2>

            {formState.curriculum.map((module) => (
              <div key={module.id} className="mb-6 border border-[#e6e1d5] rounded-lg p-4">
                <div className="space-y-4 mb-4">
                  <div>
                    <Label className="text-[--neutral] font-medium">Module Name</Label>
                    <Input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleUpdateBlock(module.id, e.target.value, module.description)}
                      className="border-[#e6e1d5] bg-white"
                      placeholder="Example"
                    />
                  </div>
                  <div>
                    <Label className="text-[--neutral] font-medium">Module Description</Label>
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
                    className="text-[--neutral] border-[--neutral]"
                    size="sm"
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
                    className="text-[--neutral] border-[--neutral]"
                    size="sm"
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
                    className="text-[--neutral] border-[--neutral]"
                    size="sm"
                  >
                    Edit Module
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteBlock(module.id)
                    }}
                    className="text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]"
                    size="sm"
                  >
                    Delete Module
                  </Button>
                </div>

                <div className="space-y-4">
                  {materials
                    .filter((material) => material.block_id == module.id)
                    .map((material) => (
                      <div key={material.id} className="border border-[#e6e1d5] rounded-lg p-4 bg-white">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-4">
                          <h3 className="font-medium">{material.title}</h3>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentMaterial(material)
                                setCurrentBlockId(module.id)
                                setMaterialModalOpen(true)
                              }}
                              className="text-[--neutral] border-[--neutral]"
                            >
                              Edit Cards
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteMaterialItem(material.id)}
                              className="text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]"
                            >
                              Delete Cards
                            </Button>
                          </div>
                        </div>

                        <hr className="border-[#e6e1d5] my-3" />

                        {material.flashcards && material.flashcards.length > 0 && (
                          <ul className="space-y-3 my-3">
                            {material.flashcards.map((flashcard) => (
                              <li key={flashcard.id} className="flex flex-col sm:flex-row items-start justify-between gap-2">
                                <span>- {flashcard.front}</span>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      openEditModal("card", flashcard)
                                    }}
                                    className="text-[--neutral] border-[--neutral]"
                                  >
                                    Edit Card
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      deleteFlashcard(flashcard.id)
                                      fetchBlockData()
                                    }}
                                    className="text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]"
                                  >
                                    Delete Card
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        <Button
                          className="mt-3 bg-[--neutral] text-white hover:bg-[#4a7a76]"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentMaterial({
                              id: material.id,
                              title: material.title,
                              content: material.content || "",
                              block_id: material.block_id,
                              is_completed: material.is_completed,
                            })
                            setMaterialTitle(material.title)
                            setMaterialContents([{ front: "", back: "" }])
                            setCurrentBlockId(module.id)
                            setMaterialModalOpen(true)
                          }}
                        >
                          Add New Card
                        </Button>
                      </div>
                    ))}

                  {tests
                    .filter((test) => test.block_id === module.id)
                    .map((test) => (
                      <div key={test.id} className="border border-[#e6e1d5] rounded-lg p-4 bg-white">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-4">
                          <h3 className="font-medium">{test.question}</h3>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentTest(test)
                                setCurrentBlockId(module.id)
                                setTestModalOpen(true)
                              }}
                              className="text-[--neutral] border-[--neutral]"
                            >
                              Edit Test
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                deleteTestItem(test.id); 
                                
                              }}
                              className="text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]"
                            >
                              Delete Test
                            </Button>
                          </div>
                        </div>

                        <hr className="border-[#e6e1d5] my-3" />

                        {test.TestQuestions && test.TestQuestions.length > 0 && (
                          <ul className="space-y-3 my-3">
                            {test.TestQuestions.map((question) => (
                              <li key={question.id} className="flex flex-col sm:flex-row items-start justify-between gap-2">
                                <span>- {question.question}</span>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      openEditModal("question", question)
                                    }}
                                    className="text-[--neutral] border-[--neutral]"
                                  >
                                    Edit Question
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      deleteQuestion(question.id)
                                      fetchBlockData()
                                    }}
                                    className="text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent]"
                                  >
                                    Delete Question
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        <Button
                          className="mt-3 bg-[--neutral] text-white hover:bg-[#4a7a76]"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            const emptyTestData = {
                              ...test,
                              questions: [
                                {
                                  id: "new",
                                  question: "",
                                  answers: [
                                    { id: "1", text: "", correct: false },
                                    { id: "2", text: "", correct: false },
                                  ],
                                },
                              ],
                            }
                            setCurrentTest(emptyTestData)
                            setCurrentBlockId(module.id)
                            setTestModalOpen(true)
                          }}
                        >
                          Add New Question
                        </Button>
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
              className="text-[--neutral] border-[--neutral] mb-6"
              size="sm"
            >
              Add New Module
            </Button>
          </div>

          <Button
            type="submit"
            className="w-1/2 bg-[--neutral] text-white hover:bg-[#4a7a76] py-6 rounded-full text-lg font-medium flex text-center mx-auto"
            size="sm"
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
        testId={currentTest?.id || 0}
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