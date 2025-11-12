import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeSwitcher } from './services/dark-mode-switcher';
import { Auth } from './services/auth';
import { Home } from './services/home';
import { User } from './services/user';
import { CategoryService as ExpenseCategory } from './services/expense/category.service';
import { ItemService } from './services/expense/item.service';

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
  private home = inject(Home);
  private expenseCategory = inject(ExpenseCategory);
  private expenseItem = inject(ItemService);

  constructor() {
    this.auth$.subscribe({
      next: (authenticated) => {
        if (!authenticated) {
          this.user.resetCurrentUser();
          this.home.resetCurrentHome();
          this.expenseCategory.reset();
          this.expenseItem.reset();
        }
      },
    });
  }

  ngOnInit(): void {
    this.darkModeSwitcher.init();
  }
}
