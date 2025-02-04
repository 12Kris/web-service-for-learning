"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { CourseDetails, Module, WhatWillLearn } from "@/lib/definitions";

type FormState = {
  name: string;
  description: string;
  type: string;
  course_details: CourseDetails[];
  curriculum: Module[];
  what_w_learn: WhatWillLearn[];
};

const initialFormState: FormState = {
  name: "",
  description: "",
  type: "",
  course_details: [{ id: 1, course_detail: "" }],
  curriculum: [{ id: 1, title: "", description: "" }],
  what_w_learn: [{ id: 1, description: "" }],
};

export default function CreateCourseForm() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const newCourse = await createCourse(formState);
      if (newCourse) {
        router.push(`/workspace/course/${newCourse.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateFormState = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = <K extends "course_details" | "curriculum" | "what_w_learn">(
    key: K,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: [
        ...prev[key],
        {
          id: prev[key].length + 1,
          ...(key === "curriculum"
            ? { title: "", description: "" }
            : { description: "" }),
        },
      ],
    }));
  };

  const updateItem = <
    K extends "course_details" | "curriculum" | "what_w_learn",
    F extends keyof FormState[K][number],
  >(
    key: K,
    index: number,
    field: F,
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                      e.target.value,
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
                      e.target.value,
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
          <fieldset className="space-y-4">
            <legend className="text-sm font-medium">Curriculum</legend>
            {formState.curriculum.map((module, index) => (
              <div key={module.id} className="space-y-2">
                <Input
                  placeholder={`Module ${module.id} Title`}
                  value={module.title}
                  onChange={(e) =>
                    updateItem("curriculum", index, "title", e.target.value)
                  }
                  aria-label={`Module ${module.id} title`}
                />
                <Textarea
                  placeholder={`Module ${module.id} Description`}
                  value={module.description}
                  onChange={(e) =>
                    updateItem(
                      "curriculum",
                      index,
                      "description",
                      e.target.value,
                    )
                  }
                  aria-label={`Module ${module.id} description`}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addItem("curriculum")}
              variant="outline"
            >
              Add Module
            </Button>
          </fieldset>
          {error && (
            <p className="text-red-500" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            Create Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
