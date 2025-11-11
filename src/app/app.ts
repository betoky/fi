import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeSwitcher } from './services/dark-mode-switcher';
import { Auth } from './services/auth';
import { User } from './services/user';
import { CategoryService as ExpenseCategory } from './services/expense/category.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private darkModeSwitcher = inject(DarkModeSwitcher);
  private auth$ = inject(Auth).isAuthenticated$;
  private user = inject(User);
  private expenseCategory = inject(ExpenseCategory);

  constructor() {
    this.auth$.subscribe({
      next: (authenticated) => {
        if (!authenticated) {
          this.user.resetCurrentUser();
          this.expenseCategory.reset();
        }
      },
    });
  }

  ngOnInit(): void {
    this.darkModeSwitcher.init();
  }
}
