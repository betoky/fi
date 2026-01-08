import { Component, input } from '@angular/core';
import { ExpenseType } from '@/domains/expense';
import { ExpenseGroupCard } from '@/components/expense/card/group';
import { ExpenseSimpleCard } from '@/components/expense/card/simple';

@Component({
  selector: 'expense-card',
  imports: [ExpenseGroupCard, ExpenseSimpleCard],
  template: `
    @if (expense().as_group) {
      <exp-group-card [expense]="expense()" />
    } @else {
      <exp-simple-card [expense]="expense()" />
    }
  `,
})
export class ExpenseCard {
  expense = input.required<ExpenseType>();
}
