// 'use client';

// import React, { useEffect, useState } from 'react';
// import { getTestQuestions, saveTestResults } from '@/lib/courses/actions';
// import { TestQuestion, UserTestAnswer, SaveTestResult } from '@/lib/definitions';

// interface TestPageProps {
//     params: { id: string };
// }

// export default function TestPage({ params }: TestPageProps) {
//     const { id: testId } = React.use(params);

//     const [questions, setQuestions] = useState<TestQuestion[]>([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//     const [answers, setAnswers] = useState<UserTestAnswer[]>([]);
//     const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
//     const [score, setScore] = useState<number>(0);
//     const [attempts, setAttempts] = useState<number>(1);

//     useEffect(() => {
//         async function fetchQuestions() {
//             const data: TestQuestion[] = await getTestQuestions(testId);
//             setQuestions(data);
//         }

//         fetchQuestions();
//     }, [testId]);

//     const handleAnswer = (selectedAnswerId: number) => {
//         const currentQuestion = questions[currentQuestionIndex];
//         const isCorrect = selectedAnswerId === currentQuestion.correct_answer.id;

//         if (isCorrect) {
//             setScore((prev) => prev + 1);
//         }

//         setAnswers((prev) => [
//             ...prev,
//             {
//                 questionId: currentQuestion.id,
//                 answerId: selectedAnswerId,
//                 isCorrect,
//             },
//         ]);

//         if (currentQuestionIndex + 1 === questions.length) {
//             setIsTestComplete(true);
//         } else {
//             setCurrentQuestionIndex((prev) => prev + 1);
//         }
//     };

//     const handleSaveResults = async () => {
//         try {
//             const result: SaveTestResult = await saveTestResults(testId, answers);
//             if (result?.error) {
//                 console.error('Error saving results:', result.error);
//             } else {
//                 alert('Results saved successfully!');
//             }
//         } catch (error) {
//             console.error('Error saving results:', error);
//         }
//     };

//     if (isTestComplete) {
//         return (
//             <div className="text-center">
//                 <h2>Test Complete!</h2>
//                 <p>Your Score: {score}/{questions.length}</p>
//                 <p>Attempts: {attempts}</p>
//                 <button
//                     className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
//                     onClick={handleSaveResults}
//                 >
//                     Save Results
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="text-center">
//             {questions.length > 0 ? (
//                 <div>
//                     <h3>Question {currentQuestionIndex + 1}/{questions.length}</h3>
//                     <p>{questions[currentQuestionIndex].question}</p>
//                     <ul className="mt-4">
//                         {questions[currentQuestionIndex].answers.map((answer) => (
//                             <li key={answer.id}>
//                                 <button className="mt-2 bg-gray-200 py-2 px-4 rounded"
//                                         onClick={() => handleAnswer(answer.id)}>
//                                     {answer.answer}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             ) : (
//                 <p>Loading questions...</p>
//             )}
//         </div>
//     );
// }


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { getTestQuestions, saveTestResults } from '@/lib/courses/actions';
// import { TestQuestion, UserTestAnswer, SaveTestResult } from '@/lib/definitions';

// interface TestPageProps {
//     params: { id: string };
// }

// export default function TestPage({ params }: TestPageProps) {
//     const { id: testId } = React.use(params);

//     const [questions, setQuestions] = useState<TestQuestion[]>([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//     const [answers, setAnswers] = useState<UserTestAnswer[]>([]);
//     const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
//     const [score, setScore] = useState<number>(0);
//     const [attempts, setAttempts] = useState<number>(1);

//     useEffect(() => {
//         async function fetchQuestions() {
//             const data: TestQuestion[] = await getTestQuestions(testId);
//             setQuestions(data);
//         }

//         fetchQuestions();
//     }, [testId]);

//     const handleAnswer = (selectedAnswerId: number) => {
//         const currentQuestion = questions[currentQuestionIndex];
//         const isCorrect = selectedAnswerId === currentQuestion.correct_answer.id;

//         if (isCorrect) {
//             setScore((prev) => prev + 1);
//         }

//         setAnswers((prev) => [
//             ...prev,
//             {
//                 questionId: currentQuestion.id,
//                 answerId: selectedAnswerId,
//                 isCorrect,
//             },
//         ]);

//         if (currentQuestionIndex + 1 === questions.length) {
//             setIsTestComplete(true);
//         } else {
//             setCurrentQuestionIndex((prev) => prev + 1);
//         }
//     };

