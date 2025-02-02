// TODO: make logic crud material and test, type
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  type Course,
  CourseDetails,
  Module,
  WhatWillLearn,
  Material,
  Test,
} from "@/lib/definitions";

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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateCourse(course.id, formState, course.creator_id);
      router.push(`/workspace/course/${course.id}`);
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

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
                    type="text"
                    value={module.name}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        curriculum: prev.curriculum.map((m) =>
                          m.id === module.id ? { ...m, name: e.target.value } : m
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Module Description</Label>
                  <Textarea
                    value={module.description}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        curriculum: prev.curriculum.map((m) =>
                          m.id === module.id ? { ...m, description: e.target.value } : m
                        ),
                      }))
                    }
                  />
                </div>

                {module.materials && module.materials.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Materials</Label>
                    <ul className="list-disc list-inside">
                      {module.materials.map((material: Material) => (
                        <li key={material.id}>{material.title}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {module.tests && module.tests.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Tests</Label>
                    <ul className="list-disc list-inside">
                      {module.tests.map((test: Test) => (
                        <li key={test.id}>{test.question}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full">
            Update Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}