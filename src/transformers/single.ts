import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Returns the single element from the source iterable that satisfies the optional predicate.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to evaluate.
 * @param pred - Predicate receiving each element and its index; the matching element must be unique.
 * @returns The sole element accepted by `pred`, or the only element in the sequence when `pred` is omitted.
 * @throws Error Thrown when the sequence contains no matching elements or more than one match.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const value = _single([1, 2, 3], (item) => item > 2);
 * console.log(value); // 3
 * ```
 *
 * or using the curried version:
 * ```ts
 * const value = pipeInto(
 *   [1, 2, 3],
 *   single((item) => item > 2)
 * );
 * console.log(value); // 3
 * ```
 */
export function _single<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = (_) => true
): T {
  let itemCount = 0;
  let foundItem: { value: T } | undefined;
  let i = 0;
  for (const item of src) {
    if (pred(item, i++)) {
      ++itemCount;
      if (itemCount > 1) {
        throw Error("sequence contains more than one element");
      }
      foundItem = { value: item };
    }
  }
  if (foundItem) {
    return foundItem.value;
  }
  throw Error("sequence contains no elements");
}

/**
 * Curried version of {@link _single}.
 */
export const single = deferP0(_single);
