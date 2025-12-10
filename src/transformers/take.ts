import { deferP0 } from "ts-functional-pipe";
import { _takeWhile } from "./takeWhile";

/**
 * Produces up to the specified number of elements from the beginning of the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate.
 * @param numItems - Maximum number of elements to yield; non-positive values return an empty iterable.
 * @returns A deferred iterable yielding at most `numItems` elements from `src`.
 *
 * @example
 * ```ts
 * const firstTwo = [..._take([1, 2, 3, 4], 2)];
 * console.log(firstTwo); // [1, 2]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const firstTwo = [
 *   ...pipeInto(
 *     [1, 2, 3, 4],
 *     take(2)
 *   ),
 * ];
 * console.log(firstTwo); // [1, 2]
 * ```
 */
export function _take<T>(src: Iterable<T>, numItems: number): Iterable<T> {
  return _takeWhile(src, (_, i) => i < numItems);
}

/**
 * Curried version of {@link _take}.
 */
export const take = deferP0(_take);
