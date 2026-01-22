import { ExpenseFilter } from '@/components/expense/filter/expense-filter';
import { ExpenseForm } from '@/components/expense/form/expense-form';
import { Expenses } from '@/services/expense/expenses';
import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'exp-action-panel',
  imports: [Button, InputGroup, InputGroupAddon, InputText],
  templateUrl: './expense-action-panel.html',
})
export class ExpenseActionPanel {
  public expService = inject(Expenses);
  public dialog = inject(DialogService);
  private firstOpenFilterModal = true;
  private modalOption = {
    modal: true,
    draggable: false,
    styleClass: 'mx-4',
  };

  openModalFilter() {
    this.dialog.open(ExpenseFilter, {
      ...this.modalOption,
      header: 'Appliquer des filtres',
      closable: true,
      inputValues: { firstOpen: this.firstOpenFilterModal },
    });
    this.firstOpenFilterModal = false;
  }

  openModalForm() {
    this.dialog.open(ExpenseForm, {
      ...this.modalOption,
      showHeader: false,
      contentStyle: {
        paddingTop: '1.5rem',
      },
    });
  }
}
