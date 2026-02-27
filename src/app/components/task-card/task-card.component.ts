import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.task);
  }

  getPriorityLabel(priority: TaskPriority): string {
    const labels = {
      'alta': 'Alta',
      'media': 'Média', 
      'baixa': 'Baixa'
    };
    return labels[priority];
  }

  getStatusLabel(status: string): string {
    const labels = {
      'todo': 'A Fazer',
      'doing': 'Em Progresso',
      'done': 'Concluído'
    };
    return labels[status as keyof typeof labels] || status;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  }
}
