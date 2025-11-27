import { computed, inject, Injectable, signal } from '@angular/core';
import { Item } from './item';
import { CategoryParentType, CategoryType, isParent } from '../../domain/expense-category';
import { ExpenseItemType } from '../../domain/expense-item';
import { matching } from '../../utils/string';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteItems {
  private itemDB = inject(Item);
  private _keepValue = [] as ExpenseItemType[];
  private _suggestions = signal([] as ExpenseItemType[]);
  private category: CategoryParentType | CategoryType | null = null;

  suggestions = computed(() =>
    this._suggestions().map((i) => {
      const name = i.unit ? `${i.name} (${i.unit})` : i.name;
      return { name, id: i.id, category_id: i.category_id };
    })
  );

  setCategory(category: CategoryParentType | CategoryType | null) {
    this.category = category;
    if (!category) {
      this._keepValue = [];
      this._suggestions.set([]);
      return;
    }
    const categoryIDS = [category.id];
    if (isParent(category)) {
      category.children.forEach((c) => categoryIDS.push(c.id));
    }
    this.itemDB.fetchByCategory(...categoryIDS).then((data) => {
      this._keepValue = data;
      this._suggestions.set(data);
    });
  }

  filter(query: string) {
    if (query.length === 0) {
      this._suggestions.set([...this._keepValue]);
      return;
    }

    if (this.category) {
      const matched = this._keepValue.filter((item) => matching(query, item.name));
      this._suggestions.set(matched);
      return;
    }
    this.itemDB.search(query).then((data) => this._suggestions.set(data));
  }

  reset() {
    this._keepValue = [];
    this._suggestions.set([]);
  }
}
