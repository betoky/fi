import { CategoryParentType } from '@/domains/expense-category';
import { Categories } from '@/services/expense/categories';
import { Expenses } from '@/services/expense/expenses';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

const FILTER_KEY = 'exp-c-f';

@Component({
  selector: 'app-expense-filter',
  imports: [AutoComplete, Button, FormsModule],
  templateUrl: './expense-filter.html',
})
export class ExpenseFilter implements OnInit {
  @Input() firstOpen!: boolean;

  catService = inject(Categories);
  private expService = inject(Expenses);
  private dialogRef = inject(DynamicDialogRef);

  selectedItems = signal([] as CategoryParentType[]);

  selectedIds = computed(() => {
    const parentAndChilds = this.selectedItems().map(({ id }) => {
      const cat = this.catService.getCategory(id);
      if (cat && 'children' in cat) {
        const childIds = cat.children.map(({ id }) => id);
        return [id, ...childIds];
      }
      return [id];
    });
    return parentAndChilds.flat();
  });

  suggestions = computed(() => {
    // Remove from suggestions the selected items
    const categories = this.catService.categories();
    return categories.filter(({ id }, index) => {
      categories[index].children = categories[index].children.filter(
        (child) => !this.selectedIds().includes(child.id),
      );
      return !this.selectedIds().includes(id);
    });
  });

  ngOnInit(): void {
    this.catService.init();
    if (this.firstOpen) {
      localStorage.removeItem(FILTER_KEY);
      return;
    }
    const cached = localStorage.getItem(FILTER_KEY);
    if (cached) {
      const data = JSON.parse(cached) as CategoryParentType[];
      this.selectedItems.set(data);
    }
  }

  onReset() {
    this.selectedItems.set([]);
  }

  onApply() {
    localStorage.setItem(FILTER_KEY, JSON.stringify(this.selectedItems()));
    this.expService.filterByCategories(this.selectedIds());
    this.dialogRef.close();
  }
}
