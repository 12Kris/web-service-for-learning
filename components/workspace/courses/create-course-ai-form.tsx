"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { createCourseWithAI } from "@/lib/courses/ai-actions";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function CreateCourseAIForm() {
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      const result = await createCourseWithAI(prompt);
      
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
            <p className="text-sm text-muted-foreground">
              The AI will generate a complete course structure including modules, learning outcomes, and course details.
            </p>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}
          
          <CardFooter className="px-0 mb-0 pb-0">
            <Button 
              type="submit" 
              className="w-full mb-0 " 
              disabled={isLoading}
            >
              {isLoading ? "Generation in progress..." : "Generate Course"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
