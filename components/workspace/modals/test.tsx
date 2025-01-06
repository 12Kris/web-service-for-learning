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

export function TestModal({
                              isOpen,
                              onClose,
                              onSave,
                              currentTest,
                              blockId,
                          }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (testData: any) => void;
    currentTest: any;
    blockId: number | null;
}) {
    const [question, setQuestion] = useState<string>(currentTest?.question || "");
    const [answers, setAnswers] = useState<{ id: string; text: string; correct: boolean }[]>(currentTest?.answers || [
        {id: "1", text: "", correct: false},
        {id: "2", text: "", correct: false}
    ]);
    const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(
        currentTest?.answers?.find((answer: any) => answer.correct)?.id || null
    );

    useEffect(() => {
        setQuestion(currentTest?.question || "");
        setAnswers(currentTest?.answers || [
            {id: "1", text: "", correct: false},
            {id: "2", text: "", correct: false}
        ]);
        setCorrectAnswerId(currentTest?.answers?.find((answer: any) => answer.correct)?.id || null);
    }, [currentTest]);

    const handleAnswerChange = (id: string, text: string) => {
        const newAnswers = answers.map((answer) =>
            answer.id === id ? {...answer, text} : answer
        );
        setAnswers(newAnswers);
    };

    const handleCorrectAnswerChange = (id: string) => {
        const newAnswers = answers.map((answer) =>
            answer.id === id ? {...answer, correct: true} : {...answer, correct: false}
        );
        setAnswers(newAnswers);
        setCorrectAnswerId(id);
    };

    const handleAddAnswer = () => {
        setAnswers([...answers, {id: (answers.length + 1).toString(), text: "", correct: false}]);
    };

    const handleRemoveAnswer = (id: string) => {
        const newAnswers = answers.filter((answer) => answer.id !== id);
        setAnswers(newAnswers);
        if (correctAnswerId === id) {
            setCorrectAnswerId(null);
        }
    };

    const handleSubmit = () => {
        if (question && answers.every((a) => a.text)) {
            onSave({block_id: blockId, question, answers});
            onClose();
        } else {
            alert("Please fill all fields.");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogTrigger/>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{currentTest ? "Edit Test" : "Create Test"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {currentTest
                            ? "Edit the test question and answers"
                            : "Create a new test question"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="font-medium">Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Enter the question"
                            className="input"
                        />
                    </div>
                    <div>
                        <label>Answers</label>
                        {answers.map((answer) => (
                            <div key={answer.id} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    checked={correctAnswerId === answer.id}
                                    onChange={() => handleCorrectAnswerChange(answer.id)}
                                />
                                <input
                                    type="text"
                                    value={answer.text}
                                    onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                                    className="input"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAnswer(answer.id)}
                                    className="btn btn-danger"
                                >
                                    -
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddAnswer}
                            className="btn btn-primary mt-2"
                        >
                            +
                        </button>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>
                        {currentTest ? "Save" : "Create"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}