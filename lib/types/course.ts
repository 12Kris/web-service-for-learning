import { User } from '@/lib/types/user';

export interface Module {
  id: number;
  title: string;
  description: string;
}

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

export interface CourseDetails {
  id: number;
  course_detail: string;
}

export interface UserCourse {
  user_id: string;
  course_id: number;
}

