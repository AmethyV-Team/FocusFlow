import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task.types';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  template: `
    <div 
      class="bg-white p-3 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing group hover:shadow-md transition-all duration-200"
      [class.border-l-4]="true"
      [class.border-l-red-500]="isAtRisk()"
      [class.border-l-slate-200]="!isAtRisk() && task().priority === 'low'"
      [class.border-l-yellow-400]="!isAtRisk() && task().priority === 'medium'"
      [class.border-l-indigo-500]="!isAtRisk() && task().priority === 'high'"
      [class.ring-2]="isAtRisk()"
      [class.ring-red-100]="isAtRisk()"
      draggable="true"
      (dragstart)="onDragStart($event)"
    >
      <div class="flex justify-between items-start mb-1">
        <span class="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
          [class.bg-slate-100]="task().priority === 'low'"
          [class.text-slate-600]="task().priority === 'low'"
          [class.bg-yellow-50]="task().priority === 'medium'"
          [class.text-yellow-700]="task().priority === 'medium'"
          [class.bg-indigo-50]="task().priority === 'high'"
          [class.text-indigo-700]="task().priority === 'high'">
          {{ task().priority }}
        </span>
        <button (click)="delete.emit(task().id)" class="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h4 class="font-medium text-slate-800 text-sm mb-1 leading-snug">{{ task().title }}</h4>
      
      @if (task().description) {
        <p class="text-xs text-slate-500 mb-2 line-clamp-2">{{ task().description }}</p>
      }

      <div class="flex items-center justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-50 pt-2">
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ task().effort }}h est.</span>
        </div>
        
        @if (isAtRisk()) {
          <span class="flex items-center gap-1 text-red-500 font-bold animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            BURNOUT RISK
          </span>
        }
      </div>
    </div>
  `
})
export class TaskCardComponent {
  task = input.required<Task>();
  isAtRisk = input<boolean>(false);
  delete = output<string>();

  onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.task().id);
      event.dataTransfer.effectAllowed = 'move';
      // Create a nice drag image if desired, or let browser handle it
    }
  }
}