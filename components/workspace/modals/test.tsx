import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getTestById } from "@/lib/tests/actions";
import { Button } from "@/components/ui/button";
import { TestDataWithQuestion } from "@/lib/types/test";

export function TestModal({
  isOpen,
  onClose,
  onSave,
  testId,
  blockId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (testId: number, testData: TestDataWithQuestion) => void;
  testId: number;
  blockId: number;
}) {
  const [testTitle, setTestTitle] = useState<string>("");
  const [initialQuestions, setInitialQuestions] = useState<
    { id: number; question: string; answers: { id: number; text: string; correct: boolean }[] }[]
  >([]);
  const [newQuestions, setNewQuestions] = useState<
    { id: number; question: string; answers: { id: number; text: string; correct: boolean }[] }[]
  >([]);

  useEffect(() => {
    const fetchTest = async () => {
      const currentTest = await getTestById(testId || 0);
      if (currentTest) {
        setTestTitle(currentTest.question || "");
        setInitialQuestions(currentTest.questions || []);
        setNewQuestions([]);
      } else {
        setTestTitle("");
        setInitialQuestions([]);
        setNewQuestions([]);
      }
    };

    if (isOpen) {
      fetchTest();
    }
  }, [isOpen, testId]);

  const handleQuestionChange = (id: number, text: string) => {
    setNewQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: text } : q))
    );
  };

  const handleAnswerChange = (questionId: number, answerId: number, text: string) => {
    setNewQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, text } : a
              ),
            }
          : q
      )
    );
  };

  const handleCorrectAnswerChange = (questionId: number, answerId: number) => {
    setNewQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) => ({
                ...a,
                correct: a.id === answerId,
              })),
            }
          : q
      )
    );
  };

  const handleAddAnswer = (questionId: number) => {
    setNewQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [
                ...q.answers,
                {
                  id: Math.max(...q.answers.map((a) => a.id), 0) + 1,
                  text: "",
                  correct: false,
                },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveAnswer = (questionId: number, answerId: number) => {
    setNewQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.filter((a) => a.id !== answerId),
            }
          : q
      )
    );
  };

  const handleAddQuestion = () => {
    setNewQuestions((prev) => [
      ...prev,
      {
        id: Math.max(...prev.map((q) => q.id), 0) + 1,
        question: "",
        answers: [
          { id: 1, text: "", correct: false },
          { id: 2, text: "", correct: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (id: number) => {
    setNewQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSubmit = () => {
    if (!testTitle.trim()) {
      alert("Please provide a test title.");
      return;
    }

    const allQuestions = [...initialQuestions, ...newQuestions];
    const isValid = allQuestions.every(
      (q) =>
        q.question.trim() &&
        q.answers.every((a) => a.text.trim()) &&
        q.answers.some((a) => a.correct)
    );

    if (isValid) {
      onSave(testId, { block_id: blockId, question: testTitle, questions: allQuestions });
      onClose();
    } else {
      alert(
        "Please fill in all questions and answers correctly, including selecting at least one correct answer."
      );
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialQuestions.length > 0 || newQuestions.length > 0 ? "Edit Test" : "Create Test"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {initialQuestions.length > 0 || newQuestions.length > 0
              ? "Edit the test questions and answers"
              : "Create a new test with multiple questions"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium">Test Title:</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="Enter the test title"
              className="input ml-2 p-2 border border-2 border-input rounded-lg bg-[--card]"
            />
          </div>
          {newQuestions.map((q) => (
            <div key={q.id} className="border p-4">
              <div>
                <label className="font-medium">Question:</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  placeholder="Enter the question"
                  className="input ml-2 p-2 border border-2 border-input rounded-lg bg-[--card]"
                />
              </div>
              <div>
                <label>Answers</label>
                {q.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center gap-2 m-1">
                    <input
                      type="radio"
                      name={`correctAnswer-${q.id}`}
                      checked={answer.correct}
                      onChange={() => handleCorrectAnswerChange(q.id, answer.id)}
                    />
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(q.id, answer.id, e.target.value)}
                      placeholder="Enter the answer"
                      className="input p-2 border w-full border-2 border-input rounded-lg bg-[--card]"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveAnswer(q.id, answer.id)}
                      className="h-full"
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => handleAddAnswer(q.id)}
                  variant="outline"
                  className="flex items-center justify-center mt-5 mx-auto"
                >
                  Add Answer
                </Button>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveQuestion(q.id)}
                className="mt-3 float-right"
              >
                Remove Question
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddQuestion}
            className="btn btn-success"
          >
            Add Question
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {initialQuestions.length > 0 || newQuestions.length > 0 ? "Save" : "Create"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}