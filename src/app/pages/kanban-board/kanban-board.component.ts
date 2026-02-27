import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { HeaderComponent } from "../../features/kanban/header/header.component";
import { SearchBarComponent } from "../../features/kanban/search-bar/search-bar.component";
import { FiltersComponent } from "../../features/kanban/filters/filters.component";
import { DeleteModalComponent } from "../../features/kanban/delete-modal/delete-modal.component";

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    TaskCardComponent,
    EmptyStateComponent,
    HeaderComponent,
    SearchBarComponent,
    FiltersComponent,
    DeleteModalComponent
],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.css'
})
export class KanbanBoardComponent {
  protected readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  
  protected readonly taskToDelete = signal<Task | null>(null);

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromContainer(event.container);
      
      if (newStatus && task) {
        this.taskService.moveTask(task.id, newStatus);
      }
    }
  }

  private getStatusFromContainer(container: any): TaskStatus | null {
    const data = container.data;

    switch (data) {
      case this.taskService.todoTasks():
        return 'todo';
      case this.taskService.doingTasks():
        return 'doing';
      case this.taskService.doneTasks():
        return 'done';
      default:
        return null;
    }
  }

  editTask(task: Task): void {
    this.router.navigate(['/task', task.id]);
  }

  confirmDeleteTask(task: Task): void {
    this.taskToDelete.set(task);
  }

  onDeleteConfirm(task: Task): void {
    this.taskService.deleteTask(task.id);
    this.taskToDelete.set(null);
  }

  onDeleteCancel(): void {
    this.taskToDelete.set(null);
  }

}
