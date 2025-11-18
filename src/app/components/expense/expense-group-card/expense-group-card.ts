import { Component, inject, Input } from '@angular/core';
import { TableModule } from "primeng/table";
import { ExpenseViewGroupType } from '../../../domain/expense';
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { Alert } from '../../../services/alert';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { ConfirmDialog } from '../../../services/confirm-dialog';
import { ExpenseCard } from "../expense-card/expense-card";

@Component({
  selector: 'expense-group-card',
  imports: [CurrencyPipe, ExpenseCard, TableModule],
  templateUrl: './expense-group-card.html',
})
export class ExpenseGroupCard {
  @Input({ required: true }) expense!: ExpenseViewGroupType;

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private listing = inject(ExpenseListing);

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
