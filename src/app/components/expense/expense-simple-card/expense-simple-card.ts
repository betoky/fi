import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePipe } from '../../../pipes/date-pipe';
import { CurrencyPipe } from '../../../pipes/currency-pipe';
import { ExpenseViewType } from '../../../domain/expense';
import { Alert } from '../../../services/alert';
import { ConfirmDialog } from '../../../services/confirm-dialog';
import { ExpenseListing } from '../../../services/expense/expense-listing';
import { ExpenseCardControl } from '../expense-card-control/expense-card-control';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'expense-simple-card',
  imports: [
    FormsModule,
    DatePipe,
    ButtonModule,
    BadgeModule,
    ExpenseCardControl,
    CurrencyPipe,
    Dialog,
    InputNumberModule,
    TextareaModule,
  ],
  templateUrl: './expense-simple-card.html',
  styleUrl: './../expense-card.css',
})
export class ExpenseSimpleCard {
  @Input({ required: true }) expense!: ExpenseViewType;

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private listing = inject(ExpenseListing);

  protected collapse = signal(false);
  protected isEdit = signal(false);

  deleteExp() {
    this.dialogSrv.confirmDelete('Allez-vous supprimer cette dépense?').then((confirmed) => {
      confirmed &&
        this.listing
          .removeSimpleExpense(this.expense.id)
          .then(() => this.alert.success({ detail: `${this.expense.article.name} a été supprimé.` }))
          .catch(() => this.alert.error({ detail: 'Erreur de suppression' }));
    });
  }

  updateExp(event: NgForm) {
    if (event.valid) {
      this.listing
        .updateSimpleExpense(this.expense.id, event.value)
        .then(() => this.alert.success({ detail: `${this.expense.article.name} a été modifié.` }))
        .catch(() => this.alert.error({ detail: 'La modification a échoué.' }))
        .finally(() => this.isEdit.set(false));
    }
  }
}
