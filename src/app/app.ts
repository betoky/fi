import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DarkModeSwitcher } from './services/dark-mode-switcher';
import { Alert } from './services/alert';
import { Auth } from './services/auth';
import { Home } from './services/home';
import { User } from './services/user';
import { AutocompleteCategories } from './services/expense/autocomplete-categories';
import { ConfirmDialog } from './services/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [ConfirmationService, MessageService],
})
export class App implements OnInit {
  private darkModeSwitcher = inject(DarkModeSwitcher);
  private auth$ = inject(Auth).isAuthenticated$;
  private user = inject(User);
  private home = inject(Home);
  private autoComleteCategories = inject(AutocompleteCategories);

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

    // Auth Subscription
    this.auth$.subscribe({
      next: (authenticated) => {
        if (!authenticated) {
          this.user.resetCurrentUser();
          this.home.resetCurrentHome();
          this.autoComleteCategories.reset();
        }
      },
    });
  }

  ngOnInit(): void {
    this.darkModeSwitcher.init();
  }
}
