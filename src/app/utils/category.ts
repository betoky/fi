import { CategoryType, CategoryParentType, MappedCategories } from '../domains/expense-category';

export function mapParentsAndChildren(array: CategoryType[]): MappedCategories {
  const categories = new Map<string, CategoryParentType>();
  const subCategories = new Map<string, CategoryType[]>();
  for (const category of array) {
    const { parent, ...rest } = category;
    if (!parent) {
      categories.set(category.id, { ...rest, children: [] });
      continue;
    }

    if (subCategories.has(parent)) {
      const items = subCategories.get(parent)!;
      subCategories.set(parent, [...items, category]);
      continue;
    }

    subCategories.set(parent, [category]);
  }

  return { categories, subCategories };
}

export function groupParentsAndChildren(
  newValue: MappedCategories,
  initialValue: MappedCategories
): CategoryParentType[] {
  const { categories, subCategories } = newValue;
  const result: CategoryParentType[] = [];
  for (const [parentID, category] of categories) {
    const initItemSize = initialValue.subCategories.get(parentID)?.length;
    const items = subCategories.get(parentID) ?? [];
    const parentOnly = items.length === 0;
    const isFull = items.length === initItemSize;

    if (parentOnly || isFull) {
      const parentAsSelectable = {
        ...category,
        parent: null,
        name: parentOnly ? 'Sélectionner ' + category.name : category.name + ' (Tous)',
      };
      result.push({ ...category, children: [parentAsSelectable, ...items] });
      continue;
    }
    result.push({ ...category, children: items });
  }
  return [...result];
}
