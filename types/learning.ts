export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
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
