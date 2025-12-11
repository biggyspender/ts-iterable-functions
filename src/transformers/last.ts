import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Returns the last element of the source iterable that satisfies the optional predicate.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate.
 * @param pred - Predicate receiving each element and its index; the most recent truthy match is returned.
 * @returns The last element matching `pred`.
 * @throws Error Thrown when no element satisfies `pred`.
 *
 * @example
 * ```ts
 * const result = _last([1, 2, 3, 4], (value) => value % 2 === 0);
 * console.log(result); // 4
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = pipeInto(
 *   [1, 2, 3, 4],
 *   last((value) => value % 2 === 0)
 * );
 * console.log(result); // 4
 * ```
 */
export function _last<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = () => true,
): T {
  let i = 0;
  let returnValContainer: { value: T } | undefined;
  for (const item of src) {
    if (pred(item, i++)) {
      returnValContainer = { value: item };
    }
  }
  if (returnValContainer) {
    return returnValContainer.value;
  } else {
    throw Error("sequence contains no elements");
  }
}

/**
 * Curried version of {@link _last}.
 */
export const last = deferP0(_last);
