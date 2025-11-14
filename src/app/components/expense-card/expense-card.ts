import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { ExpenseViewType, ExpenseViewGroupType, isExpenseViewGroup } from '../../domain/expense';
import { CurrencyPipe } from "../../pipes/currency-pipe";
import { DatePipe } from "../../pipes/date-pipe";

@Component({
  selector: 'app-expense-card',
  imports: [BadgeModule, ButtonModule, CardModule, CurrencyPipe, DatePipe, CommonModule],
  templateUrl: './expense-card.html',
  styleUrl: './expense-card.css'
})
export class ExpenseCard {
  @Input({required: true, alias: 'value'}) expense!: ExpenseViewType|ExpenseViewGroupType;

  protected collapse = signal(false);

  protected isViewGroup(expense: ExpenseViewType|ExpenseViewGroupType) {
    return isExpenseViewGroup(expense);
  }
}
