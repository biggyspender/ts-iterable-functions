import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Determines whether any element of the source iterable satisfies the optional predicate.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to evaluate.
 * @param pred - Predicate receiving each element and its index; defaults to a predicate that always returns `true`.
 * @returns `true` when `pred` returns truthy for any element, otherwise `false`.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const hasEven = _some([1, 3, 4], (value) => value % 2 === 0);
 * console.log(hasEven); // true
 * ```
 *
 * or using the curried version:
 * ```ts
 * const hasEven = pipeInto(
 *   [1, 3, 4],
 *   some((value) => value % 2 === 0)
 * );
 * console.log(hasEven); // true
 * ```
 */
export function _some<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = (_) => true,
): boolean {
  let i = 0;
  for (const item of src) {
    if (pred(item, i++)) {
      return true;
    }
  }
  return false;
}

/**
 * Curried version of {@link _some}.
 */
export const some = deferP0(_some);
