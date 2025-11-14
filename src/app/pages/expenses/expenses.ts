import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ExpenseViewGroupType, ExpenseViewType } from '../../domain/expense';
import { Expense } from '../../services/expense/expense';
import { ExpenseForm } from '../../components/expense-form/expense-form';
import { ExpenseCard } from "../../components/expense-card/expense-card";
import { ExpenseCardSkeleton } from "../../components/expense-card-skeleton/expense-card-skeleton";

@Component({
  selector: 'app-expenses',
  imports: [Button, ExpenseCard, SkeletonModule, ExpenseCardSkeleton],
  providers: [DialogService],
  templateUrl: './expenses.html',
})
export class Expenses implements OnInit {
  private ref: DynamicDialogRef<ExpenseForm> | null = null;
  public dialog = inject(DialogService);
  private expense = inject(Expense);

  protected expenses: WritableSignal<(ExpenseViewType|ExpenseViewGroupType)[]|undefined> = signal(undefined);

  get Array() {
    return Array;
  }

  ngOnInit(): void {
    this.expense.fetchExpenseForView().then(data => this.expenses.set(data));
  }

  protected openModal() {
    this.ref = this.dialog.open(ExpenseForm, {
      modal: true,
      showHeader: false,
      contentStyle: {
        paddingTop: '1.5rem',
      },
      draggable: false,
      styleClass: 'mx-4',
    });
  }
}