//     const handleSaveResults = async () => {
//         try {
//             const result: SaveTestResult = await saveTestResults(testId, answers);
//             if (result?.error) {
//                 console.error('Error saving results:', result.error);
//             } else {
//                 alert('Results saved successfully!');
//                 window.location.href = `/workspace`;

//             }
//         } catch (error) {
//             console.error('Error saving results:', error);
//         }
//     };


//     if (isTestComplete) {
//         return (
//             <div className="text-center">
//                 <h2>Test Complete!</h2>
//                 <p>Your Score: {score}/{questions.length}</p>
//                 <p>Attempts: {attempts}</p>
//                 <button
//                     className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
//                     onClick={handleSaveResults}
//                 >
//                     Save Results
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="text-center">
//             {questions.length > 0 ? (
//                 <div>
//                     <h3>Question {currentQuestionIndex + 1}/{questions.length}</h3>
//                     <p>{questions[currentQuestionIndex].question}</p>
//                     <ul className="mt-4">
//                         {questions[currentQuestionIndex].answers.map((answer) => (
//                             <li key={answer.id}>
//                                 <button className="mt-2 bg-gray-200 py-2 px-4 rounded"
//                                         onClick={() => handleAnswer(answer.id)}>
//                                     {answer.answer}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             ) : (
//                 <p>Loading questions...</p>
//             )}
//         </div>
//     );
// }


'use client';

import React, { useEffect, useState } from 'react';
import { getTestQuestions, saveTestResults } from '@/lib/courses/actions';
import { TestQuestion, UserTestAnswer, SaveTestResult } from '@/lib/definitions';
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface TestPageProps {
    params: { id: string };
}

export default function TestPage({ params }: TestPageProps) {
    const { id: testId } = React.use(params);
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<UserTestAnswer[]>([]);
    const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(1);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            const data: TestQuestion[] = await getTestQuestions(testId);
            setQuestions(data);
        }
        fetchQuestions();
    }, [testId]);

    const handleAnswer = () => {
        if (selectedAnswer === null) return;

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correct_answer.id;

        if (isCorrect) {
            setScore((prev) => prev + 1);
        }

        setAnswers((prev) => [
            ...prev,
            {
                questionId: currentQuestion.id,
                answerId: selectedAnswer,
                isCorrect,
            },
        ]);

        if (currentQuestionIndex + 1 === questions.length) {
            setIsTestComplete(true);
        } else {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
        }
    };

    const handleSaveResults = async () => {
        try {
            const result: SaveTestResult = await saveTestResults(testId, answers);
            if (result?.error) {
                console.error('Error saving results:', result.error);
            } else {
                alert('Results saved successfully!');
                window.location.href = `/workspace`;
            }
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    if (isTestComplete) {
        return (
            <div className="flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl p-8 text-center space-y-6">
                    <h2 className="text-3xl font-bold">Test Complete!</h2>
                    <div className="space-y-2">
                        <p className="text-xl">Your Score: {score}/{questions.length}</p>
                        <p className="text-gray-600">Attempts: {attempts}</p>
                    </div>
                    <Button
                        className="w-full max-w-md"
                        onClick={handleSaveResults}
                    >
                        Save Results
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Master Web Development</h1>
                    <h2 className="text-2xl font-bold">Knowledge Test</h2>
                </div>
                
                {questions.length > 0 ? (
                    <Card className="p-6 space-y-6">
                        <div className="text-sm text-gray-600">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        <h3 className="text-xl font-medium">
                            {questions[currentQuestionIndex].question}
                        </h3>
                        <RadioGroup
                            value={selectedAnswer?.toString()}
                            onValueChange={(value) => setSelectedAnswer(Number(value))}
                            className="space-y-3"
                        >
                            {questions[currentQuestionIndex].answers.map((answer) => (
                                <div
                                    key={answer.id}
                                    className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50"
                                >
                                    <RadioGroupItem value={answer.id.toString()} id={answer.id.toString()} />
                                    <Label className="flex-grow cursor-pointer" htmlFor={answer.id.toString()}>
                                        {answer.answer}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <Button 
                            className="w-full"
                            variant="default"
                            onClick={handleAnswer}
                            disabled={selectedAnswer === null}
                        >
                            Next question
                        </Button>
                    </Card>
                ) : (
                    <Card className="p-6 text-center">
                        <p>Loading questions...</p>
                    </Card>
                )}
            </div>
        </div>
    );
}

