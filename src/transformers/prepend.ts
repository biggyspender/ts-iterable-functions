import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * Prepends a single item ahead of all elements produced by the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable that will be prefixed with `item` when enumerated.
 * @param item - Element yielded before any value from the source iterable.
 * @returns A deferred iterable that first yields `item` and then every element from `src`.
 *
 * @example
 * ```ts
 * const values = [..._prepend([2, 3], 1)];
 * console.log(values); // [1, 2, 3]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const values = [
 *   ...pipeInto(
 *     [2, 3],
 *     prepend(1)
 *   ),
 * ];
 * console.log(values); // [1, 2, 3]
 * ```
 */
export function _prepend<T>(src: Iterable<T>, item: T): Iterable<T> {
  return toIterable(function* () {
    yield item;
    for (const x of src) {
      yield x;
    }
  });
}

/**
 * Curried version of {@link _prepend}.
 */
export const prepend = deferP0(_prepend);
