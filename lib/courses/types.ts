export interface UserMetadata {
    name?: string;
    avatar_url?: string;
    role?: string;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    name?: string;
    avatar: string;
    role: string;
    created_at: string;
    joinDate?: string;
    user_metadata: UserMetadata;
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
}

export interface CourseWithStudents {
    id: number;
    name: string;
    description?: string;
    type?: string;
    creator_id?: string;
    last_completion_date?: string;
    student_count: number;
}

export interface LearningBlock {
    id: number;
    title: string;
    order_number: number;
}

export interface LearningMaterial {
    id: number;
    title: string;
    content: string;
    material_type: string;
    order_number: number;
}

export interface Test {
    id: number;
    question: string;
    Block: Block;
}

export interface Block {
    id: number;
    Course: Course;
}

export interface TestQuestion {
    id: number;
    question: string;
    answers: {
        id: number;
        answer: string;
        correct?: boolean;
    }[];
}

export interface TestAnswer {
    id: string;
    answer: string;
}

export interface Card {
    id: string;
    title: string;
    content: string;
    block_id: string;
}

export interface TestResult {
    id: string;
    user_id: string;
    test_id: string;
    score: number;
    attempt_number: number;
}

export interface UserTestAnswer {
    questionId: number;
    answerId: number;
    isCorrect: boolean;
}

export interface SaveTestResult {
    error?: string;
    id?: string;
}