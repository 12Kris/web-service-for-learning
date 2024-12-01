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
    const router = useRouter();

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = await getTestQuestions(testId);
                console.log('Fetched questions:', data);

                if (Array.isArray(data) && data.length > 0) {
                    const questionsWithOptions = data.map((question) => ({
                        ...question,
                        options: [question.answer, 'Option 2', 'Option 3'],
                        correctAnswer: question.answer,
                    }));

                    setQuestions(questionsWithOptions);
                } else {
                    console.warn('No questions found');
                    setQuestions([]);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setQuestions([]);
            }
        }

        fetchQuestions();
    }, [testId]);


    const handleAnswer = (questionId, answer, isCorrect) => {
        setAnswers((prev) => [...prev, { questionId, answer, isCorrect }]);
        if (currentQuestion + 1 === questions.length) {
            setIsTestComplete(true);
        } else {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handleSaveResults = async () => {
        try {
            const result = await saveTestResults('user-id', testId, answers);
            if (result) {
                setScore(result.score);
            }
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
            {questions.length > 0 && questions[currentQuestion]?.options?.length > 0 && (
                <div>
                    <h3>{questions[currentQuestion].question}</h3>
                    {questions[currentQuestion].options.map((option, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                name="answer"
                                onClick={() =>
                                    handleAnswer(
                                        questions[currentQuestion].id,
                                        option,
                                        option === questions[currentQuestion].correctAnswer
                                    )
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
