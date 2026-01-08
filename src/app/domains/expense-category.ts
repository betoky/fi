import { Tables } from '@/database.types';

export type CategoryType = Tables<'expense_categories'>;

export type CategoryParentType = Omit<CategoryType, 'parent'> & {
  children: CategoryType[];
};

export const isParent = (
  category: CategoryType | CategoryParentType
): category is CategoryParentType => 'children' in category;

export type MappedCategories = {
  categories: Map<number, CategoryParentType>;
  subCategories: Map<number, CategoryType[]>;
};
