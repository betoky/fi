import { Component, inject } from '@angular/core';
import { ExpenseCardSkeleton } from '@/components/expense/expense-card-skeleton/expense-card-skeleton';
import { ExpenseGroupCard } from '@/components/expense/expense-group-card/expense-group-card';
import { ExpenseSimpleCard } from '@/components/expense/expense-simple-card/expense-simple-card';
import { AsGroupExpensePipe } from '@/pipes/expense/as-group-expense-pipe';
import { AsSimpleExpensePipe } from '@/pipes/expense/as-simple-expense-pipe';
import { ExpenseListing } from '@/services/expense/expense-listing';

@Component({
  selector: 'app-expense-list',
  imports: [
    ExpenseCardSkeleton,
    AsSimpleExpensePipe,
    ExpenseSimpleCard,
    AsGroupExpensePipe,
    ExpenseGroupCard,
  ],
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  private listing = inject(ExpenseListing);

  protected expenses = this.listing.expenses;

  get skeletons () {
    return Array.from({ length: 6 });
  }

  ngOnInit(): void {
    this.listing.fetchData();
  }
}
