import { Routes } from '@angular/router';
import { KanbanBoardComponent } from './pages/kanban-board/kanban-board.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
export const routes: Routes = [
  { path: '', redirectTo: '/board', pathMatch: 'full' },
  { path: 'board', component: KanbanBoardComponent },
  { path: 'new', component: TaskFormComponent },
  { path: 'task/:id', component: TaskFormComponent },
  { path: '**', redirectTo: '/board' }
];
