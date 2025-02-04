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
  
  