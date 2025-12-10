import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { SetFactory } from "../types/SetFactory";

/**
 * Yields the elements that appear in both the source iterable and the comparison sequence.
 *
 * @typeParam T - Element type produced by the source iterable and comparison sequence.
 * @param src - Source iterable enumerated for intersecting values.
 * @param seq - Iterable providing the values to retain from `src`.
 * @param setFactory - Optional factory supplying the set used to test membership.
 * @returns A deferred iterable yielding items found in both sequences, preserving source order.
 * @throws Error Rethrows any error thrown by `setFactory`.
 *
 * @example
 * ```ts
 * const result = [..._intersect([1, 2, 3, 4], [2, 4, 6])];
 * console.log(result); // [2, 4]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = [
 *   ...pipeInto(
 *     [1, 2, 3, 4],
 *     intersect([2, 4, 6])
 *   ),
 * ];
 * console.log(result); // [2, 4]
 * ```
 */
export function _intersect<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = { createSet: () => new Set() }
): Iterable<T> {
  return toIterable(function* () {
    const set: Set<T> = setFactory.createSet();
    for (const item of seq) {
      set.add(item);
    }
    for (const item of src) {
      if (set.has(item)) {
        yield item;
      }
    }
  });
}

/**
 * Curried version of {@link _intersect}.
 */
export const intersect = deferP0(_intersect);
