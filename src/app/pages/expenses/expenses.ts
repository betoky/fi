import { Component, OnDestroy, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { SpeedDial } from 'primeng/speeddial';
import { ExpenseForm } from '@/components/expense/form/expense-form';
import { ExpenseList } from '@/components/expense/list/expense-list';
import { Items } from '@/services/expense/items';

@Component({
  selector: 'app-expenses',
  imports: [Button, SpeedDial, ExpenseList],
  providers: [DialogService],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnDestroy {
  public dialog = inject(DialogService);
  public items = inject(Items);

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
    this.items.reset();
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
