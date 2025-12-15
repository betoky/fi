import { Component, OnInit, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Alert } from '@/services/alert';
import { ConfirmDialog } from '@/services/confirm-dialog';
import { DarkModeSwitcher } from '@/services/dark-mode-switcher';

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
