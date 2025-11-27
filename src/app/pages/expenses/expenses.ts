import { Component, inject, OnDestroy, signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';
import { ExpenseForm } from '../../components/expense/expense-form/expense-form';
import { ExpenseList } from '../../components/expense/expense-list/expense-list';
import { AutocompleteItems } from '../../services/expense/autocomplete-items';

@Component({
  selector: 'app-expenses',
  imports: [Button, CardModule, SpeedDial, ExpenseList],
  providers: [DialogService],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnDestroy {
  public dialog = inject(DialogService);
  public autoCompleteExpItems = inject(AutocompleteItems);

  protected panelOpened = signal(false);
  protected asideOpened = signal(false);
  protected mobileToggleMenu: MenuItem[] = [
    {
      icon: 'pi pi-list',
      command: () => this.asideOpened.set(true),
    },
    {
      icon: 'pi pi-filter',
      command: () => this.panelOpened.set(true),
    },
  ];

  ngOnDestroy(): void {
    this.autoCompleteExpItems.reset();
  }

  protected openExpenseForm() {
    this.panelOpened.set(false);
    this.dialog.open(ExpenseForm, {
      modal: true,
      showHeader: false,
      contentStyle: {
        paddingTop: '1.5rem',
      },
      draggable: false,
      styleClass: 'mx-4',
    });
  }
}
