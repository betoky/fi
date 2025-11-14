import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Menu } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ExpenseViewType, ExpenseViewGroupType, isExpenseViewGroup } from '../../../domain/expense';
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { DatePipe } from '../../../pipes/date-pipe';

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
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  protected collapse = signal(false);

  private confirmSrv = inject(ConfirmationService);

  protected controls: MenuItem[] = [
    {
      label: 'Modifier',
      icon: 'pi pi-pen-to-square',
      command: () => this.edit.next(),
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
        this.delete.next();
      },
    });
  }
}
