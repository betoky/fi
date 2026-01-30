import { ExpenseList } from '@/components/expense/list/expense-list';
import { Expenses as ExpService } from '@/services/expense/expenses';
import { Items } from '@/services/expense/items';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-expenses',
  imports: [ExpenseList],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnInit, OnDestroy {
  public items = inject(Items);
  private service = inject(ExpService);

  protected asideOpened = signal(false);

  ngOnInit(): void {
    const date = new Date();
    // date.setDate(date.getDate() - 6);
    console.log(date);
    this.service.summary(date, 'week').then((data) => console.log(data));
  }

  ngOnDestroy(): void {
    this.items.reset();
  }
}
