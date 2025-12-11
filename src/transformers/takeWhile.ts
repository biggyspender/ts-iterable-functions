import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Produces elements from the source iterable while the predicate returns a truthy value.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate.
 * @param pred - Predicate receiving each element and its index; iteration stops once it returns a falsy value.
 * @returns A deferred iterable yielding the leading elements that satisfy `pred`.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const leadingSmall = [..._takeWhile([1, 2, 3, 2], (value) => value < 3)];
 * console.log(leadingSmall); // [1, 2]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const leadingSmall = [
 *   ...pipeInto(
 *     [1, 2, 3, 2],
 *     takeWhile((value) => value < 3)
 *   ),
 * ];
 * console.log(leadingSmall); // [1, 2]
 * ```
 */
export function _takeWhile<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>,
): Iterable<T> {
  return toIterable(function* () {
    let i = 0;
    for (const item of src) {
      const result = pred(item, i++);
      if (!result) {
        break;
      }
      yield item;
    }
  });
}
/**
 * Curried version of {@link _takeWhile}.
 */
export const takeWhile = deferP0(_takeWhile);
