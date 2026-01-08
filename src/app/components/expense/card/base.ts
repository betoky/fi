import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { CurrencyPipe } from '@/pipes/currency-pipe';
import { DatePipe } from '@/pipes/date-pipe';
import { ConfirmDialog } from '@/services/confirm-dialog';
import { Expenses } from '@/services/expense/expenses';
import { Alert } from '@/services/alert';
import { formatDate } from '@/utils/date';

@Component({
  selector: 'exp-base-card',
  imports: [DatePipe, Button, CurrencyPipe, Badge, Menu],
  templateUrl: './base.html',
  styles: `
    :host {
      --exp-card-padding: 1rem;
    }

    .collapse-container {
      display: grid;
      grid-template-rows: 0fr;
      overflow: hidden;
      transition: grid-template-rows var(--duration);
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
      transition: visibility var(--duration), opacity var(--duration), margin-top var(--duration), padding-top var(--duration);
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
  host: {
    '[style.--duration]': 'collapseDuration()',
  },
})
export class ExpenseBaseCard {
  id = input.required<number>();
  name = input.required<string>();
  date = input.required<string>();
  amount = input.required<number>();
  description = input<string | null>(null);
  badge = input<string>();
  hasCollapse = input(false);

  onEdit = output<void>();
  onCollapse = output<boolean>();

  protected collapse = signal(false);
  protected collapseDuration = signal('150ms');

  protected contentEl = viewChild<ElementRef<HTMLDivElement>>('content');

  protected controls: MenuItem[] = [
    {
      label: 'Modifier',
      icon: 'pi pi-pen-to-square',
      command: () => this.onEdit.emit(),
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => this.deleteExp(),
    },
  ];

  private alert = inject(Alert);
  private dialogSrv = inject(ConfirmDialog);
  private listing = inject(Expenses);

  constructor() {
    // Dynamic collapse duration based on descrition and content
    effect(() => {
      const content = this.contentEl()?.nativeElement;
      if (content) {
        const { lineHeight } = window.getComputedStyle(content);
        const line = Math.round(content.scrollHeight / parseFloat(lineHeight));
        const value = 65 * line;
        this.collapseDuration.set(`${Math.min(value, 280)}ms`);
      }
    });
  }

  toggle() {
    const collapsed = !this.collapse();
    this.collapse.set(collapsed);
    this.onCollapse.emit(collapsed);
  }

  deleteExp() {
    const confirmationMsg = `Allez-vous supprimer ${this.name()} du ${formatDate(this.date())} ?`;
    this.dialogSrv.confirmDelete(confirmationMsg).then((confirmed) => {
      confirmed &&
        this.listing
          .removeExpense(this.id())
          .then(() => this.alert.success({ detail: `${this.name()} a été supprimé.` }))
          .catch(() => this.alert.error({ detail: 'Erreur de suppression' }));
    });
  }
}
