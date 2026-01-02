import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './services/task.service';
import { AiService } from './services/ai.service';
import { BoardComponent } from './components/board.component';
import { VelocityMeterComponent } from './components/velocity-meter.component';
import { AddTaskModalComponent } from './components/add-task-modal.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, BoardComponent, VelocityMeterComponent, AddTaskModalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  taskService = inject(TaskService);
  aiService = inject(AiService);

  showAddModal = signal(false);
  aiLoading = signal(false);
  aiAdvice = signal<string | null>(null);

  toggleAddModal() {
    this.showAddModal.update(v => !v);
  }

  addTask(taskData: any) {
    this.taskService.addTask(taskData);
  }

  async getAiInsight() {
    this.aiLoading.set(true);
    this.aiAdvice.set(null);
    
    const advice = await this.aiService.analyzeWorkflow(
      this.taskService.tasks(), 
      this.taskService.velocity()
    );
    
    this.aiAdvice.set(advice);
    this.aiLoading.set(false);
  }

  closeAiAdvice() {
    this.aiAdvice.set(null);
  }
}