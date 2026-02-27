import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  protected readonly taskService = inject(TaskService);

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.taskService.updateFilters({ search: target.value });
  }
}
