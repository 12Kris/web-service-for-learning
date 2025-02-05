import { Dispatch, SetStateAction } from "react";

// export interface UserMetadata {
//   name?: string;
//   avatar_url?: string;
//   role?: string;
// }

export interface User {
  id: string;
  email: string;
  full_name: string;
  description: string;
  name?: string;
  avatar: string;
  role: string;
  created_at: string;
  joinDate?: string;
  user_metadata: UserMetadata;
}

// export interface Module {
//   id: number;
//   title: string;
//   description: string;
// }

export interface WhatWillLearn {
  id: number;
  description: string;
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  type?: string;
  creator_id?: string;
  last_completion_date?: string;
  progress?: number;
  rating?: number;
  lessons?: number;
  student_count?: number;
  creator?: User;
  course_details?: CourseDetails[];
  what_w_learn?: WhatWillLearn[];
  curriculum?: Module[];
  created_at?: string;
}

export interface CourseWithStudents {
  id: number;
  name: string;
  description?: string;
  type?: string;
  creator_id?: string;
  last_completion_date?: string;
  student_count: number;
  created_at: string;
}

export interface CourseDetails {
  id: number;
  course_detail: string;
}

export interface UserCourse {
  user_id: string;
  course_id: number;
}

// export interface Block {
//   id: number;
//   course_id: number;
//   name: string;
// }

// export interface Card {
//   id: number;
//   block_id: number;
//   question: string;
//   answer: string;
// }

export interface Card {
  front: string;
  back: string;
}

export interface Test {
  id: number;
  block_id: number;
  question: string;
  answer?: { question_id: number, answer: string } | string;
  correct: boolean;
}

export interface MenuItems {
  name: string;
  icon: string;
  href: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

// bohdan code

export interface CourseWithStudents {
  id: number;
  name: string;
  description?: string;
  type?: string;
  creator_id?: string;
  last_completion_date?: string;
  student_count: number;
}

export interface CourseDetails {
  id: number;
  course_detail: string;
}

export interface UserCourse {
  user_id: string;
  course_id: number;
}

export interface Block {
  id: number;
  course_id: number | null;
  name: string;
  description?: string;
}

export interface FlashCards {
  learning_material_id?: number;
  id?: number;
  front: string;
  back: string;
}

export interface BlockSectionProps {
  block: Block;
  setModals: Dispatch<SetStateAction<{ block: boolean }>>;
  handleOpenBlockModal: (block: Block | null) => void;
}

export interface LearningMaterial {
  id: number;
  title: string;
  content: string;
}

export interface MaterialData {
  title: string;
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
  correct_answer?: number;
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

export interface UserMetadata {
    name?: string;
    avatar_url?: string;
    role?: string;
    displayName?: string;
    description?: string;
}

export interface Module {
    materials?: LearningMaterial[];
    tests?: Test[];
    id: number;
    title?: string;
    name?: string;
    description?: string;
    duration?: string
}

export interface TestDataWithQuestion {
    block_id: number;
    questions?: Question[];
    question?: Question
    answers: Answer[]
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