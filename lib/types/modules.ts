import { Lesson } from "@/lib/types/learning";
import { LearningMaterial } from "@/lib/types/learning";
import { Test } from "@/lib/types/test";

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  materials?: LearningMaterial[];
  tests?: Test[];
  name?: string;
}
