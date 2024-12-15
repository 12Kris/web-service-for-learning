'use client';

import { useEffect, useState } from 'react';
import { getTestQuestions, saveTestResults } from '@/lib/courses/actions';
import { TestQuestion, UserTestAnswer, SaveTestResult } from '@/lib/definitions';

interface TestPageProps {
    params: { id: string };
}
// TODO: сделать edit,update ? для тестов материалов блоков и блоки еще нельзя добавлять, сделай это все ( не забывай связи, для тестов чтобы еще вопросы редактировать и тд.. с каждым
//  чтобы еще ссыдка была workspace/{block,material,test}/{id}
export default function TestPage({ params }: TestPageProps) {
    const { id: testId } = params;

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
        const isCorrect = selectedAnswerId === currentQuestion.correct_answer;

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

    if (isTestComplete) {
        return (
            <div className="text-center">
                <h2>Test Complete!</h2>
                <p>Your Score: {score}/{questions.length}</p>
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
                    <h3>Question {currentQuestionIndex + 1}/{questions.length}</h3>
                    <p>{questions[currentQuestionIndex].question}</p>
                    <ul className="mt-4">
                        {questions[currentQuestionIndex].answers.map((answer) => (
                            <li key={answer.id}>
                                <button className="mt-2 bg-gray-200 py-2 px-4 rounded"
                                        onClick={() => handleAnswer(answer.id)}>
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
