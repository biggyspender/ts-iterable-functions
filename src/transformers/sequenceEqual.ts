import { deferP0 } from "ts-functional-pipe";

/**
 * Determines whether the source iterable and the comparison iterable yield equal elements in order.
 *
 * @typeParam T - Element type produced by both iterables.
 * @param src - Source iterable to evaluate.
 * @param seq - Second iterable whose values are compared against the source.
 * @param equalityComparer - Optional comparer invoked for each pair of elements; defaults to strict equality.
 * @returns `true` when both iterables produce the same number of elements and each pair matches under the comparer.
 * @throws Error Rethrows any error thrown by `equalityComparer`.
 *
 * @example
 * ```ts
 * const same = _sequenceEqual([1, 2, 3], [1, 2, 3]);
 * console.log(same); // true
 * ```
 *
 * or using the curried version:
 * ```ts
 * const same = pipeInto(
 *   [1, 2, 3],
 *   sequenceEqual([1, 2, 3])
 * );
 * console.log(same); // true
 * ```
 */
export function _sequenceEqual<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  equalityComparer?: (a: T | undefined, b: T | undefined) => boolean,
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

/**
 * Curried version of {@link _sequenceEqual}.
 */
export const sequenceEqual = deferP0(_sequenceEqual);
