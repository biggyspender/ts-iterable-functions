import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Skips elements from the source iterable while the predicate evaluates to truthy.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate.
 * @param pred - Predicate receiving each element and its index; truthy results continue skipping.
 * @returns A deferred iterable that starts yielding once `pred` first returns falsy.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const remaining = [..._skipWhile([1, 3, 5, 2, 4], (value) => value < 4)];
 * console.log(remaining); // [5, 2, 4]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const remaining = [
 *   ...pipeInto(
 *     [1, 3, 5, 2, 4],
 *     skipWhile((value) => value < 4)
 *   ),
 * ];
 * console.log(remaining); // [5, 2, 4]
 * ```
 */
export function _skipWhile<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>,
): Iterable<T> {
  return toIterable(function* () {
    let i = 0;
    let skip = true;
    for (const item of src) {
      if (skip) {
        const result = pred(item, i++);
        if (result) {
          continue;
        }
      }
      skip = false;
      yield item;
    }
  });
}

/**
 * Curried version of {@link _skipWhile}.
 */
export const skipWhile = deferP0(_skipWhile);
