import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { ExpenseGroupedType, ExpenseGroupType } from '../../../domain/expense-group';
import { ExpenseItemType } from '../../../domain/expense-item';
import { Alert } from '../../../services/alert';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { ConfirmDialog } from '../../../services/confirm-dialog';
import { ExpenseCard } from '../expense-card/expense-card';
import { ExpenseGroup } from '../../../services/expense/expense-group';

type ArticleType = ExpenseGroupedType & { article: ExpenseItemType };

@Component({
  selector: 'expense-group-card',
  imports: [CurrencyPipe, ExpenseCard, TableModule, Skeleton],
  templateUrl: './expense-group-card.html',
})
export class ExpenseGroupCard implements OnInit {
  @Input({ required: true }) expense!: ExpenseGroupType;

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private listing = inject(ExpenseListing);
  private expenseGroup = inject(ExpenseGroup);
  protected items = signal<ArticleType[]>([]);
  protected fetched = signal(false);

  ngOnInit() {
    this.items.set(
      Array.from({ length: this.expense.count }).map(() => ({} as ArticleType))
    );
  }

  onCollapse(collapsed: boolean) {
    if (!this.fetched() && collapsed) {
      this.expenseGroup
        .fetchGroupItems(this.expense.id)
        .then((data) => this.items.set(data))
        .catch(() => {
          this.alert.error({ detail: 'Erreur lors de la récupération des détails des dépenses.' });
          this.items.set([]);
        })
        .finally(() => this.fetched.set(true));
    }
  }

  editExpGroup(): void {
    throw new Error('Method not implemented.');
  }

  deleteExpGroup() {
    this.dialogSrv.confirmDelete('Allez-vous supprimer cette dépense?').then((confirmed) => {
      confirmed &&
        this.listing
          .removeGroupExpense(this.expense.id)
          .then(() => this.alert.success({ detail: 'Une dépense a été supprimée.' }))
          .catch(() => this.alert.error({ detail: 'Erreur de suppression' }));
    });
  }
}
