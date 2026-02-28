import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html'
})
export class FiltersComponent {
  protected readonly taskService = inject(TaskService);

  onPriorityFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const priority = target.value || undefined;
    this.taskService.updateFilters({ 
      priority: priority as any
    });
  }

  hasActiveFilters(): boolean {
    const filters = this.taskService.filters();
    return !!(filters.search || filters.priority);
  }

  clearFilters(): void {
    this.taskService.clearFilters();
  }
}
