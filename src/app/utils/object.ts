export const compareArray = <T, K extends keyof T>(current: T[], old: T[], key: K) => {
  const oldMap = new Map(old.map((item) => [item[key], item]));
  const currentMap = new Map(current.map((item) => [item[key], item]));

  const kept = [] as T[];
  const missing = [] as T[];
  const added = [] as T[];

  for (const [id, item] of oldMap) {
    currentMap.has(id) ? kept.push(currentMap.get(id)!) : missing.push(item);
  }

  for (const [id, item] of currentMap) {
    if (!oldMap.has(id)) added.push(item);
  }

  return [ kept, missing, added ]
};
