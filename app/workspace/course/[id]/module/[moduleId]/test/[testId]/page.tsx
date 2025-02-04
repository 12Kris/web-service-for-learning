// 'use client';

// import React, { useEffect, useState } from 'react';
// import { getTestQuestions, saveTestResults } from '@/lib/courses/actions';
// import { TestQuestion, UserTestAnswer, SaveTestResult } from '@/lib/definitions';
// import { useParams, useRouter } from 'next/navigation';

// export default function TestPage() {
//     const params = useParams();
//     const router = useRouter();
//     const testId = params.testId;
//     const courseId = params.id;
//     const moduleId = params.moduleId;

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

//     const goBackToModule = () => {
//         const newUrl = `/workspace/course/${courseId}/module/${moduleId}`;
//         router.push(newUrl);
//     };

//     if (isTestComplete) {
//         return (
//             <div className="text-center">
//                 <h2 className="text-2xl font-bold">Test Complete!</h2>
//                 <p className="mt-2">Your Score: {score}/{questions.length}</p>
//                 <p className="mt-1">Attempts: {attempts}</p>
//                 <button
//                     className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
//                     onClick={handleSaveResults}
//                 >
//                     Save Results
//                 </button>
//                 <button
//                     className="mt-4 ml-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
//                     onClick={goBackToModule}
//                 >
//                     Go back to module
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="text-center">
//             {questions.length > 0 ? (
//                 <div>
//                     <h3 className="text-xl font-semibold">
//                         Question {currentQuestionIndex + 1}/{questions.length}
//                     </h3>
//                     <p className="mt-2">{questions[currentQuestionIndex].question}</p>
//                     <ul className="mt-4">
//                         {questions[currentQuestionIndex].answers.map((answer) => (
//                             <li key={answer.id}>
//                                 <button
//                                     className="mt-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
//                                     onClick={() => handleAnswer(answer.id)}
//                                 >
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
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function TestPage() {
    const params = useParams();
    const testId = Number(params.testId);
    const courseId = params.id;
    const moduleId = params.moduleId;

    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<UserTestAnswer[]>([]);
    const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    // const [attempts, setAttempts] = useState<number>(1);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            const data: TestQuestion[] = await getTestQuestions(testId);
            setQuestions(data);
        }

        fetchQuestions();
    }, [testId]);

    const handleNext = () => {
        if (selectedAnswer === null) return;

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correct_answer;

        if (isCorrect) {
            setScore((prev) => prev + 1);
        }

        setAnswers((prev) => [
            ...prev,
            {
                questionId: Number(currentQuestion.id),
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
                window.location.href = `/workspace/course/${courseId}/module/${moduleId}`;
            }
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    if (isTestComplete) {
        return (
            <Card className="max-w-2xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Test Complete!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-xl">Your Score: {score}/{questions.length}</p>
                            {/*<p className="text-gray-600">Attempts: {attempts}</p>*/}
                        </div>
                        <Progress value={(score / questions.length) * 100} className="w-full" />
                        {/* <p className="text-muted-foreground">Attempt {attempts}</p> */}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    {/* <Button onClick={handleSaveResults} variant="default">
                        Save Results
                    </Button>
                    <Button onClick={goBackToModule} variant="outline">
                        Back to Module
                    </Button> */}
                    <Button
                        className="w-full max-w-md"
                        onClick={handleSaveResults}
                    >
                        Save Results
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader className="text-center">
                <CardTitle>Knowledge Test</CardTitle>
                <Progress 
                    value={((currentQuestionIndex + 1) / questions.length) * 100} 
                    className="mt-4"
                />
            </CardHeader>
            {questions.length > 0 ? (
                <CardContent>
                    <div className="space-y-6">
                        <div className="text-sm text-muted-foreground text-center">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        <h3 className="text-xl font-semibold text-center">
                            {questions[currentQuestionIndex].question}
                        </h3>
                        <RadioGroup
                            value={selectedAnswer?.toString()}
                            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                            className="space-y-3"
                        >
                            {questions[currentQuestionIndex].answers.map((answer) => (
                                <div
                                    key={answer.id}
                                    className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent"
                                >
                                    <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
                                    <Label htmlFor={`answer-${answer.id}`} className="flex-grow cursor-pointer">
                                        {answer.answer}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>
            ) : (
                <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Loading questions...</p>
                </CardContent>
            )}
            <CardFooter className="flex justify-center">
                <Button 
                    onClick={handleNext} 
                    disabled={selectedAnswer === null}
                    className="w-full max-w-xs"
                >
                    Next question
                </Button>
            </CardFooter>
        </Card>
    );
}

