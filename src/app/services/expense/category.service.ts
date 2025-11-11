import { Injectable, signal } from '@angular/core';
import { Tables } from '../../types/database.types';

type ExpenseCategory = Tables<'expense_categories'>;

type GroupedCategory = ExpenseCategory & {
  sub: ExpenseCategory[];
};

type MappedCategories = {
  categories: Map<string, ExpenseCategory>;
  subCategories: Map<string, ExpenseCategory[]>;
};

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _initialValue: MappedCategories = { categories: new Map(), subCategories: new Map() };

  categories = signal<GroupedCategory[]>([]);

  set(categories: ExpenseCategory[]) {
    this._initialValue = this.mapParentsAndChildren(categories);
    this.categories.set(this.groupParentsAndChildren(this._initialValue));
  }

  private matchQuery(name: string, query: string) {
    return name.toLowerCase().includes(query.toLowerCase());
  }

  filter(query: string) {
    if (query.length === 0) {
      this.categories.set([...this.groupParentsAndChildren(this._initialValue)]);
      return;
    }
    const { categories: C, subCategories: S } = this._initialValue;
    const parents = Array.from(C.values());
    const children = Array.from(S.values()).flat();

    const mathParents = parents.filter((i) => this.matchQuery(i.name, query)).map((i) => i.id);
    const mathChildren = children.filter(
      (i) => this.matchQuery(i.name, query) && !mathParents.includes(i.parent!)
    );

    const categories = new Map<string, ExpenseCategory>();
    const subCategories = new Map<string, ExpenseCategory[]>();

    // Build categories(Map) and subCategories(Map) from the match parents
    mathParents.forEach((parentID) => {
      categories.set(parentID, this._initialValue.categories.get(parentID)!);
      subCategories.set(parentID, this._initialValue.subCategories.get(parentID)!);
    });

    // Build scategories(Map) and subCategories(Map) from the match children
    mathChildren.forEach((category) => {
      const parentID = category.parent!;
      if (!categories.has(parentID)) {
        categories.set(parentID, this._initialValue.categories.get(parentID)!);
      }

      const items = subCategories.get(parentID);
      subCategories.set(parentID, items ? [...items, category] : [category]);
    });

    this.categories.set(this.groupParentsAndChildren({ categories, subCategories }));
  }

  reset() {
    this.categories.set([]);
    this._initialValue.categories.clear();
    this._initialValue.subCategories.clear();
  }

  private mapParentsAndChildren(array: ExpenseCategory[]): MappedCategories {
    const categories = new Map<string, ExpenseCategory>();
    const subCategories = new Map<string, ExpenseCategory[]>();
    for (const category of array) {
      const parentID = category.parent;
      if (!parentID) {
        categories.set(category.id, category);
        continue;
      }

      if (subCategories.has(parentID)) {
        const items = subCategories.get(parentID)!;
        subCategories.set(parentID, [...items, category]);
        continue;
      }

      subCategories.set(parentID, [category]);
    }

    return { categories, subCategories };
  }

  private groupParentsAndChildren({
    categories,
    subCategories,
  }: MappedCategories): GroupedCategory[] {
    const result: GroupedCategory[] = [];
    for (const [parentID, category] of categories) {
      const initItemSize = this._initialValue.subCategories.get(parentID)?.length;
      const items = subCategories.get(parentID) ?? [];
      const parentOnly = items.length === 0;
      const isFull = items.length === initItemSize;

      if (parentOnly || isFull) {
        const parentAsSelectable = {
          ...category,
          name: parentOnly ? 'Sélectionner ' + category.name : category.name + ' (Tous)',
        };
        result.push({ ...category, sub: [parentAsSelectable, ...items] });
        continue;
      }
      result.push({ ...category, sub: items });
    }
    return [...result];
  }
}
