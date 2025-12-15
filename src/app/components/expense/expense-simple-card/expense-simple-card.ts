import { Component, Input, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ExpenseCard } from '@/components/expense/expense-card/expense-card';
import { ExpenseArticleType } from '@/domains/expense';
import { DatePipe } from '@/pipes/date-pipe';
import { Alert } from '@/services/alert';
import { ConfirmDialog } from '@/services/confirm-dialog';
import { ExpenseListing } from '@/services/expense/expense-listing';

@Component({
  selector: 'expense-simple-card',
  imports: [
    FormsModule,
    ButtonModule,
    BadgeModule,
    Dialog,
    InputNumberModule,
    TextareaModule,
    ExpenseCard,
    DatePipe,
  ],
  templateUrl: './expense-simple-card.html',
})
export class ExpenseSimpleCard {
  @Input({ required: true }) expense!: ExpenseArticleType;

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private listing = inject(ExpenseListing);

  protected isEdit = signal(false);

  deleteExp() {
    this.dialogSrv.confirmDelete('Allez-vous supprimer cette dépense?').then((confirmed) => {
      confirmed &&
        this.listing
          .removeExpense(this.expense.id)
          .then(() =>
            this.alert.success({ detail: `${this.expense.article.name} a été supprimé.` })
          )
          .catch(() => this.alert.error({ detail: 'Erreur de suppression' }));
    });
  }

  updateExp(event: NgForm) {
    if (event.valid) {
      this.listing
        .updateExpense(this.expense.id, event.value)
        .then(() => this.alert.success({ detail: `${this.expense.article.name} a été modifié.` }))
        .catch(() => this.alert.error({ detail: 'La modification a échoué.' }))
        .finally(() => this.isEdit.set(false));
    }
  }
}
