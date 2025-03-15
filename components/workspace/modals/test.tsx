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

export function TestModal({
                              isOpen,
                              onClose,
                              onSave,
                              testId,
                              blockId,
                          }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (testId: number | null, testData: {
        answers: never[];
        block_id: number | null;
        question: string;
        questions: { id: number; question: string; answers: { id: number; text: string; correct: boolean }[] }[]
    }) => void;
    testId: number | null;
    blockId: number | null;
}) {
    const [testTitle, setTestTitle] = useState<string>("");
    const [questions, setQuestions] = useState<
        {
            id: number;
            question: string;
            answers: { id: number; text: string; correct: boolean }[];
        }[]
    >([]);

    useEffect(() => {
        const fetchTest = async () => {
            const currentTest = await getTestById(testId);
            if (currentTest) {
                setTestTitle(currentTest.question || "");
                setQuestions(
                    currentTest.questions.map((q) => ({
                        ...q,
                        answers: q.answers.map((a) => ({
                            ...a,
                            id: a.id,
                            correct: Boolean(a.correct)
                        })),
                    }))
                );
            } else {
                setTestTitle("");
                setQuestions([
                    {
                        id: 1,
                        question: "",
                        answers: [
                            { id: 1, text: "", correct: false },
                            { id: 2, text: "", correct: false },
                        ],
                    },
                ]);
            }
        };

        if (isOpen) {
            fetchTest();
        }
    }, [isOpen, testId]);

    const handleQuestionChange = (id: number, text: string) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, question: text } : q))
        );
    };

    const handleAnswerChange = (questionId: number, answerId: number, text: string) => {
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

    const handleCorrectAnswerChange = (questionId: number, answerId: number) => {
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

    const handleAddAnswer = (questionId: number) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: [
                            ...q.answers,
                            { id: q.answers.length + 1, text: "", correct: false },
                        ],
                    }
                    : q
            )
        );
    };

    const handleRemoveAnswer = (questionId: number, answerId: number) => {
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
                id: prev.length + 1,
                question: "",
                answers: [
                    { id: 1, text: "", correct: false },
                    { id: 2, text: "", correct: false },
                ],
            },
        ]);
    };

    const handleRemoveQuestion = (id: number) => {
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
            onSave(testId, {answers: [], block_id: blockId, question: testTitle, questions });
            onClose();
        } else {
            alert("Please fill in all questions and answers correctly.");
        }
    };

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
                                {q.answers.sort((a, b) => a.id - b.id).map((answer) => (
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
                                                handleAnswerChange(q.id, answer.id, e.target.value)
                                            }
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
                    <AlertDialogAction onClick={handleSubmit}>
                        {questions.length > 0 ? "Save" : "Create"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
