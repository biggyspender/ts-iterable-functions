import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * Produces the elements of the source iterable in reverse enumeration order.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable whose elements will be yielded from last to first.
 * @returns A deferred iterable that yields the reversed sequence of `src`.
 *
 * @example
 * ```ts
 * const values = [..._reverse([1, 2, 3])];
 * console.log(values); // [3, 2, 1]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const values = [
 *   ...pipeInto(
 *     [1, 2, 3],
 *     reverse()
 *   ),
 * ];
 * console.log(values); // [3, 2, 1]
 * ```
 */
export function _reverse<T>(src: Iterable<T>): Iterable<T> {
  return toIterable(function* () {
    const out = [...src].reverse();
    for (const x of out) {
      yield x;
    }
  });
}

/**
 * Curried version of {@link _reverse}.
 */
export const reverse = deferP0(_reverse);
