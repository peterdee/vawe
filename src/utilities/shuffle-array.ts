export default function shuffleArray<T>(array: T[]): T[] {
  const copy: T[] = new Array(array.length);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [array[j], array[i]];
  }
  return copy;
}
