"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/lib/courses/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { CourseDetails, Module, WhatWillLearn } from "@/lib/definitions";

// interface Module {
//   id: number;
//   title: string;
//   description: string;
// }

export default function CreateCourseForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [course_details, setCourseDetails] = useState<CourseDetails[]>([
    { id: 1, course_detail: "" },
  ]);
  const [curriculum, setcurriculum] = useState<Module[]>([
    { id: 1, title: "", description: "" },
  ]);
  const [what_w_learn, setWhatWillLearn] = useState<WhatWillLearn[]>([
    { id: 1, description: "" },
  ]
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const newCourse = await createCourse({ name, description, type, curriculum, what_w_learn, course_details });
      if (newCourse) {
        router.push(`/workspace/course/${newCourse.id}`);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const addCourseDetail = () => {
    setCourseDetails([...course_details, { id: course_details.length + 1, course_detail: "" }]);
  };

  const updateaddCourseDetail = (index: number, field: keyof CourseDetails, value: string) => {
    const updatedcoursedetail = course_details.map((detail, i) => {
      if (i === index) {
        return { ...detail, [field]: value };
      }
      return detail;
    });
    setCourseDetails(updatedcoursedetail);
  };

  const addModule = () => {
    setcurriculum([...curriculum, { id: curriculum.length + 1, title: "", description: "" }]);
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updatedcurriculum = curriculum.map((module, i) => {
      if (i === index) {
        return { ...module, [field]: value };
      }
      return module;
    });
    setcurriculum(updatedcurriculum);
  };

  const addWhatWillStudentLearn = () => {
    setWhatWillLearn([...what_w_learn, { id: what_w_learn.length + 1, description: "" }]);
  };

  const updateWhatWillLearn = (index: number, field: keyof WhatWillLearn, value: string) => {
    const updatedwhat_will_learn = what_w_learn.map((what_will_learn, i) => {
      if (i === index) {
        return { ...what_will_learn, [field]: value };
      }
      return what_will_learn;
    });
    setWhatWillLearn(updatedwhat_will_learn);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Course Type</Label>
            <Input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Course details</Label>
            {course_details.map((el, index) => (
              <div key={el.id} className="space-y-2">
                <Textarea
                  placeholder={`Module ${el.id} Description`}
                  value={el.course_detail}
                  onChange={(e) => updateaddCourseDetail(index, "course_detail", e.target.value)}
                />
              </div>
            ))}
            <Button type="button" onClick={addCourseDetail} variant="outline">
              Add
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">What student will learn</Label>
            {what_w_learn.map((lesson, index) => (
              <div key={lesson.id} className="space-y-2">
                <Textarea
                  placeholder={`Module ${lesson.id} Description`}
                  value={lesson.description}
                  onChange={(e) => updateWhatWillLearn(index, "description", e.target.value)}
                />
              </div>
            ))}
            <Button type="button" onClick={addWhatWillStudentLearn} variant="outline">
              Add
            </Button>

          </div>
         
          {/* <div className="space-y-4">
            <Label>Curriculum curriculum</Label>
            {curriculum.map((module, index) => (
              <div key={module.id} className="space-y-2">
                <Input
                  placeholder={`Module ${module.id} Title`}
                  value={module.title}
                  onChange={(e) => updateModule(index, "title", e.target.value)}
                />
                <Textarea
                  placeholder={`Module ${module.id} Description`}
                  value={module.description}
                  onChange={(e) => updateModule(index, "description", e.target.value)}
                />
              </div>
            ))}
            <Button type="button" onClick={addModule} variant="outline">
              Add
            </Button>
          </div> */}
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Create Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}