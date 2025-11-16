import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Menu } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ExpenseViewType, ExpenseViewGroupType, isExpenseViewGroup } from '../../../domain/expense';
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { DatePipe } from '../../../pipes/date-pipe';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { Alert } from '../../../services/alert';
import { ConfirmDialog } from '../../../services/confirm-dialog';

@Component({
  selector: 'app-expense-card',
  imports: [
    CommonModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    Menu,
    TableModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './expense-card.html',
  styleUrl: './expense-card.css',
})
export class ExpenseCard {
  @Input({ required: true, alias: 'value' }) expense!: ExpenseViewType | ExpenseViewGroupType;

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private listing = inject(ExpenseListing);

  protected collapse = signal(false);

  protected controls: MenuItem[] = [
    {
      label: 'Modifier',
      icon: 'pi pi-pen-to-square',
      command: () => this.editExpense(),
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => this.deleteCommand(),
    },
  ];

  protected isViewGroup(expense: ExpenseViewType | ExpenseViewGroupType) {
    return isExpenseViewGroup(expense);
  }

  private editExpense() {
    throw 'TODO Edit method';
  }

  private deleteCommand() {
    this.dialogSrv.confirmDelete('Allez-vous supprimer cette dépense?').then((confirmed) => {
      confirmed && this.deleteExpense();
    });
  }

  private deleteExpense() {
    const request = isExpenseViewGroup(this.expense)
      ? this.listing.removeGroupedExpense(this.expense.id)
      : this.listing.removeSimpleExpense(this.expense.id);

    request
      .then(() => this.alert.success({ detail: 'Une dépense a été supprimée.' }))
      .catch(() => this.alert.error({ detail: 'Erreur de suppression' }));
  }
}
