import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task-modal',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" (click)="close.emit()">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" (click)="$event.stopPropagation()">
        <div class="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800">New Task</h2>
          <button (click)="close.emit()" class="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          
          <!-- Title -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Task Title</label>
            <input type="text" formControlName="title" placeholder="e.g. Fix Login Bug" 
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
            @if (taskForm.get('title')?.touched && taskForm.get('title')?.invalid) {
              <p class="text-red-500 text-xs mt-1">Title is required (min 3 chars)</p>
            }
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
            <textarea formControlName="description" rows="3" placeholder="Details about the task..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Priority -->
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
              <select formControlName="priority" 
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <!-- Effort -->
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Effort (Hours)</label>
              <input type="number" formControlName="effort" min="0.5" step="0.5"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
               @if (taskForm.get('effort')?.touched && taskForm.get('effort')?.invalid) {
                 <p class="text-red-500 text-xs mt-1">Required</p>
               }
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" [disabled]="taskForm.invalid" 
              class="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddTaskModalComponent {
  close = output<void>();
  save = output<any>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['medium', Validators.required],
      effort: [1, [Validators.required, Validators.min(0.1)]]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.save.emit(this.taskForm.value);
      this.close.emit();
    }
  }
}