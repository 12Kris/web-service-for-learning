'use client';

import { use, useEffect, useState } from 'react';
import { getTestQuestions, saveTestResults } from '@/lib/courses/actions';
import { useRouter } from 'next/navigation';

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isTestComplete, setIsTestComplete] = useState(false);
    const [score, setScore] = useState(0);

    const { id: testId } = use(params);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = await getTestQuestions(testId);
                if (Array.isArray(data) && data.length > 0) {
                    setQuestions(data);
                } else {
                    setQuestions([]);
                }
            } catch (error) {
                setQuestions([]);
            }
        }

        fetchQuestions();
    }, [testId]);

    const handleAnswer = (questionId, selectedAnswerIndex) => {
        const isCorrect = selectedAnswerIndex === questions[currentQuestion]?.correct_index;

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
        }

        setAnswers((prev) => [
            ...prev,
            { questionId, answer: selectedAnswerIndex, isCorrect },
        ]);

        if (currentQuestion + 1 === questions.length) {
            setIsTestComplete(true);
        } else {
            setCurrentQuestion((prev) => prev + 1);
        }
    };


    const handleSaveResults = async () => {
        try {
            const result = await saveTestResults(testId, answers);
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    if (isTestComplete) {
        return (
            <div>
                <h2>Test Complete!</h2>
                <p>Your Score: {score}</p>
                <button onClick={handleSaveResults}>Save Results</button>
            </div>
        );
    }

    return (
        <div>
            {questions.length > 0 && (
                <div>
                    <h3>{questions[currentQuestion]?.question}</h3>
                    {questions[currentQuestion]?.answers.map((option, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                name="answer"
                                onClick={() =>
                                    handleAnswer(questions[currentQuestion]?.id, index)
                                }
                            />
                            <label>{option}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
