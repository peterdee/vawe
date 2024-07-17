import type * as types from 'types';

export function getItem<T>(key: types.LocalStorageKey): T | null {
  const string = localStorage.getItem(key);
  if (!string) {
    return null;
  }
  try {
    const storedValue: types.LocalStorageValue<T> = JSON.parse(string);
    return storedValue.value || null;
  } catch {
    return null;
  }
}

export function setItem(key: types.LocalStorageKey, value: unknown) {
  localStorage.setItem(key, JSON.stringify({ value }));
}
