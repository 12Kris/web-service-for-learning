'use client';

import React, {useEffect, useState} from 'react';
import {getTestQuestions, saveTestResults} from '@/lib/courses/actions';
import {TestQuestion, UserTestAnswer} from '@/lib/courses/types';

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export default function TestPage({params}: Params) {
    const {id: testId} = React.use(params);

    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<UserTestAnswer[]>([]);
    const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(1);

    useEffect(() => {
        async function fetchQuestions() {
            const data = await getTestQuestions(testId);
            if (data) {
                setQuestions(data);
            }
        }

        fetchQuestions();
    }, [testId]);

    const handleAnswer = (selectedAnswerId: number) => {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedAnswer = currentQuestion.answers.find((answer) => answer.id === selectedAnswerId);
        const isCorrect = selectedAnswer?.correct;

        if (isCorrect) {
            setScore((prev) => prev + 1);
        }

        setAnswers((prev) => [
            ...prev,
            {
                questionId: currentQuestion.id,
                answerId: selectedAnswerId,
                isCorrect: isCorrect ?? false,
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
            const result = await saveTestResults(testId, answers);
            if (result?.error) {
                console.error('Error saving results:', result.error);
            } else {
                alert('Results saved successfully!');
            }
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    if (isTestComplete) {
        return (
            <div className="text-center">
                <h2>Test Complete!</h2>
                <p>
                    Your Score: {score}/{questions.length}
                </p>
                <p>Attempts: {attempts}</p>
                <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handleSaveResults}
                >
                    Save Results
                </button>
            </div>
        );
    }

    return (
        <div className="text-center">
            {questions.length > 0 ? (
                <div>
                    <h3>
                        Question {currentQuestionIndex + 1}/{questions.length}
                    </h3>
                    <p>{questions[currentQuestionIndex].question}</p>
                    <ul className="mt-4">
                        {questions[currentQuestionIndex].answers.map((answer) => (
                            <li key={answer.id}>
                                <button
                                    className="mt-2 bg-gray-200 py-2 px-4 rounded"
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
