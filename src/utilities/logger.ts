export default function log(...values: unknown[]) {
  console.log(`[${new Date().toLocaleTimeString()}]:`, ...values);
}
