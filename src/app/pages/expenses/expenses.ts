import { ExpenseList } from '@/components/expense/list/expense-list';
import { Items } from '@/services/expense/items';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ExpenseCatSummary } from '@/components/expense/chart/categories';
import { ExpAnnualSummary } from "@/components/expense/chart/annual";

@Component({
  selector: 'app-expenses',
  imports: [ExpenseList, ExpenseCatSummary, ExpAnnualSummary],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnDestroy {
  public items = inject(Items);

  protected asideOpened = signal(false);

  ngOnDestroy(): void {
    this.items.reset();
  }
}
