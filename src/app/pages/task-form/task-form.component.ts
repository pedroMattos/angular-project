import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TaskService } from '../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { TaskFormHeaderComponent } from '../../features/task-form/header/header.component';
import { TaskFormActionsComponent } from '../../features/task-form/actions/actions.component';
import { TaskFormStatusEditComponent } from '../../features/task-form/status-edit/status-edit.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    TaskFormHeaderComponent,
    TaskFormActionsComponent,
    TaskFormStatusEditComponent
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);

  protected readonly isEditing = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly successMessage = signal<string>('');

  private taskId: string | null = null;

  protected readonly taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(500)]],
    priority: ['', Validators.required],
    status: ['todo']
  });

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    
    if (this.taskId) {
      this.isEditing.set(true);
      this.loadTask();
    }
  }

  private loadTask(): void {
    if (!this.taskId) return;
    
    const task = this.taskService.getTaskById(this.taskId);
    if (task) {
      this.taskForm.patchValue({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status
      });
    } else {
      this.showError('Tarefa não encontrada');
      this.router.navigate(['/board']);
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.taskForm.value;
    const taskData = {
      title: formValue.title!,
      description: formValue.description || undefined,
      priority: formValue.priority as TaskPriority,
      status: formValue.status as TaskStatus
    };

    try {
      if (this.isEditing() && this.taskId) {
        const success = this.taskService.updateTask(this.taskId, taskData);
        if (success) {
          this.showSuccess('Tarefa atualizada com sucesso!');
        } else {
          this.showError('Erro ao atualizar tarefa');
        }
      } else {
        this.taskService.createTask(taskData);
        this.showSuccess('Tarefa criada com sucesso!');
      }

      setTimeout(() => {
        this.router.navigate(['/board']);
      }, 1500);
      
    } catch (error) {
      this.showError('Erro ao salvar tarefa');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/board']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getDescriptionLength(): number {
    return this.taskForm.get('description')?.value?.length || 0;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      this.taskForm.get(key)?.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => {
      this.successMessage.set('');
    }, 3000);
  }

  private showError(message: string): void {
    console.error(message);
    // In a real app, you might want to show a toast notification or modal
  }
}
