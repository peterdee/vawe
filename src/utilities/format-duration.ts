function formatValue(value: number): string {
  if (value >= 10) {
    return `${value}`;
  }
  return `0${value}`;
}

export default function formatDuration(durationSeconds: number): string {
  const roundedSeconds = Math.ceil(durationSeconds);
  if (roundedSeconds < 60) {
    return `00:${formatValue(roundedSeconds)}`;
  }
  const minutes = Math.floor(roundedSeconds / 60);
  if (minutes < 60) {
    return `${formatValue(minutes)}:${formatValue(roundedSeconds % 60)}`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours}:${formatValue(minutes % 60)}:${formatValue(roundedSeconds % 60)}`;
}
