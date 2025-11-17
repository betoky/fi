import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from "primeng/menu";
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'expense-card-control',
  imports: [Menu, ButtonModule],
  templateUrl: './expense-card-control.html',
})
export class ExpenseCardControl {
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  protected controls: MenuItem[] = [
    {
      label: 'Modifier',
      icon: 'pi pi-pen-to-square',
      command: () => this.onEdit.next(),
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => this.onDelete.next(),
    },
  ];
}
