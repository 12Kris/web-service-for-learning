

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
  creator?: User;
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
  answer: string;
  correct: boolean;
}

export interface MenuItems {
  name: string;
  icon: string;
  href: string;
}
