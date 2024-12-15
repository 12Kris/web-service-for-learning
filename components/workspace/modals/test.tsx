import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
    blockId: number;
}) {
    // Обеспечиваем, чтобы answers всегда был массивом, даже если currentTest пуст
    const [question, setQuestion] = useState<string>(currentTest?.question || "");
    const [answers, setAnswers] = useState<{ text: string; correct: boolean }[]>(
        currentTest?.answers || [{ text: "", correct: false }, { text: "", correct: false }]
    );

    const [correctAnswer, setCorrectAnswer] = useState<any>(
        currentTest?.answers && Array.isArray(currentTest.answers)
            ? currentTest.answers.find((answer: any) => answer.correct) || null
            : null
    );

    useEffect(() => {
        setQuestion(currentTest?.question || "");
        setAnswers(currentTest?.answers || [{ text: "", correct: false }, { text: "", correct: false }]);
        setCorrectAnswer(
            currentTest?.answers && Array.isArray(currentTest.answers)
                ? currentTest.answers.find((answer: any) => answer.correct) || null
                : null
        );
    }, [currentTest]);

    const handleAnswerChange = (index: number, text: string) => {
        const newAnswers = [...answers];
        newAnswers[index].text = text;
        setAnswers(newAnswers);
    };

    const handleCorrectAnswerChange = (index: number) => {
        const newAnswers = answers.map((answer, idx) => ({
            ...answer,
            correct: idx === index,
        }));
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        if (question && answers.every((a) => a.text)) {
            onSave({ block_id: blockId, question, answers });
            onClose();
        } else {
            alert("Please fill all fields.");
        }
    };
    useEffect(() => {
        console.log(answers)
    },[answers])
    useEffect(() => {
        console.log("Correct: ", correctAnswer)
    },[correctAnswer])

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogTrigger />
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
                        {answers.map((answer, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    checked={correctAnswer?.id === answer.id} // TODO: answer_id not defined in arr
                                    onChange={() => handleCorrectAnswerChange(index)}
                                />
                                <input
                                    type="text"
                                    value={answer.text}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                />
                            </div>
                        ))}
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
