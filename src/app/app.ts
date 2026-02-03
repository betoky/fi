import { Component, OnInit, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Alert } from '@/services/alert';
import { Auth } from '@/services/auth';
import { Categories } from '@/services/expense/categories';
import { ConfirmDialog } from '@/services/confirm-dialog';
import { DarkModeSwitcher } from '@/services/dark-mode-switcher';
import { Home } from '@/services/supabase/home';
import { User } from '@/services/supabase/user';
import { ExpenseSummary } from '@/services/expense/annual-summary';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [ConfirmationService, MessageService],
})
export class App implements OnInit {
  private darkModeSwitcher = inject(DarkModeSwitcher);
  private categories = inject(Categories);
  private expSummary = inject(ExpenseSummary);
  private home = inject(Home);
  private user = inject(User);
  private isAuth$ = inject(Auth).isAuthenticated$

  constructor(
    alert: Alert,
    messageSrv: MessageService,
    confirm: ConfirmDialog,
    confirmSrv: ConfirmationService
  ) {
    // Alert subscription
    effect(() => {
      const message = alert.object();
      if (message) {
        messageSrv.add(message);
      }
    });

    // Dialog subscription
    effect(() => {
      const dialog = confirm.object();
      if (dialog) {
        confirmSrv.confirm(dialog);
      }
    });

    this.isAuth$.subscribe({
      next: isAuth => {
        if (isAuth) {
          this.syncHome();
          this.syncUser();
        } else {
          this.home.instance.set(undefined);
          this.user.instance.set(undefined);
          this.categories.reset();
          this.expSummary.reset();
        }
      }
    })
  }

  ngOnInit(): void {
    this.darkModeSwitcher.init();
  }

  private syncUser() {
    this.user
      .getUser()
      .then((user) => this.user.instance.set(user))
      .catch(() => this.user.instance.set(undefined));
  }

  private syncHome() {
    this.home
      .getHome()
      .then((data) => {
        this.home.instance.set(data);
        console.log(data);
      })
      .catch(() => this.home.instance.set(undefined));
  }
}
