import { Injectable, signal } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Alert {
  private _message = signal<undefined | ToastMessageOptions>(undefined);

  object = this._message.asReadonly();

  success({ summary, detail }: { summary?: string; detail: string }) {
    this._message.set({ summary: summary ?? 'Succès', detail, severity: 'success' });
  }

  error({ summary, detail }: { summary?: string; detail: string }) {
    this._message.set({ summary: summary ?? 'Erreur', detail, severity: 'error' });
  }
}
