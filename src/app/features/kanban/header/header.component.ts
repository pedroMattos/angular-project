import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
})

export class HeaderComponent {
  private readonly router = inject(Router);
  
  createNewTask(): void {
    this.router.navigate(['/new']);
  }
}
