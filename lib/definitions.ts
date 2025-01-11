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
    creator?: User
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

export interface UserCourse {
    user_id: string;
    course_id: number;
}

export interface Block {
    id: number;
    course_id: number;
    name: string;
}

export interface Card {
    id: number;
    block_id: number;
    question: string;
    answer: string;
}

export interface Test {
    id: number;
    block_id: number;
    question: string;
}

export interface TestQuestion {
    id: number;
    question: string;
    correct_answer: number;
    answers: TestAnswer[];
}

export interface TestAnswer {
    id: number;
    answer: string;
    correct?: boolean;
}

export interface UserTestAnswer {
    questionId: number;
    answerId: number;
    isCorrect: boolean;
}

export interface SaveTestResult {
    id?: number;
    error?: string;
}

export type LearningBlock = {
    id: number;
    title: string;
    order_number: number;
};

export type LearningMaterial = {
    id: number;
    title: string;
    content: string;
    material_type: string;
    order_number: number;
};

export interface Block {
    id: number;
    name: string;
}

export interface Test {
    id: number;
    question: string;
}

export interface Material {
    id: number;
    title: string;
}

export interface ModalsState {
    [key: string]: boolean;
}

export interface BlockSectionProps {
    block: Block;
    tests: Test[];
    materials: Material[];
    setModals: React.Dispatch<React.SetStateAction<ModalsState>>;
    setCurrentBlockId: React.Dispatch<React.SetStateAction<number | null>>;
    handleOpenBlockModal: (block: Block) => void;
    handleOpenMaterialModal: (
        material: Material | null,
        blockId: number,
        setCurrentBlockId: React.Dispatch<React.SetStateAction<number>>,
        setCurrentMaterial: React.Dispatch<React.SetStateAction<Material | null>>,
        setMaterialTitle: React.Dispatch<React.SetStateAction<string>>,
        setMaterialContent: React.Dispatch<React.SetStateAction<string>>,
        setModals: React.Dispatch<React.SetStateAction<ModalsState>>
    ) => void;
    handleOpenTestModal: (
        test: Test | null,
        blockId: number | null,
        setCurrentTest: React.Dispatch<React.SetStateAction<Test | null>>,
        setCurrentBlockId: React.Dispatch<React.SetStateAction<number>>,
        setModals: React.Dispatch<React.SetStateAction<ModalsState>>
    ) => void;
    setCurrentTest: React.Dispatch<React.SetStateAction<Test | null>>;
    currentBlockId: number | null;
}