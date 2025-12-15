import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DarkModeSwitcher } from './services/dark-mode-switcher';
import { Alert } from './services/alert';
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
  }

  ngOnInit(): void {
    this.darkModeSwitcher.init();
  }
}
