export function randomDateSeries(to: Date, sinceAgo = 1) {
  const iterate = new Date(to.getTime());
  iterate.setFullYear(to.getFullYear() - sinceAgo, 0, 1); // from the specified interval of years, starting from 01/01

  const result: Date[] = [];
  do {
    result.push(new Date(iterate.getTime()));
    const dayInterval = Math.floor(Math.random() * 3) + 1;
    iterate.setDate(iterate.getDate() + dayInterval);
  } while (iterate.getTime() < to.getTime());

  return result;
}

export function randomNumber(min: number, max: number, n = 0) {
  if (n <= 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const mutliplier = Math.pow(10, n);
  const minScaled = Math.round(min * mutliplier);
  const maxScaled = Math.round(max * mutliplier);

  const random = Math.floor(Math.random() * (maxScaled - minScaled)) + minScaled;

  return random / mutliplier;
}