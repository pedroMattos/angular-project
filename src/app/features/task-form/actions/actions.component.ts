import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actions.component.html'
})
export class TaskFormActionsComponent {
  @Input() isEditing: boolean = false;
  @Input() isSubmitting: boolean = false;
  @Input() isFormValid: boolean = false;
  @Output() cancel = new EventEmitter<void>();
  onCancel(): void {
    this.cancel.emit();
  }
}
