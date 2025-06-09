"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCourse } from "@/lib/courses/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import type { CourseDetails, WhatWillLearn } from "@/lib/types/course"
import type { Module } from "@/lib/types/modules"
import { ChevronLeft } from "lucide-react"

type FormState = {
  name: string
  description: string
  type: string
  course_details: CourseDetails[]
  curriculum: Module[]
  what_w_learn: WhatWillLearn[]
}

const initialFormState: FormState = {
  name: "",
  description: "",
  type: "",
  course_details: [{ id: 1, course_detail: "" }],
  curriculum: [
    {
      id: 1,
      title: "",
      description: "",
      duration: "",
      lessons: [],
      isActive: false,
      isCompleted: false,
      progress: 0,
    },
  ],
  what_w_learn: [{ id: 1, description: "" }],
}

export default function CreateCourseForm() {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    try {
      const newCourse = await createCourse(formState)
      if (newCourse) {
        router.push(`/workspace/courses/${newCourse.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const updateFormState = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const addItem = <K extends "course_details" | "curriculum" | "what_w_learn">(key: K) => {
    setFormState((prev) => ({
      ...prev,
      [key]: [
        ...prev[key],
        {
          id: prev[key].length + 1,
          ...(key === "curriculum"
            ? { title: "", description: "", duration: "", lessons: [], isActive: false, isCompleted: false, progress: 0 }
            : key === "course_details"
            ? { course_detail: "" }
            : { description: "" }),
        },
      ],
    }))
  }

  const deleteItem = <K extends "course_details" | "curriculum" | "what_w_learn">(key: K, id: number) => {
    setFormState((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item.id !== id),
    }))
  }

  const updateItem = <K extends "course_details" | "curriculum" | "what_w_learn", F extends keyof FormState[K][number]>(
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Link href={`/workspace`}>
          <Button className="mb-2">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium text-[#5c8d89] mb-6">Create New Course</h2>

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
                  placeholder="Enter course name"
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-[#5c8d89] font-medium">
                  Course Type
                </Label>
                <Input
                  id="type"
                  type="text"
                  value={formState.type}
                  onChange={(e) => updateFormState("type", e.target.value)}
                  className="border-[#e6e1d5] bg-white"
                  placeholder="Enter course type"
                  aria-label="Course type"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-[#5c8d89] font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formState.description}
                  onChange={(e) => updateFormState("description", e.target.value)}
                  className="border-[#e6e1d5] bg-white min-h-[100px]"
                  placeholder="Enter course description"
                  aria-label="Course description"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6 w-full">
              <Label className="text-[#5c8d89] font-medium">Course Details</Label>
              {formState.course_details.map((detail, index) => (
                <div key={detail.id} className="flex gap-2 w-full items-center">
                  <Textarea
                    placeholder={`Course Detail ${detail.id}`}
                    value={detail.course_detail}
                    onChange={(e) => updateItem("course_details", index, "course_detail", e.target.value)}
                    className="border-[#e6e1d5] bg-white flex-1 w-full"
                    aria-label={`Course detail ${detail.id}`}
                  />
                  <Button
                    type="button"
                    onClick={() => deleteItem("course_details", detail.id)}
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
                className="text-[#5c8d89] border-[#5c8d89]"
                size="sm"
              >
                Add Course Detail
              </Button>
            </div>

            <div className="space-y-4 w-full">
              <Label className="text-[#5c8d89] font-medium">What Students Will Learn</Label>
              {formState.what_w_learn.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <Textarea
                    placeholder={`Learning Outcome ${item.id}`}
                    value={item.description}
                    onChange={(e) => updateItem("what_w_learn", index, "description", e.target.value)}
                    className="border-[#e6e1d5] bg-white flex-1"
                    aria-label={`Learning outcome ${item.id}`}
                    
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
                className="text-[#5c8d89] border-[#5c8d89]"
                size="sm"
              >
                Add Learning Outcome
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium text-[#5c8d89] mb-6">Course Curriculum</h2>

            {formState.curriculum.map((module, index) => (
              <div key={module.id} className="mb-6 border border-[#e6e1d5] rounded-lg p-4 bg-white">
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Label className="text-[#5c8d89] font-medium">Module Title</Label>
                      <Input
                        placeholder={`Module ${module.id} Title`}
                        value={module.title}
                        onChange={(e) => updateItem("curriculum", index, "title", e.target.value)}
                        className="border-[#e6e1d5] bg-white mt-1"
                        aria-label={`Module ${module.id} title`}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => deleteItem("curriculum", module.id)}
                      variant="destructive"
                      className="text-[--accent] bg-transparent border-2 border-[--accent] hover:text-white hover:bg-[--accent] self-end"
                      size="sm"
                      disabled={formState.curriculum.length === 1}
                    >
                      Delete
                    </Button>
                  </div>
                  <div>
                    <Label className="text-[#5c8d89] font-medium">Module Description</Label>
                    <Textarea
                      placeholder={`Module ${module.id} Description`}
                      value={module.description}
                      onChange={(e) => updateItem("curriculum", index, "description", e.target.value)}
                      className="border-[#e6e1d5] bg-white mt-1"
                      aria-label={`Module ${module.id} description`}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={() => addItem("curriculum")}
              variant="outline"
              className="text-[#5c8d89] border-[#5c8d89]"
              size="sm"
            >
              Add Module
            </Button>
          </div>

          {error && (
            <p className="text-red-500 bg-red-50 p-3 rounded-md" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full md:w-1/2 bg-[--neutral] text-white hover:bg-[#4a7a76] py-6 rounded-full text-lg font-medium flex text-center mx-auto"
            >
              Create Course
            </Button>
            <Button
              type="button"
              className="w-full md:w-1/2 bg-transparent text-[#5c8d89] hover:bg-[--neutral] border border-[#5c8d89] py-4 rounded-full text-base font-medium flex text-center mx-auto"
            >
              <Link href="create-ai" className="w-full text-center">
                Create course using AI
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
