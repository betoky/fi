import data from "../data/expenses-categories.json";

export type Cat = { name: string; parent: string | null };

export function getCategories() {
  const map = new Map<string, Cat>();
  data.forEach(({ id, name, sub }) => {
    map.set(id, { name, parent: null });
    sub.forEach(({ id: child, name: nameChild }) =>
      map.set(child, { name: nameChild, parent: id })
    );
  });

  return map;
}