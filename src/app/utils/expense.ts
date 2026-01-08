import { EditableExpense, UpdateExpenseType } from '@/domains/expense';
import { PriceInfo, ExpenseDetail, UpdateExpDetail } from '@/domains/expense-detail';
import { ExpenseFormType } from '@/domains/expense-form';
import { hasMoreElement } from '@/utils/number';
import { compareArray } from '@/utils/object';

export function getExpenseChange(formData: ExpenseFormType, oldData: EditableExpense) {
  const expenseChange: UpdateExpenseType = {};
  if (oldData.name !== formData.name) {
    expenseChange.name = formData.name;
  }
  if (formData.description && oldData.description !== formData.description) {
    const lenght = formData.description.length;
    expenseChange.description = lenght === 0 ? null : formData.description;
  }
  if (formData.items.length !== oldData.count) {
    expenseChange.count = formData.items.length;
  }
  const total = formData.items.reduce((a, b) => a + b.amount, 0);
  if (total !== oldData.amount) {
    expenseChange.amount = total;
  }
  return expenseChange;
}

function getDetailsFieldChange(actual: PriceInfo, old: PriceInfo) {
  const data = {} as UpdateExpDetail;
  if (actual.amount !== old.amount) {
    data.amount = actual.amount;
  }
  if (actual.quantity !== old.quantity) {
    data.quantity = actual.quantity;
  }
  return data;
}

export function getDetailsChange(
  detailsChange: ExpenseFormType['items'],
  oldDetails: ExpenseDetail[]
) {
  const idMapByItem = new Map<number, number>();
  const detailsMapByItem = new Map<number, PriceInfo>();
  const oldDetailsMapById = new Map<number, PriceInfo>();
  const oldData = oldDetails.map((i) => {
    idMapByItem.set(i.article_id, i.id);
    oldDetailsMapById.set(i.id, { amount: i.amount, quantity: i.quantity });
    return { articleId: i.article_id, categoryId: i.article.category_id };
  });
  const formData = detailsChange.map((i) => {
    detailsMapByItem.set(i.item.id, { amount: i.amount, quantity: i.quantity });
    return { articleId: i.item.id, categoryId: i.item.category_id };
  });

  const [kept, missing, added] = compareArray(formData, oldData, 'articleId');

  const changedDetails = [] as (UpdateExpDetail & { id: number })[];
  for (const { articleId } of kept) {
    const id = idMapByItem.get(articleId)!;
    const formData = detailsMapByItem.get(articleId)!;
    const oldData = oldDetailsMapById.get(id)!;
    const changed = getDetailsFieldChange(formData, oldData);

    if (Array.from(Object.keys(changed)).length > 0) {
      changedDetails.push({ id, ...changed });
    }
  }

  return {
    addedCategories: added.map((i) => i.categoryId),
    removedCategories: missing.map((i) => i.categoryId),
    addedDetails: added.map((i) => ({
      article_id: i.articleId,
      ...detailsMapByItem.get(i.articleId)!,
    })),
    removedDetails: missing.map((i) => idMapByItem.get(i.articleId)!),
    changedDetails,
  };
}

export function formatBadge(count: number, quantity?: number, unit?: string | null) {
  const isToDisplay = !!quantity && hasMoreElement(quantity);
  if (unit && isToDisplay) {
    return quantity + ' ' + unit;
  }

  if (isToDisplay) {
    return quantity + ' unités';
  }

  if (!quantity && hasMoreElement(count)) {
    return count + ' unités';
  }

  return undefined;
}
