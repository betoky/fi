import { Injectable, inject, signal } from '@angular/core';
import { CategoryParentType, CategoryType, MappedCategories } from '@/domains/expense-category';
import { Category } from '@/services/supabase/category';
import { groupParentsAndChildren, mapParentsAndChildren } from '@/utils/category';
import { matching } from '@/utils/string';

@Injectable({
  providedIn: 'root',
})
export class Categories {
  private category = inject(Category);
  private _initialValue: MappedCategories = { categories: new Map(), subCategories: new Map() };

  private cached = false;

  categories = signal<CategoryParentType[]>([]);

  init() {
    if (!this.cached) {
      this.category.fetchCategories().then((data) => {
        this._initialValue = mapParentsAndChildren(data);
        this.categories.set(groupParentsAndChildren(this._initialValue, this._initialValue));
        this.cached = true;
      });
    }
  }

  getCategory(id: number): CategoryParentType | CategoryType {
    if (this._initialValue.categories.has(id)) {
      const parent = this._initialValue.categories.get(id)!;
      return {
        ...parent,
        children: this._initialValue.subCategories.get(id) ?? [],
      };
    }

    const children = Array.from(this._initialValue.subCategories.values()).flat();

    return children.find((category) => category.id === id)!;
  }

  filter(query: string) {
    if (query.length === 0) {
      this.categories.set([...groupParentsAndChildren(this._initialValue, this._initialValue)]);
      return;
    }
    const { categories: C, subCategories: S } = this._initialValue;
    const parents = Array.from(C.values());
    const children = Array.from(S.values()).flat();

    const mathParents = parents.filter((i) => matching(query, i.name)).map((i) => i.id);
    const mathChildren = children.filter(
      (i) => matching(query, i.name) && !mathParents.includes(i.parent!)
    );

    const categories = new Map<number, CategoryParentType>();
    const subCategories = new Map<number, CategoryType[]>();

    // Build categories(Map) and subCategories(Map) from the match parents
    mathParents.forEach((parentID) => {
      const { categories: C, subCategories: S } = this._initialValue;
      categories.set(parentID, C.get(parentID)!);
      subCategories.set(parentID, S.get(parentID)!);
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

    this.categories.set(groupParentsAndChildren({ categories, subCategories }, this._initialValue));
  }

  reset() {
    this.categories.set([]);
    this.cached = false;
    this._initialValue.categories.clear();
    this._initialValue.subCategories.clear();
  }
}
