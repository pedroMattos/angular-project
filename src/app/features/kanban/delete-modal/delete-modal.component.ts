import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent {
  @Input() task: Task | null = null;
  @Output() confirm = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    if (this.task) {
      this.confirm.emit(this.task);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
