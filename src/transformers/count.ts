import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Counts the elements of the source iterable that satisfy the optional predicate.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate.
 * @param pred - Predicate receiving each element and its index; truthy results increment the count.
 * @returns Number of elements accepted by `pred`, or the total element count when omitted.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const evens = _count([1, 2, 3, 4], (value) => value % 2 === 0);
 * console.log(evens); // 2
 * ```
 *
 * or using the curried version:
 * ```ts
 * const evens = pipeInto([1, 2, 3, 4], count((value) => value % 2 === 0));
 * console.log(evens); // 2
 * ```
 */
export function _count<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = () => true,
): number {
  let c = 0;
  let i = 0;
  for (const item of src) {
    if (pred(item, i++)) {
      ++c;
    }
  }
  return c;
}

/**
 * Curried version of {@link _count}.
 */
export const count = deferP0(_count);
