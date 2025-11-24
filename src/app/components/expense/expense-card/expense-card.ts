import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DatePipe } from '../../../pipes/date-pipe';
import { CurrencyPipe } from '../../../pipes/currency-pipe';

@Component({
  selector: 'expense-card',
  imports: [DatePipe, Button, CurrencyPipe, Badge, Menu],
  templateUrl: './expense-card.html',
  styles: `
    :host {
      --exp-card-padding: 1rem;
    }

    .collapse-container {
      display: grid;
      grid-template-rows: 0fr;
      overflow: hidden;
      transition: grid-template-rows 0.15s;
      transition-timing-function: ease-in;
    }

    .collapse-container.open {
      grid-template-rows: 1fr;
    }

    .collapse-content {
      padding-inline: var(--exp-card-padding);
      min-height: 0;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0.15s, opacity 0.15s, margin-top 0.15s, padding-top 0.15s;
      transition-timing-function: ease-in;
    }

    .collapse-container.open .collapse-content {
      padding-block: var(--exp-card-padding);
      border-top-style: solid;
      border-color: var(--p-content-border-color);
      border-top-width: 1px;
      visibility: visible;
      opacity: 1;
    }
  `,
})
export class ExpenseCard {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) date!: string;
  @Input({ required: true }) amount!: number;
  @Input() description: string|null = null;
  @Input() badge?: string;
  @Input() hasCollapse = false;
  
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onCollapse = new EventEmitter<boolean>();
  
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

  protected collapse = signal(false);

  toggle() {
    const collapsed = !this.collapse();
    this.collapse.set(collapsed);
    this.onCollapse.next(collapsed);
  }
}
