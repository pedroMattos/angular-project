import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TaskService } from '../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task-form-container max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEditing() ? 'Editar Tarefa' : 'Nova Tarefa' }}
          </h1>
          <button 
            class="text-gray-500 hover:text-gray-700 transition-colors"
            (click)="cancel()"
            title="Voltar">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Título -->
          <div>
            <label for="titulo" class="block text-sm font-medium text-gray-700 mb-2">
              Título <span class="text-red-500">*</span>
            </label>
            <input
              id="titulo"
              type="text"
              formControlName="titulo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [class.border-red-500]="isFieldInvalid('titulo')"
              placeholder="Digite o título da tarefa">
            
            @if (isFieldInvalid('titulo')) {
              <div class="mt-1 text-sm text-red-600">
                @if (taskForm.get('titulo')?.errors?.['required']) {
                  O título é obrigatório
                }
                @if (taskForm.get('titulo')?.errors?.['minlength']) {
                  O título deve ter pelo menos 3 caracteres
                }
              </div>
            }
          </div>

          <!-- Descrição -->
          <div>
            <label for="descricao" class="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              formControlName="descricao"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              [class.border-red-500]="isFieldInvalid('descricao')"
              placeholder="Descreva os detalhes da tarefa (opcional)"></textarea>
            
            <div class="mt-1 flex justify-between text-sm">
              <div>
                @if (isFieldInvalid('descricao')) {
                  <span class="text-red-600">
                    @if (taskForm.get('descricao')?.errors?.['maxlength']) {
                      A descrição não pode ter mais de 500 caracteres
                    }
                  </span>
                }
              </div>
              <span class="text-gray-500">
                {{ getDescriptionLength() }}/500
              </span>
            </div>
          </div>

          <!-- Prioridade -->
          <div>
            <label for="prioridade" class="block text-sm font-medium text-gray-700 mb-2">
              Prioridade <span class="text-red-500">*</span>
            </label>
            <select
              id="prioridade"
              formControlName="prioridade"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [class.border-red-500]="isFieldInvalid('prioridade')">
              <option value="" disabled>Selecione uma prioridade</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            
            @if (isFieldInvalid('prioridade')) {
              <div class="mt-1 text-sm text-red-600">
                A prioridade é obrigatória
              </div>
            }
          </div>

          <!-- Status (apenas ao editar) -->
          @if (isEditing()) {
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                formControlName="status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="todo">A Fazer</option>
                <option value="doing">Em Progresso</option>
                <option value="done">Concluído</option>
              </select>
            </div>
          }

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
              (click)="cancel()">
              Cancelar
            </button>
            
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="taskForm.invalid || isSubmitting()">
              
              @if (isSubmitting()) {
                <span class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              } @else {
                {{ isEditing() ? 'Atualizar' : 'Criar' }} Tarefa
              }
            </button>
          </div>
          
        </form>
      </div>

      <!-- Success Message -->
      @if (successMessage()) {
        <div class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-lg z-50">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            {{ successMessage() }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
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
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descricao: ['', [Validators.maxLength(500)]],
    prioridade: ['', Validators.required],
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
        titulo: task.titulo,
        descricao: task.descricao || '',
        prioridade: task.prioridade,
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
      titulo: formValue.titulo!,
      descricao: formValue.descricao || undefined,
      prioridade: formValue.prioridade as TaskPriority,
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
    return this.taskForm.get('descricao')?.value?.length || 0;
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
