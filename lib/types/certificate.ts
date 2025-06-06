export interface Certificate {
  id: number;
  courseName: string;
  issueDate: string;
  certificateId: string;
  status: "completed" | "in-progress";
  color?: string;
}