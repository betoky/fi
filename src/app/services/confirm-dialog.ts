import { Injectable, signal } from '@angular/core';
import { Confirmation } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialog {
  private _object = signal<undefined|Confirmation>(undefined);

  object = this._object.asReadonly();

  confirmDelete(message: string) {
    return new Promise(resolve => {
      this._object.set({
        position: 'top',
        header: 'Confirmation',
        message,
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Annuler',
        rejectButtonProps: {
          label: 'NON',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'OUI',
          severity: 'danger',
        },
        accept: () => resolve(true),
        reject: () => resolve(false)
      })
    })
  }
}
