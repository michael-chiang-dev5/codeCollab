// This is used to set a property on an object, ie, T[K] = value
// T is the object type
// K is a key that exists on T
export function setProperty<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): void {
  obj[key] = value;
}
