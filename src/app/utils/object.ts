export function mapById<T>(data: (T & {id: string})[]) {
  const mapped = new Map<string, T>();
  data.forEach(i => mapped.set(i.id, i));
  return mapped;
}
