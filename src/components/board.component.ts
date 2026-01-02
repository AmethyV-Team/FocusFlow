import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { TaskCardComponent } from './task-card.component';
import { TaskStatus, Task } from '../models/task.types';

@Component({
  selector: 'app-board',
  imports: [CommonModule, TaskCardComponent],
  template: `
    <div class="flex h-full gap-6 overflow-x-auto pb-4 custom-scrollbar px-6">
      @for (column of columns; track column.id) {
        <div 
          class="flex-shrink-0 w-80 flex flex-col h-full rounded-xl transition-colors duration-200"
          [class.bg-slate-100]="dragOverColumnId !== column.id"
          [class.bg-indigo-50]="dragOverColumnId === column.id"
          (dragover)="onDragOver($event, column.id)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event, column.id)"
        >
          <!-- Column Header -->
          <div class="p-4 flex items-center justify-between sticky top-0 bg-inherit rounded-t-xl z-10">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" [style.background-color]="column.color"></div>
              <h3 class="font-bold text-slate-700">{{ column.title }}</h3>
              <span class="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {{ getTasksByStatus(column.id).length }}
              </span>
            </div>
          </div>

          <!-- Task List -->
          <div class="flex-1 overflow-y-auto px-3 pb-4 space-y-3 custom-scrollbar">
            @for (task of getTasksByStatus(column.id); track task.id) {
              <app-task-card 
                [task]="task" 
                [isAtRisk]="isTaskAtRisk(task)"
                (delete)="taskService.deleteTask($event)"
              ></app-task-card>
            }
            <!-- Empty State -->
            @if (getTasksByStatus(column.id).length === 0) {
              <div class="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                No tasks
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class BoardComponent {
  taskService = inject(TaskService);
  
  columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog', color: '#94a3b8' },
    { id: 'in-progress', title: 'In Progress', color: '#3b82f6' },
    { id: 'review', title: 'Review', color: '#f59e0b' },
    { id: 'done', title: 'Done', color: '#22c55e' }
  ];

  dragOverColumnId: string | null = null;

  getTasksByStatus(status: TaskStatus) {
    return this.taskService.tasks().filter(t => t.status === status);
  }

  isTaskAtRisk(task: Task): boolean {
    return this.taskService.atRiskTasks().some(t => t.id === task.id);
  }

  onDragOver(event: DragEvent, columnId: string) {
    event.preventDefault(); // Allow drop
    this.dragOverColumnId = columnId;
  }

  onDragLeave(event: DragEvent) {
    // Basic implementation; often fires on child elements so checking relatedTarget is good practice
    // but for simplicity in this constrained env, we might just clear it on drop
  }

  onDrop(event: DragEvent, newStatus: TaskStatus) {
    event.preventDefault();
    this.dragOverColumnId = null;
    const taskId = event.dataTransfer?.getData('text/plain');
    
    if (taskId) {
      this.taskService.updateTaskStatus(taskId, newStatus);
    }
  }
}