import { Component, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { ExpenseForm } from '../../components/expense-form/expense-form';

@Component({
  selector: 'app-expenses',
  imports: [Button],
  providers: [DialogService],
  templateUrl: './expenses.html',
})
export class Expenses {
  private ref: DynamicDialogRef<ExpenseForm> | null = null;
  public dialog = inject(DialogService);

  protected openModal() {
    this.ref = this.dialog.open(ExpenseForm, {
      modal: true,
      showHeader: false,
      contentStyle: {
        paddingTop: '1.5rem',
      },
      draggable: false,
      styleClass: 'mx-4',
    });
  }
}
