import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Menu } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ExpenseViewType, ExpenseViewGroupType, isExpenseViewGroup } from '../../../domain/expense';
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { DatePipe } from '../../../pipes/date-pipe';
import { ExpenseListing } from '../../../services/expense/expense-listing';

@Component({
  selector: 'app-expense-card',
  imports: [
    CommonModule,
    ConfirmDialogModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    Menu,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './expense-card.html',
  styleUrl: './expense-card.css',
  providers: [ConfirmationService],
})
export class ExpenseCard {
  @Input({ required: true, alias: 'value' }) expense!: ExpenseViewType | ExpenseViewGroupType;

  private confirmSrv = inject(ConfirmationService);
  private listing = inject(ExpenseListing);
  private alert = inject(MessageService);

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
      command: () => this.confirmDelete(),
    },
  ];

  protected isViewGroup(expense: ExpenseViewType | ExpenseViewGroupType) {
    return isExpenseViewGroup(expense);
  }

  private editExpense() {
    throw 'TODO Edit method';
  }

  private deleteExpense() {
    this.listing
      .remove(this.expense.id)
      .then(() => {
        this.alert.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Une dépense a été supprimée.',
        });
      })
      .catch(() => {
        this.alert.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur de suppression',
        });
      });
  }

  private confirmDelete(): void {
    this.confirmSrv.confirm({
      position: 'top',
      header: 'Confirmation',
      message: 'Allez-vous supprimer cette dépense?',
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
      accept: () => {
        this.deleteExpense();
      },
    });
  }
}
