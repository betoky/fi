import { ExpenseBaseCard } from '@/components/expense/card/base';
import { ExpenseType, UpdateExpenseType } from '@/domains/expense';
import { PriceInfo, ExpenseDetail, UpdateExpDetail } from '@/domains/expense-detail';
import { DatePipe } from '@/pipes/date-pipe';
import { Alert } from '@/services/alert';
import { Expenses } from '@/services/expense/expenses';
import { Expense } from '@/services/supabase/expense';
import { formatBadge } from '@/utils/expense';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'exp-simple-card',
  imports: [Button, DatePipe, Dialog, ExpenseBaseCard, FormsModule, InputNumber, Textarea],
  templateUrl: './simple.html',
})
export class ExpenseSimpleCard implements OnInit {
  expense = input.required<ExpenseType>();

  protected displayForm = signal(false);
  protected details = signal<ExpenseDetail | undefined>(undefined);
  protected badge = computed(() => {
    const count = this.expense().count;
    const quantity = this.details()?.quantity;
    const unit = this.details()?.article.unit;
    return formatBadge(count, quantity, unit);
  });

  private alert = inject(Alert);
  private database = inject(Expense);
  private listing = inject(Expenses);

  ngOnInit(): void {
    this.database
      .fetchDetails(this.expense().id)
      .then((data) => this.details.set(data[0]))
      .catch(() => this.alert.error({ detail: 'Impossible de récupérer des données' }));
  }

  updateExp(event: NgForm) {
    if (event.valid) {
      const {
        description: d,
        amount,
        quantity,
      } = event.value as PriceInfo & { description: string | null };
      const details2Up = {} as UpdateExpDetail;
      const exp2Up = {} as UpdateExpenseType;
      if (d !== this.expense().description) {
        exp2Up.description = d && d.length > 0 ? d : null;
      }
      if (this.expense().amount !== amount) {
        details2Up.amount = amount;
        exp2Up.amount = amount;
      }
      if (this.details()?.quantity !== quantity) {
        details2Up.quantity = quantity;
        exp2Up.count = quantity;
      }

      if (Array.from(Object.keys(details2Up)).length > 0) {
        this.database
          .updateDetail(this.details()!.id, details2Up)
          .then((updated) => this.details.set({ ...this.details()!, ...updated }))
          .catch(() => this.alert.error({ detail: 'La modification a échoué.' }));
      }

      if (Array.from(Object.keys(exp2Up)).length > 0) {
        this.listing
          .updateExpense(this.expense().id, exp2Up)
          .catch(() => this.alert.error({ detail: 'La modification a échoué.' }));
      }

      this.displayForm.set(false);
    }
  }
}
