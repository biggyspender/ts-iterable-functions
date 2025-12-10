import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Returns the last element of the source iterable that satisfies the optional predicate, or `undefined` when none match.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate.
 * @param pred - Predicate receiving each element and its index; the most recent truthy match is returned.
 * @returns The last matching element, or `undefined` when no match exists.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const result = _lastOrDefault([1, 2, 3, 4], (value) => value > 4);
 * console.log(result); // undefined
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = pipeInto(
 *   [1, 2, 3, 4],
 *   lastOrDefault((value) => value % 2 === 0)
 * );
 * console.log(result); // 4
 * ```
 */
export function _lastOrDefault<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = (_) => true
): T | undefined {
  let i = 0;
  let returnVal;
  for (const item of src) {
    if (pred(item, i++)) {
      returnVal = item;
    }
  }
  return returnVal;
}

/**
 * Curried version of {@link _lastOrDefault}.
 */
export const lastOrDefault = deferP0(_lastOrDefault);
