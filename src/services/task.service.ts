import { Injectable, signal, computed, effect } from '@angular/core';
import { Task, TaskStatus } from '../models/task.types';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Initial Seed Data
  private initialTasks: Task[] = [
    { id: '1', title: 'Setup Repo', priority: 'high', effort: 0.5, status: 'done', createdAt: Date.now() - 10000000, completedAt: Date.now() - 300000 },
    { id: '2', title: 'Design Database', priority: 'high', effort: 2, status: 'review', createdAt: Date.now() - 8000000, startedAt: Date.now() - 7000000 },
    { id: '3', title: 'Implement Auth', priority: 'medium', effort: 3, status: 'in-progress', createdAt: Date.now() - 3600000, startedAt: Date.now() - 3500000 }, // At risk example
    { id: '4', title: 'Build Landing Page', priority: 'low', effort: 4, status: 'backlog', createdAt: Date.now() },
  ];

  tasks = signal<Task[]>(this.initialTasks);
  
  // Real-time signal for "now" to trigger burnout checks
  now = signal<number>(Date.now());

  constructor() {
    // Update "now" every minute to refresh burnout status
    setInterval(() => {
      this.now.set(Date.now());
    }, 60000);
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'status'>) {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      status: 'backlog',
      createdAt: Date.now()
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    this.tasks.update(tasks => tasks.map(t => {
      if (t.id !== taskId) return t;
      
      const updates: Partial<Task> = { status: newStatus };
      
      // Handle timestamps
      if (newStatus === 'in-progress' && t.status !== 'in-progress') {
        updates.startedAt = Date.now();
      }
      if (newStatus === 'done' && t.status !== 'done') {
        updates.completedAt = Date.now();
      }
      
      return { ...t, ...updates };
    }));
  }

  deleteTask(taskId: string) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
  }

  // Computed: Tasks completed in the last hour
  velocity = computed(() => {
    const oneHourAgo = this.now() - 3600000;
    return this.tasks().filter(t => 
      t.status === 'done' && 
      t.completedAt && 
      t.completedAt > oneHourAgo
    ).length;
  });

  // Computed: Tasks that are "At Risk" (In Progress > 1.5x Effort)
  atRiskTasks = computed(() => {
    const currentNow = this.now();
    return this.tasks().filter(t => {
      if (t.status !== 'in-progress' || !t.startedAt) return false;
      const timeSpentHours = (currentNow - t.startedAt) / 3600000; // ms to hours
      return timeSpentHours > (t.effort * 1.5);
    });
  });
}