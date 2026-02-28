import { Injectable, computed, effect, signal } from '@angular/core';
import { Task, TaskStatus, TaskPriority, TaskFilters } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'kanban-tasks';
  
  private _tasks = signal<Task[]>(this.loadFromStorage());
  private _filters = signal<TaskFilters>({ search: '', priority: undefined });

  readonly tasks = this._tasks.asReadonly();
  readonly filters = this._filters.asReadonly();

  readonly filteredTasks = computed(() => {
    const tasks = this._tasks();
    const { search, priority } = this._filters();
    
    return tasks.filter(task => {
      const matchesSearch = !search || 
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesPriority = !priority || task.priority === priority;
      
      return matchesSearch && matchesPriority;
    });
  });

  readonly todoTasks = computed(() => 
    this.filteredTasks().filter(task => task.status === 'todo')
  );

  readonly doingTasks = computed(() => 
    this.filteredTasks().filter(task => task.status === 'doing')
  );

  readonly doneTasks = computed(() => 
    this.filteredTasks().filter(task => task.status === 'done')
  );

  readonly taskCounts = computed(() => ({
    todo: this.todoTasks().length,
    doing: this.doingTasks().length,
    done: this.doneTasks().length
  }));

  constructor() {
    effect(() => {
      this.saveToStorage(this._tasks());
    });
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date()
    };
    
    this._tasks.update(tasks => [...tasks, newTask]);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): boolean {
    const taskIndex = this._tasks().findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    this._tasks.update(tasks => 
      tasks.map((task, index) => 
        index === taskIndex ? { ...task, ...updates } : task
      )
    );
    return true;
  }

  deleteTask(id: string): boolean {
    const initialLength = this._tasks().length;
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
    return this._tasks().length < initialLength;
  }

  moveTask(id: string, newStatus: TaskStatus): boolean {
    return this.updateTask(id, { status: newStatus });
  }

  getTaskById(id: string): Task | undefined {
    return this._tasks().find(task => task.id === id);
  }

  updateFilters(filters: Partial<TaskFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({ search: '', priority: undefined });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private loadFromStorage(): Task[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    } catch {
      return [];
    }
  }

  private saveToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }
}
