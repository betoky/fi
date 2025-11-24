import { Component, inject } from '@angular/core';
import { ExpenseCardSkeleton } from '../expense-card-skeleton/expense-card-skeleton';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { AsSimpleExpensePipe } from '../../../pipes/expense/as-simple-expense-pipe';
import { ExpenseSimpleCard } from '../expense-simple-card/expense-simple-card';
import { AsGroupExpensePipe } from '../../../pipes/expense/as-group-expense-pipe';
import { ExpenseGroupCard } from '../expense-group-card/expense-group-card';

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
