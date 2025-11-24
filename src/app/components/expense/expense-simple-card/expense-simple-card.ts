import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { Alert } from '../../../services/alert';
import { ConfirmDialog } from '../../../services/confirm-dialog';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { ExpenseCard } from "../expense-card/expense-card";
import { ExpenseArticleType } from '../../../domain/expense';

@Component({
  selector: 'expense-simple-card',
  imports: [
    FormsModule,
    ButtonModule,
    BadgeModule,
    Dialog,
    InputNumberModule,
    TextareaModule,
    ExpenseCard
],
  templateUrl: './expense-simple-card.html'
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
          .then(() => this.alert.success({ detail: `${this.expense.article.name} a été supprimé.` }))
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
