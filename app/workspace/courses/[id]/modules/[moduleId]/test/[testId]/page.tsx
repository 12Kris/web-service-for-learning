"use client";

import React, { useEffect, useState } from "react";
import { getTestQuestions } from "@/lib/courses/actions";
import { saveTestResults } from "@/lib/results/actions";
import { TestQuestion, UserTestAnswer } from "@/lib/types/test";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { completeTest } from "@/lib/tests/actions";

export default function TestPage() {
  const params = useParams();
  const testId = Number(params.testId);
  const courseId = params.id;
  const moduleId = params.moduleId;

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<UserTestAnswer[]>([]);
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      const data: TestQuestion[] = await getTestQuestions(testId);
      setQuestions(data);
      setStartTime(Date.now());
    }

    fetchQuestions();
  }, [testId]);

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswerObj = currentQuestion.answers.find(
      (a) => a.id === selectedAnswer
    );
    const isCorrect =
      selectedAnswer ===
      (typeof currentQuestion.correct_answer === "object"
        ? currentQuestion.correct_answer.id
        : currentQuestion.correct_answer);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [
      ...prev,
      {
        question: { id: currentQuestion.id, title: currentQuestion.question },
        answer: selectedAnswerObj
          ? { id: selectedAnswerObj.id, title: selectedAnswerObj.answer }
          : {
              id: 0,
              title: "",
            },
        isCorrect,
      },
    ]);

    if (currentQuestionIndex + 1 === questions.length) {
      setIsTestComplete(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handleSaveResults = async () => {
    try {
      if (!startTime) return;
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000);
      const result = await saveTestResults(testId, answers, duration);

      if ((result.percentCorrect ?? 0) >= 0.75) {
        await completeTest(testId);
      } else {
        alert(
          `Test NOT completed – only ${(
            (result.percentCorrect ?? 0) * 100
          ).toFixed(1)} % correct`
        );
      }

      if (result) {
        window.location.href = `/workspace/courses/${courseId}/modules/${moduleId}`;
      }
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  if (isTestComplete) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Test Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xl">
                Your Score: {score}/{questions.length}
              </p>
            </div>
            <Progress
              value={(score / questions.length) * 100}
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button className="w-full max-w-md" onClick={handleSaveResults}>
            Save Results
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8 shadow-custom relative">
      <CardHeader className="text-center">
        <CardTitle>Knowledge Test</CardTitle>
        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          className="mt-4"
        />
      </CardHeader>
      {questions.length > 0 ? (
        <CardContent>
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground text-center">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <h3 className="text-xl font-semibold text-center">
              {questions[currentQuestionIndex].question}
            </h3>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              className="grid grid-cols-2 gap-4"
            >
              {questions[currentQuestionIndex].answers.map((answer) => (
                <Button
                  key={answer.id}
                  onClick={() => setSelectedAnswer(answer.id)}
                  className={`flex items-center justify-center rounded-lg border p-4 cursor-pointer h-full ${
                    selectedAnswer === answer.id
                      ? "bg-[--neutral] text-white"
                      : ""
                  }`}
                >
                  <Label className="cursor-pointer w-full whitespace-normal break-words">
                    {answer.answer}
                  </Label>
                </Button>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      ) : (
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Loading questions...</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="w-full max-w-xs"
        >
          Next question
        </Button>
      </CardFooter>
    </Card>
  );
}
