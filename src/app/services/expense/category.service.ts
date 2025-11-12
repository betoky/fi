import { Injectable, signal } from '@angular/core';
import { CategoryParentType, CategoryType, MappedCategories } from '../../domain/spending-category';
import { matching } from '../../utils/string';
import { groupParentsAndChildren, mapParentsAndChildren } from '../../utils/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _initialValue: MappedCategories = { categories: new Map(), subCategories: new Map() };

  categories = signal<CategoryParentType[]>([]);

  set(categories: CategoryType[]) {
    this._initialValue = mapParentsAndChildren(categories);
    this.categories.set(groupParentsAndChildren(this._initialValue, this._initialValue));
  }

  getCategory(id: string): CategoryParentType | CategoryType {
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

    const categories = new Map<string, CategoryParentType>();
    const subCategories = new Map<string, CategoryType[]>();

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
    this._initialValue.categories.clear();
    this._initialValue.subCategories.clear();
  }
}
