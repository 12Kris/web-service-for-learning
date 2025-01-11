'use client';

import React, { useEffect, useState } from 'react';
import { getTestQuestions, saveTestResults } from '@/lib/courses/actions';
import { TestQuestion, UserTestAnswer, SaveTestResult } from '@/lib/definitions';
import { useParams, useRouter } from 'next/navigation';

export default function TestPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.testId;
    const courseId = params.id;
    const moduleId = params.moduleId;

    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<UserTestAnswer[]>([]);
    const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(1);

    useEffect(() => {
        async function fetchQuestions() {
            const data: TestQuestion[] = await getTestQuestions(testId);
            setQuestions(data);
        }

        fetchQuestions();
    }, [testId]);

    const handleAnswer = (selectedAnswerId: number) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswerId === currentQuestion.correct_answer.id;

        if (isCorrect) {
            setScore((prev) => prev + 1);
        }

        setAnswers((prev) => [
            ...prev,
            {
                questionId: currentQuestion.id,
                answerId: selectedAnswerId,
                isCorrect,
            },
        ]);

        if (currentQuestionIndex + 1 === questions.length) {
            setIsTestComplete(true);
        } else {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handleSaveResults = async () => {
        try {
            const result: SaveTestResult = await saveTestResults(testId, answers);
            if (result?.error) {
                console.error('Error saving results:', result.error);
            } else {
                alert('Results saved successfully!');
            }
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    const goBackToModule = () => {
        const newUrl = `/workspace/course/${courseId}/module/${moduleId}`;
        router.push(newUrl);
    };

    if (isTestComplete) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Test Complete!</h2>
                <p className="mt-2">Your Score: {score}/{questions.length}</p>
                <p className="mt-1">Attempts: {attempts}</p>
                <button
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={handleSaveResults}
                >
                    Save Results
                </button>
                <button
                    className="mt-4 ml-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                    onClick={goBackToModule}
                >
                    Go back to module
                </button>
            </div>
        );
    }

    return (
        <div className="text-center">
            {questions.length > 0 ? (
                <div>
                    <h3 className="text-xl font-semibold">
                        Question {currentQuestionIndex + 1}/{questions.length}
                    </h3>
                    <p className="mt-2">{questions[currentQuestionIndex].question}</p>
                    <ul className="mt-4">
                        {questions[currentQuestionIndex].answers.map((answer) => (
                            <li key={answer.id}>
                                <button
                                    className="mt-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
                                    onClick={() => handleAnswer(answer.id)}
                                >
                                    {answer.answer}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading questions...</p>
            )}
        </div>
    );
}
