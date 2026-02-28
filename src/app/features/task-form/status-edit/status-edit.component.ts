import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-form-status-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './status-edit.component.html'
})
export class TaskFormStatusEditComponent {
  @Input({ required: true }) taskForm!: FormGroup;
  @Input() isEditing: boolean = false;

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
