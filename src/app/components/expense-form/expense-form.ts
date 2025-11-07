import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MaterialIcon } from '../icons/material-icon/material-icon';

@Component({
  selector: 'app-expense-form',
  imports: [MaterialIcon],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  private dialogRef = inject(DialogRef, { optional: true });

  protected closeModal() {
    this.dialogRef?.close();
  }
}
