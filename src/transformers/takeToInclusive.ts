import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";
import { toIterable } from "../helpers/toIterable";

/**
 * Collects elements from the source iterable until the predicate first returns a truthy value, including that element.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate.
 * @param pred - Predicate receiving each element and its index; iteration stops after it returns a truthy value.
 * @returns A deferred iterable yielding items up to and including the element that satisfies `pred`.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const inclusive = [..._takeToInclusive([1, 2, 3, 4, 5], (value) => value >= 3)];
 * console.log(inclusive); // [1, 2, 3]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const inclusive = [
 *   ...pipeInto(
 *     [1, 2, 3, 4, 5],
 *     takeToInclusive((value) => value >= 3)
 *   ),
 * ];
 * console.log(inclusive); // [1, 2, 3]
 * ```
 */
export function _takeToInclusive<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T>
): Iterable<T> {
  return toIterable(function* () {
    let i = 0;
    for (const item of src) {
      const result = pred(item, i++);
      yield item;
      if (result) {
        break;
      }
    }
  });
}

/**
 * Curried version of {@link _takeToInclusive}.
 */
export const takeToInclusive = deferP0(_takeToInclusive);
