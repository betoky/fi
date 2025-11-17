import { Component, inject, Input, signal } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { BadgeModule } from "primeng/badge";
import { DatePipe } from "../../../pipes/date-pipe";
import { CurrencyPipe } from "../../../pipes/currency-pipe";
import { ExpenseViewType } from '../../../domain/expense';
import { Alert } from '../../../services/alert';
import { ConfirmDialog } from '../../../services/confirm-dialog';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { ExpenseCardControl } from "../expense-card-control/expense-card-control";

@Component({
  selector: 'expense-simple-card',
  imports: [DatePipe, ButtonModule, BadgeModule, ExpenseCardControl, CurrencyPipe],
  templateUrl: './expense-simple-card.html',
  styleUrl: './../expense-card.css',
})
export class ExpenseSimpleCard {
  @Input({ required: true }) expense!: ExpenseViewType;

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private listing = inject(ExpenseListing);

  protected collapse = signal(false);

  editExp(): void {
    throw new Error('Method not implemented.');
  }

  deleteExp() {
    this.dialogSrv.confirmDelete('Allez-vous supprimer cette dépense?').then((confirmed) => {
      confirmed &&
        this.listing
          .removeSimpleExpense(this.expense.id)
          .then(() => this.alert.success({ detail: 'Une dépense a été supprimée.' }))
          .catch(() => this.alert.error({ detail: 'Erreur de suppression' }));
    });
  }
}
