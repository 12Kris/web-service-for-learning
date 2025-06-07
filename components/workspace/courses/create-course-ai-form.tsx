"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload } from "lucide-react"
import { createCourseWithAI } from "@/lib/courses/ai-actions"

export default function CreateCourseAIForm() {
  const [prompt, setPrompt] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [coursesAmount, setCoursesAmount] = useState<number>(1)
  const [difficultyLevel, setDifficultyLevel] = useState<string>("")
  const [testsAmount, setTestsAmount] = useState<number>(3)
  const [learningMaterialsAmount, setLearningMaterialsAmount] = useState<number>(3)
  const [pdfFile, setPdfFile] = useState<File | undefined>(undefined)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!prompt.trim()) {
      setError("Please enter a course topic")
      return
    }

    try {
      setIsLoading(true)
      const result = await createCourseWithAI(
        prompt,
        coursesAmount,
        difficultyLevel,
        testsAmount,
        learningMaterialsAmount,
        pdfFile,
      )

      if (result.success && result.courseId) {
        router.push(`/workspace/courses/${result.courseId}`)
      } else {
        setError(result.message || "Failed to create course")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Generate Course with AI</CardTitle>
        <CardDescription>Describe your course and customize generation settings</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-base font-medium">
              Course Description
            </Label>
            <Textarea
              id="prompt"
              placeholder="Enter a topic or description for your course (e.g., 'Introduction to JavaScript', 'Basic Photography Techniques')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="resize-none"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Be specific about the learning objectives and target audience
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-medium">Course Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coursesAmount">Modules Amount</Label>
                <Input
                  id="coursesAmount"
                  type="number"
                  min="1"
                  max="5"
                  value={coursesAmount}
                  onChange={(e) => setCoursesAmount(Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <Select value={difficultyLevel} onValueChange={setDifficultyLevel} disabled={isLoading}>
                  <SelectTrigger id="difficultyLevel">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testsAmount">Tests Per Module</Label>
                <Input
                  id="testsAmount"
                  type="number"
                  min="1"
                  max="10"
                  value={testsAmount}
                  onChange={(e) => setTestsAmount(Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningMaterialsAmount">Learning Materials Per Module</Label>
                <Input
                  id="learningMaterialsAmount"
                  type="number"
                  min="1"
                  max="10"
                  value={learningMaterialsAmount}
                  onChange={(e) => setLearningMaterialsAmount(Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdfFile" className="text-base font-medium">
              Supplementary Materials
            </Label>
            <div className="border border-input rounded-lg p-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Input
                    id="pdfFile"
                    type="file"
                    accept="application/pdf"
                    disabled={isLoading}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && file.size > 1048576) {
                        setError("PDF file size should not exceed 1 MB")
                        setPdfFile(undefined)
                      } else {
                        setError(null)
                        setPdfFile(file)
                      }
                    }}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Upload a PDF (max 1MB) to enhance your course generation with additional context
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-end border-t p-6">
          <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isLoading}>
            {isLoading ? "Generating Course..." : "Generate Course"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
