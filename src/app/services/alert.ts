import { Injectable, signal } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Alert {
  private _message = signal<undefined | ToastMessageOptions>(undefined);

  object = this._message.asReadonly();

  success({ detail, life, summary }: ToastMessageOptions) {
    this._message.set({ summary: summary ?? 'Succès', detail, severity: 'success', life: life ?? 3000 });
  }

  error({ detail, life, summary }: ToastMessageOptions) {
    this._message.set({ summary: summary ?? 'Erreur', detail, severity: 'error', life: life ?? 3000 });
  }

  warn({ detail, life, summary }: ToastMessageOptions) {
    this._message.set({ summary: summary ?? 'Warning', detail, severity: 'warn', life: life ?? 3000 });
  }
}
