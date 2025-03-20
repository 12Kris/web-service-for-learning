
export interface Lesson {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
  type: "video" | "quiz" | "exercise";
}

export interface LearningMaterial {
  id: number;
  title: string;
  content: string;
  block_id?: number;
  flashcards?: {id: number, front: string, back: string}[]
}

export interface MaterialData {
  title: string;
}
