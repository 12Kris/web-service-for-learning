// 'use client';

// import {useEffect, useState} from 'react';
// import {getTestQuestions, saveTestResults} from '@/lib/courses/actions';
// import {use} from 'react';

// export default function TestPage({params}: { params: Promise<{ id: string }> }) {
//     const {id: testId} = use(params);

//     const [questions, setQuestions] = useState([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answers, setAnswers] = useState([]);
//     const [isTestComplete, setIsTestComplete] = useState(false);
//     const [score, setScore] = useState(0);
//     const [attempts, setAttempts] = useState(1);

//     useEffect(() => {
//         async function fetchQuestions() {
//             const data = await getTestQuestions(testId);
//             setQuestions(data);
//         }

//         fetchQuestions();
//     }, [testId]);

//     const handleAnswer = (selectedAnswerId: string) => {
//         const currentQuestion = questions[currentQuestionIndex];

//         const correctAnswer = currentQuestion.answers[currentQuestion.correct_index];

//         const isCorrect = selectedAnswerId === correctAnswer.id;

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


//     useEffect(() => {
//         console.log(answers);
//     }, [answers])

//     const handleSaveResults = async () => {
//         try {
//             const result = await saveTestResults(testId, answers);
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
//                         {questions[currentQuestionIndex].answers.map((answer: any, index: number) => (
//                             <li key={index}>
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

export default function DeletedBecouseOfErrors() {
  return <div>DeletedBecouseOfErrors</div>;
}
