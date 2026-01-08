import { ExpenseBaseCard } from '@/components/expense/card/base';
import { ExpenseForm } from '@/components/expense/form/expense-form';
import { ExpenseType } from '@/domains/expense';
import { ExpenseDetail } from '@/domains/expense-detail';
import { CurrencyPipe } from '@/pipes/currency-pipe';
import { Alert } from '@/services/alert';
import { Expense } from '@/services/supabase/expense';
import { hasMoreElement } from '@/utils/number';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'exp-group-card',
  imports: [CurrencyPipe, ExpenseBaseCard, FormsModule, Skeleton, TableModule],
  templateUrl: './group.html',
})
export class ExpenseGroupCard implements OnInit {
  expense = input.required<ExpenseType>();

  // protected badge = signal<string | undefined>(undefined);
  protected details = signal<ExpenseDetail[]>([]);
  protected badge = computed(() => this.expense().count + ' articles')
  protected fetched = signal(false);

  private alert = inject(Alert);
  private database = inject(Expense);
  private modal = inject(DialogService);
  private modalSubscription = new Subject<void>();

  hasMore(n: number) {
    return hasMoreElement(n);
  }

  ngOnInit(): void {
    const count = this.expense().count;
    this.details.set(Array.from({ length: this.expense().count }).map(() => ({} as ExpenseDetail)));
  }

  onCollapse(collapsed: boolean) {
    if (!this.fetched() && collapsed) {
      this.fetchDetails();
    }
  }

  openModal() {
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
          expense: this.expense(),
          details: this.fetched() ? this.details() : undefined,
        },
      })
      ?.onClose.pipe(takeUntil(this.modalSubscription))
      .subscribe({
        next: (success) => {
          this.modalSubscription.next();
          if (success) this.fetchDetails();
        },
      });
  }

  private fetchDetails() {
    this.database
      .fetchDetails(this.expense().id)
      .then((data) => this.details.set(data))
      .catch(() => {
        this.alert.error({ detail: 'Erreur lors de la récupération des détails des dépenses.' });
        this.details.set([]);
      })
      .finally(() => this.fetched.set(true));
  }
}
