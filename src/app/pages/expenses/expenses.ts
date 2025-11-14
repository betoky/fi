import { Component, inject, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { ExpenseForm } from '../../components/expense/expense-form/expense-form';
import { ExpenseList } from '../../components/expense/expense-list/expense-list';
import { ExpenseListing } from '../../services/expense/expense-listing';

@Component({
  selector: 'app-expenses',
  imports: [Button, ExpenseList],
  providers: [DialogService],
  templateUrl: './expenses.html',
})
export class Expenses implements OnDestroy {
  public dialog = inject(DialogService);
  private destroy$ = new Subject<void>();
  private expenseListing = inject(ExpenseListing);

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  protected openExpenseForm() {
    this.dialog
      .open(ExpenseForm, {
        modal: true,
        showHeader: false,
        contentStyle: {
          paddingTop: '1.5rem',
        },
        draggable: false,
        styleClass: 'mx-4',
      })
      ?.onClose.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (submitted) => {
          if (submitted) {
            this.expenseListing.fetchData();
            this.destroy$.next();
          }
        },
      });
  }
}
