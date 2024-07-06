export default function formatTrackName(name: string): string {
  const partials = name.split('.');
  if (partials.length === 1) {
    return name;
  }
  partials.pop();
  return partials.join('.');
}
