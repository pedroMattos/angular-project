import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class TaskFormHeaderComponent {
  @Input() isEditing: boolean = false;
  @Output() cancel = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }
}
