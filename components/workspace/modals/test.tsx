import {useEffect, useState} from "react";
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
import {getTestById} from "@/lib/tests/actions";

export function TestModal({
                              isOpen,
                              onClose,
                              onSave,
                              testId,
                              blockId,
                          }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (testData: any) => void;
    testId: number;
    blockId: number | null;
}) {
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
            if (currentTest?.questions) {
                setQuestions(currentTest.questions);
            } else {
                setQuestions([
                    {
                        id: "1",
                        question: "",
                        answers: [
                            {id: "1", text: "", correct: false},
                            {id: "2", text: "", correct: false},
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
            prev.map((q) => (q.id === id ? {...q, question: text} : q))
        );
    };

    const handleAnswerChange = (questionId: string, answerId: string, text: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        answers: q.answers.map((a) =>
                            a.id === answerId ? {...a, text} : a
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
                                ? {...a, correct: true}
                                : {...a, correct: false}
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
                            {id: (q.answers.length + 1).toString(), text: "", correct: false},
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
                    {id: "1", text: "", correct: false},
                    {id: "2", text: "", correct: false},
                ],
            },
        ]);
    };

    const handleRemoveQuestion = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const handleSubmit = () => {
        if (
            questions.every(
                (q) =>
                    q.question &&
                    q.answers.every((a) => a.text) &&
                    q.answers.some((a) => a.correct)
            )
        ) {
            onSave({block_id: blockId, questions});
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
            <AlertDialogTrigger/>
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
                    {questions.map((q) => (
                        <div key={q.id} className="border p-4">
                            <div>
                                <label className="font-medium">Question</label>
                                <input
                                    type="text"
                                    value={q.question}
                                    onChange={(e) =>
                                        handleQuestionChange(q.id, e.target.value)
                                    }
                                    placeholder="Enter the question"
                                    className="input"
                                />
                            </div>
                            <div>
                                <label>Answers</label>
                                {q.answers.map((answer) => (
                                    <div
                                        key={answer.id}
                                        className="flex items-center gap-2"
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
                                            className="input"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveAnswer(q.id, answer.id)
                                            }
                                            className="btn btn-danger"
                                        >
                                            -
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddAnswer(q.id)}
                                    className="btn btn-primary mt-2"
                                >
                                    Add Answer
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveQuestion(q.id)}
                                className="btn btn-danger mt-2"
                            >
                                Remove Question
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="btn btn-primary"
                    >
                        Add Question
                    </button>
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
