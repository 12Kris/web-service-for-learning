import { Profile } from "@/lib/types/user";
import { Module } from "@/lib/types/modules";

export interface WhatWillLearn {
  id: number;
  description: string;
}

export interface Course {
  id: number
  name: string
  description?: string
  color?: string
  type?: string
  creator_id?: string
  last_completion_date?: string
  progress?: number
  rating?: number
  rating_count?: number
  lessons?: number
  student_count?: number
  creator?: Profile
  course_details?: CourseDetails[]
  what_w_learn?: WhatWillLearn[]
  curriculum?: Module[]
  created_at?: string
  spaced_repetition?: string
  user_progress?: {
    spaced_repetition?: {
      schedule: number[]
      start_date: string
      next_review_dates: string[]
    }
  }[]
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

export interface CourseWithStudents extends Course {
  student_count: number
}