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
import {TestDataWithQuestion} from "@/lib/definitions";

export function TestModal({
    isOpen,
    onClose,
    onSave,
    testId,
    blockId,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (testId: number | null, testData: TestDataWithQuestion) => void;
    testId: number | null;
    blockId: number | null;
}) {
    const [testTitle, setTestTitle] = useState<string>("");
    const [questions, setQuestions] = useState<
        {
            id: string;
            question: string;
            answers: { id: string; text: string; correct: boolean }[];
        }[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTest = async () => {
            setIsLoading(true);
            const currentTest = await getTestById(testId);
            if (currentTest) {
                setTestTitle(currentTest.question || "");
                setQuestions(currentTest.questions || []);
            } else {
                setTestTitle("");
                setQuestions([
                    {
                        id: "1",
                        question: "",
                        answers: [
                            { id: "1", text: "", correct: false },
                            { id: "2", text: "", correct: false },
                        ],
                    },
                ]);
            }
            setIsLoading(false);
        };

        if (isOpen) {
            fetchTest();
        }
    }, [isOpen, testId]);

    const handleQuestionChange = (id: string, text: string) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, question: text } : q))
        );
    };

    const handleAnswerChange = (questionId: string, answerId: string, text: string) => {
        setQuestions((prev) =>
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

    const handleCorrectAnswerChange = (questionId: string, answerId: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: q.answers.map((a) =>
                            a.id === answerId
                                ? { ...a, correct: true }
                                : { ...a, correct: false }
                        ),
                    }
                    : q
            )
        );
    };

    const handleAddAnswer = (questionId: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: [
                            ...q.answers,
                            { id: (q.answers.length + 1).toString(), text: "", correct: false },
                        ],
                    }
                    : q
            )
        );
    };

    const handleRemoveAnswer = (questionId: string, answerId: string) => {
        setQuestions((prev) =>
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
        setQuestions((prev) => [
            ...prev,
            {
                id: (prev.length + 1).toString(),
                question: "",
                answers: [
                    { id: "1", text: "", correct: false },
                    { id: "2", text: "", correct: false },
                ],
            },
        ]);
    };

    const handleRemoveQuestion = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const handleSubmit = () => {
        if (!testTitle.trim()) {
          alert("Please provide a test title.");
          return;
        }

        if (
          questions.every(
            (q) =>
              q.question &&
              q.answers.every((a) => a.text) &&
              q.answers.some((a) => a.correct)
          )
        ) {
          onSave(testId, { block_id: blockId, question: testTitle, questions });
          onClose();
        } else {
          alert("Please fill in all questions and answers correctly.");
        }
      };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogTrigger />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {questions.length > 0 ? "Edit Test" : "Create Test"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {questions.length > 0
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
                    {questions.map((q) => (
                        <div key={q.id} className="border p-4">
                            <div>
                                <label className="font-medium">Question:</label>
                                <input
                                    type="text"
                                    value={q.question}
                                    onChange={(e) =>
                                        handleQuestionChange(q.id, e.target.value)
                                    }
                                    placeholder="Enter the question"
                                    className="input ml-2 p-2 border border-2 border-input rounded-lg bg-[--card]"
                                />
                            </div>
                            <div>
                                <label>Answers</label>
                                {q.answers.map((answer) => (
                                    <div
                                        key={answer.id}
                                        className="flex items-center gap-2 m-1"
                                    >
                                        <input
                                            type="radio"
                                            name={`correctAnswer-${q.id}`}
                                            checked={answer.correct}
                                            onChange={() =>
                                                handleCorrectAnswerChange(q.id, answer.id)
                                            }
                                        />
                                        <input
                                            type="text"
                                            value={answer.text}
                                            onChange={(e) =>
                                                handleAnswerChange(
                                                    q.id,
                                                    answer.id,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter the answer"
                                            className="input p-2 border w-full border-2 border-input rounded-lg bg-[--card]"
                                        />
                                        {/* <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveAnswer(q.id, answer.id)
                                            }
                                            className="btn btn-danger"
                                        >
                                            -
                                        </button> */}

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
                                {/* <button
                                    type="button"
                                    onClick={() => handleAddAnswer(q.id)}
                                    className="btn btn-primary mt-2"
                                >
                                    Add Answer
                                </button> */}

                                <Button
                                    type="button"
                                    onClick={() => handleAddAnswer(q.id)}
                                    variant="outline"
                                    className="flex items-center justify-center mt-5 mx-auto"
                                    >
                                    Add Answer
                                </Button>
                            </div>
                            {/* <button
                                type="button"
                                onClick={() => handleRemoveQuestion(q.id)}
                                className="btn btn-danger mt-2"
                            >
                                Remove Question
                            </button> */}

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
                    {/* <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="btn btn-primary"
                    >
                        Add Question
                    </button> */}

                    <Button
                        type="button"
                        onClick={handleAddQuestion}
                        // variant="success"
                        className="btn btn-success"
                        >
                        Add Question
                    </Button>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>
                        {questions.length > 0 ? "Save" : "Create"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}