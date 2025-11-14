import { Component, inject, signal } from '@angular/core';
import { ExpenseViewType, ExpenseViewGroupType } from '../../../domain/expense';
import { Expense } from '../../../services/expense/expense';
import { ExpenseCard } from "../expense-card/expense-card";
import { ExpenseCardSkeleton } from "../expense-card-skeleton/expense-card-skeleton";

@Component({
  selector: 'app-expense-list',
  imports: [ExpenseCard, ExpenseCardSkeleton],
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  private expense = inject(Expense);

  protected expenses = signal<(ExpenseViewType | ExpenseViewGroupType)[] | undefined>(undefined);

  get Array() {
    return Array;
  }

  ngOnInit(): void {
    this.expense.fetchExpenseForView().then((data) => this.expenses.set(data));
  }
}
