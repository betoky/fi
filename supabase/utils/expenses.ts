import data from "../data/expenses-categories.json";
import { shuffle } from "./array";

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

export function randomExpenseType() {
  const X: ('G'|'S')[] = ['G', 'G', 'G', 'S'];
  const randomIndex = Math.floor(Math.random() * X.length);

  return shuffle(X)[randomIndex];
}