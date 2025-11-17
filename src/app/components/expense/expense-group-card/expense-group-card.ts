import { Component, inject, Input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ExpenseViewGroupType } from '../../../domain/expense';
import { DatePipe } from '../../../pipes/date-pipe';
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { Alert } from '../../../services/alert';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { ConfirmDialog } from '../../../services/confirm-dialog';
import { TableModule } from "primeng/table";
import { ExpenseCardControl } from "../expense-card-control/expense-card-control";

@Component({
  selector: 'expense-group-card',
  imports: [DatePipe, ButtonModule, CurrencyPipe, TableModule, ExpenseCardControl],
  templateUrl: './expense-group-card.html',
  styleUrl: './../expense-card.css',
})
export class ExpenseGroupCard {
  @Input({ required: true }) expense!: ExpenseViewGroupType;

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private listing = inject(ExpenseListing);

  protected collapse = signal(false);

  editExpGroup(): void {
    throw new Error('Method not implemented.');
  }

  deleteExpGroup() {
    this.dialogSrv.confirmDelete('Allez-vous supprimer cette dépense?').then((confirmed) => {
      confirmed &&
        this.listing
          .removeGroupedExpense(this.expense.id)
          .then(() => this.alert.success({ detail: 'Une dépense a été supprimée.' }))
          .catch(() => this.alert.error({ detail: 'Erreur de suppression' }));
    });
  }
}
