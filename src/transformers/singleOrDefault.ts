import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Returns the unique element that satisfies the optional predicate, or `undefined` when no match is found.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to evaluate.
 * @param pred - Predicate receiving each element and its index; the matching element must be unique when provided.
 * @returns The sole element accepted by `pred`, or `undefined` when no element matches.
 * @throws Error Thrown when more than one element satisfies `pred`.
 * @throws Error Rethrows any error thrown by `pred`.
 *
 * @example
 * ```ts
 * const value = _singleOrDefault([1, 2, 3], (item) => item > 3);
 * console.log(value); // undefined
 * ```
 *
 * or using the curried version:
 * ```ts
 * const value = pipeInto(
 *   [1, 2, 3],
 *   singleOrDefault((item) => item > 3)
 * );
 * console.log(value); // undefined
 * ```
 */
export function _singleOrDefault<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = (_) => true
): T | undefined {
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
  return undefined;
}

/**
 * Curried version of {@link _singleOrDefault}.
 */
export const singleOrDefault = deferP0(_singleOrDefault);
