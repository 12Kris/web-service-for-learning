"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createCourseWithAI } from "@/lib/courses/ai-actions";


export default function CreateCourseAIForm() {
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coursesAmount, setCoursesAmount] = useState<number>(1);
  const [difficultyLevel, setDifficultyLevel] = useState<string>("");
  const [testsAmount, setTestsAmount] = useState<number>(3);
  const [learningMaterialsAmount, setLearningMaterialsAmount] = useState<number>(3);
  const [pdfFile, setPdfFile] = useState<File | undefined>(undefined);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) {
      setError("Please enter a course topic");
      return;
    }

    try {
      setIsLoading(true);
      const result = await createCourseWithAI(
        prompt,
        coursesAmount,
        difficultyLevel,
        testsAmount,
        learningMaterialsAmount,
        pdfFile
      );

      if (result.success && result.courseId) {
        router.push(`/workspace/courses/${result.courseId}`);
      } else {
        setError(result.message || "Failed to create course");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Course with AI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 mb-0">
            <label className="block text-sm font-medium">
              Describe the course you want to create
            </label>
            <Textarea
              placeholder="Enter a topic or description for your course (e.g., 'Introduction to JavaScript', 'Basic Photography Techniques', 'Web Development for Beginners')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="coursesAmount" className="block text-sm font-medium">
                  Courses Amount
                </label>
                <input
                  id="coursesAmount"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={coursesAmount}
                  onChange={(e) => setCoursesAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="difficultyLevel" className="block text-sm font-medium">
                  Difficulty Level
                </label>
                <select
                  id="difficultyLevel"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  disabled={isLoading}
                >
                  <option value="">Select difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="testsAmount" className="block text-sm font-medium">
                  Tests Amount Per Module
                </label>
                <input
                  id="testsAmount"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={testsAmount}
                  onChange={(e) => setTestsAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="learningMaterialsAmount" className="block text-sm font-medium">
                  Learning Materials Amount Per Module
                </label>
                <input
                  id="learningMaterialsAmount"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={learningMaterialsAmount}
                  onChange={(e) => setLearningMaterialsAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The AI will generate a complete course structure including modules, learning outcomes, and course details.
            </p>
          </div>

          {/* NEW: PDF upload */}
          <div>
            <label htmlFor="pdfFile" className="block text-sm font-medium">
              Upload PDF to augment prompt
            </label>
            <input
              id="pdfFile"
              type="file"
              accept="application/pdf"
              disabled={isLoading}


              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > 1048576) {
                  setError("PDF file size should not exceed 1 MB");
                  setPdfFile(undefined);
                } else {
                  setError(null);
                  setPdfFile(file);
                }
              }}
              className="mt-1"
              // onChange={(e) =>
              //   setPdfFile(e.target.files?.[0] ?? undefined)
              // }
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}

          <CardFooter className="px-0 mb-0 pb-0 flex flex-col gap-4">
    
              <Button type="submit" className="w-full mb-0 " disabled={isLoading}>
                {isLoading ? "Generation in progress..." : "Generate Course"}
              </Button>
         
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}