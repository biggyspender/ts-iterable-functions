import { deferP0 } from "ts-functional-pipe";
export function _sequenceEqual<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  equalityComparer?: (a: T | undefined, b: T | undefined) => boolean
): boolean {
  const eq = equalityComparer
    ? (a: T | undefined, b: T | undefined) =>
        typeof a !== "undefined" &&
        typeof b !== "undefined" &&
        equalityComparer(a, b)
    : (a: T | undefined, b: T | undefined) =>
        typeof a !== "undefined" && typeof b !== "undefined" && a === b;
  const it1 = src[Symbol.iterator]();
  const it2 = seq[Symbol.iterator]();
  for (;;) {
    const it1Result = it1.next();
    const it2Result = it2.next();
    if (it1Result.done && it2Result.done) {
      return true;
    }
    if (it1Result.done || it2Result.done) {
      return false;
    }
    if (!eq(it1Result.value, it2Result.value)) {
      return false;
    }
  }
}
export const sequenceEqual = deferP0(_sequenceEqual);
