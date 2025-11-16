import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SpeedDial } from 'primeng/speeddial';
import { ExpenseForm } from '../../components/expense/expense-form/expense-form';
import { ExpenseList } from '../../components/expense/expense-list/expense-list';
import { ExpenseListing } from '../../services/expense/expense-listing';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-expenses',
  imports: [Button, CardModule, SpeedDial, ExpenseList],
  providers: [DialogService],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnDestroy {
  public dialog = inject(DialogService);
  private destroy$ = new Subject<void>();
  private expenseListing = inject(ExpenseListing);

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
    this.destroy$.next();
  }

  protected openExpenseForm() {
    this.panelOpened.set(false);
    this.dialog
      .open(ExpenseForm, {
        modal: true,
        showHeader: false,
        contentStyle: {
          paddingTop: '1.5rem',
        },
        draggable: false,
        styleClass: 'mx-4',
      })
      ?.onClose.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (submitted) => {
          if (submitted) {
            this.expenseListing.fetchData();
            this.destroy$.next();
          }
        },
      });
  }
}
