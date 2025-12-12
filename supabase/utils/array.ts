// Fisher-Yates shuffle
export function shuffle<T>(entries: T[]) {
  const deepCopy = [...entries];
  for (let i = deepCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deepCopy[i], deepCopy[j]] = [deepCopy[j], deepCopy[i]];
  }
  return deepCopy;
}

export function getRandom<T>(entries: T[], min?: number, max?: number) {
  const items = shuffle(entries);
  if (!min) {
    min = Math.floor(entries.length / 4);
  }
  if (!max) {
    max = Math.floor(Math.random() * entries.length);
  }
  return items.slice(0, Math.max(min, max));
}

export function sequenceBlock<T>(array: T[], n = 20) {
  return array.reduce((blocks, item) => {
    const lastBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;
    const isNext = blocks.length === 0 || lastBlock?.length === n;
    isNext ? blocks.push([item]) : lastBlock?.push(item);
    return blocks;
  }, [] as T[][]);
}
