// Fisher-Yates shuffle
export function shuffle<T>(entries: T[]) {
  const deepCopy = [...entries];
  for (let i = deepCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deepCopy[i], deepCopy[j]] = [deepCopy[j], deepCopy[i]];
  }
  return deepCopy;
}

export function getRandom<T>(entries: T[]) {
  const items = shuffle(entries);
  const n = Math.max(Math.floor(entries.length / 4), Math.floor(Math.random() * entries.length));
  return items.slice(0, n);
}
