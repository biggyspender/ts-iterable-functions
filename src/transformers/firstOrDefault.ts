import { deferP0 } from "ts-functional-pipe";
import { IndexedPredicate } from "../types/IndexedPredicate";

/**
 * Returns the first element in the source iterable that satisfies the predicate or `undefined` if none do.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable examined until a matching element is found.
 * @param pred - Predicate receiving the current value and index; defaults to a function that accepts every value.
 * @returns The first matching element, or `undefined` when the predicate never returns true.
 *
 * @example
 * ```ts
 * const value = _firstOrDefault([10, 20, 30]);
 * console.log(value); // 10
 * ```
 *
 * or using the curried version:
 * ```ts
 * const value = pipeInto(
 *   [1, 2, 3],
 *   firstOrDefault((n, i) => n > 5 || i > 5)
 * );
 * console.log(value); // undefined
 * ```
 */
export function _firstOrDefault<T>(
  src: Iterable<T>,
  pred: IndexedPredicate<T> = () => true
): T | undefined {
  let i = 0;
  for (const item of src) {
    if (pred(item, i++)) {
      return item;
    }
  }
  return undefined;
}

/**
 * Curried version of {@link _firstOrDefault}.
 */
export const firstOrDefault = deferP0(_firstOrDefault);
