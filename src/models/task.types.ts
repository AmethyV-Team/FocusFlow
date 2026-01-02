export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  effort: number; // Estimated hours
  status: TaskStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}
