import {LearningMaterial} from "@/lib/definitions";

export interface Module {
    id: number;
    name?: string;
    title?: string;
    description: string;
    duration: string;
    lessons: Lesson[];
    materials: LearningMaterial[] | null;
    isActive: boolean;
    isCompleted: boolean;
    progress: number;
}

export interface Lesson {
    id: number;
    title: string;
    duration: string;
    isCompleted: boolean;
    type: "video" | "quiz" | "exercise";
}
