import { Dispatch, SetStateAction } from "react";
export interface Block {
    id: number;
    course_id: number;
    name: string;
  }
  

  
  export interface BlockSectionProps {
    block: Block;
    setModals: Dispatch<SetStateAction<{ block: boolean }>>;
    handleOpenBlockModal: (block: Block | null) => void;
  }
  