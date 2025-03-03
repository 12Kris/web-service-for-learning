export interface Test {
  id: number;
  block_id: number;
  question: string;
  answer?: { question_id: number; answer: string } | string;
  correct: boolean;
}

export interface TestWithQuestions {
  id: number;
  blockId: number;
  question: string;
  questions: TestQuestion[];
}

export interface TestQuestion {
  id: number;
  question: string;
  correct_answer?: number | { id: string };
  correct_id?: number;
  answers: TestAnswer[];
}

export interface TestAnswerForCourse {
  id: number;
  answer: string;
  correct: boolean;
  text: string;
}

export interface TestQuestionForCourse {
  id: number;
  question: string;
  correct_answer?: number;
  correct_id?: number;
  answers: TestAnswerForCourse[];
}

export interface TestAnswer {
  answer?: string;
  id: number;
  text: string;
  correct: boolean | number;
}

export interface AnswerDataQuestion {
  text: string;
  question_id: number;
}

export interface SaveTestResult {
  id?: number;
  error?: string;
}

export interface UserTestAnswer {
  questionId: number;
  answerId: number;
  isCorrect: boolean;
}

export interface TestQuestionDataFromDB {
  id: number;
  question: string;
  correct_id: number;
  TestAnswers: TestAnswerDataFromDB[];
}

export interface TestAnswerDataFromDB {
  id: number;
  answer: string;
}

export interface Answer {
  id: string;
  text: string;
  correct: boolean;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface TestDataModal {
  block_id: number | null;
  question: string;
  questions: Question[];
}

export interface TestDataWithQuestion {
  block_id: number;
  questions?: Question[];
  question?: Question;
  answers: Answer[];
}

export interface TestData {
  id: number;
  question: string;
  block_id: number;
  Block?: BlockData;
}

export interface BlockData {
  id: number;
  name: string;
  Course: CourseData;
}

export interface CourseData {
  id: number;
  name: string;
}

export interface TestQuestionData {
  id: string;
  question: string;
  correct_id: string;
  answers: AnswerData[];
}

export interface AnswerData {
  id: string;
  answer: string;
}

export interface TestQuestion {
  id: number;
  question: string;
  //   correct_answer?: number;
  correct_id?: number;
  answers: TestAnswer[];
}

export interface TestQuestion {
  id: number;
  question: string;
  correct_answer?: number | { id: string };
  correct_id?: number;
  answers: TestAnswer[];
}
