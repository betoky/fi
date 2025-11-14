import { Component, inject } from '@angular/core';
import { ExpenseCard } from "../expense-card/expense-card";
import { ExpenseCardSkeleton } from "../expense-card-skeleton/expense-card-skeleton";
import { ExpenseListing } from '../../../services/expense/expense-listing';

@Component({
  selector: 'app-expense-list',
  imports: [ExpenseCard, ExpenseCardSkeleton],
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  private listing = inject(ExpenseListing);

  protected expenses = this.listing.expenses;

  get Array() {
    return Array;
  }

  ngOnInit(): void {
    this.listing.fetchData();
  }
}
