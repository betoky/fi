import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ExpenseCard } from '@/components/expense/expense-card/expense-card';
import { ExpenseForm } from '@/components/expense/expense-form/expense-form';
import { ExpenseGroupType, ExpGrpItemType } from '@/domains/expense-group';
import { CurrencyPipe } from '@/pipes/currency-pipe';
import { Alert } from '@/services/alert';
import { ConfirmDialog } from '@/services/confirm-dialog';
import { ExpenseGroup } from '@/services/expense/expense-group';
import { ExpenseListing } from '@/services/expense/expense-listing';

@Component({
  selector: 'expense-group-card',
  imports: [CurrencyPipe, ExpenseCard, TableModule, Skeleton],
  templateUrl: './expense-group-card.html',
})
export class ExpenseGroupCard implements OnInit, OnDestroy {
  expense = input.required<ExpenseGroupType>();

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private modal = inject(DialogService);
  private listing = inject(ExpenseListing);
  private expenseGroup = inject(ExpenseGroup);
  protected items = signal<ExpGrpItemType[]>([]);
  protected fetched = signal(false);

  ngOnInit() {
    this.items.set(Array.from({ length: this.expense().count }).map(() => ({} as ExpGrpItemType)));
  }

  private unsubForm = new Subject<void>();
  ngOnDestroy(): void {
    this.unsubForm.next();
  }

  onCollapse(collapsed: boolean) {
    if (!this.fetched() && collapsed) {
      this.fetchGroupItems();
    }
  }

  fetchGroupItems() {
    this.expenseGroup
      .fetchGroupItems(this.expense().id)
      .then((data) => this.items.set(data))
      .catch(() => {
        this.alert.error({ detail: 'Erreur lors de la récupération des détails des dépenses.' });
        this.items.set([]);
      })
      .finally(() => this.fetched.set(true));
  }

  editExpGroup(): void {
    this.modal
      .open(ExpenseForm, {
        modal: true,
        showHeader: false,
        contentStyle: {
          paddingTop: '1.5rem',
        },
        draggable: false,
        styleClass: 'mx-4',
        inputValues: {
          group: this.expense(),
          items: this.fetched() ? this.items() : undefined,
        },
      })
      ?.onClose.pipe(takeUntil(this.unsubForm))
      .subscribe({
        next: (success) => {
          this.unsubForm.next();
          if (success) this.fetchGroupItems();
        },
      });
  }

  deleteExpGroup() {
    this.dialogSrv.confirmDelete('Allez-vous supprimer cette dépense?').then((confirmed) => {
      confirmed &&
        this.listing
          .removeGroupExpense(this.expense().id)
          .then(() => this.alert.success({ detail: 'Une dépense a été supprimée.' }))
          .catch(() => this.alert.error({ detail: 'Erreur de suppression' }));
    });
  }
}
