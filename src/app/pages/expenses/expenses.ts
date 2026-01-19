import { ExpenseForm } from "@/components/expense/form/expense-form";
import { ExpenseList } from "@/components/expense/list/expense-list";
import { Categories } from "@/services/expense/categories";
import { Items } from "@/services/expense/items";
import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { MenuItem } from "primeng/api";
import { AutoComplete } from "primeng/autocomplete";
import { Button } from "primeng/button";
import { DialogService } from "primeng/dynamicdialog";
import { SpeedDial } from 'primeng/speeddial';


@Component({
  selector: 'app-expenses',
  imports: [Button, SpeedDial, ExpenseList, AutoComplete],
  providers: [DialogService],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses implements OnDestroy, OnInit {
  public dialog = inject(DialogService);
  public items = inject(Items);
  protected categories = inject(Categories);

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

  ngOnInit(): void {
    this.categories.init();
  }

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
