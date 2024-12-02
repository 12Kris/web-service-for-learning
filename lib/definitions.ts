export interface User {
    id: string;
    email: string;
    full_name?: string;
    date_of_birth?: string;
  }
  
  export interface Course {
    id: number;
    name: string;
    description?: string;
    type?: string;
    creator_id: string;
    creator?: User;
    last_completion_date?: string;
    users?: User;
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