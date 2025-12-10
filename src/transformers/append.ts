import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * Appends a single item to the end of the source iterable and returns a lazy iterable including the new item.
 *
 * @typeParam T - Element type produced by the source iterable and the appended value.
 * @param src - Source iterable to consume before emitting the appended item.
 * @param item - Value appended as the final element of the resulting iterable.
 * @returns A deferred iterable yielding the original sequence followed by the appended item.
 *
 * @example
 * ```ts
 * const result = _append([1, 2], 3);
 * console.log([...result]); // [1, 2, 3]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = pipeInto([1, 2], append(3));
 * console.log([...result]); // [1, 2, 3]
 * ```
 */
export function _append<T>(src: Iterable<T>, item: T): Iterable<T> {
  return toIterable(function* () {
    for (const x of src) {
      yield x;
    }
    yield item;
  });
}

/**
 * Curried version of {@link _append}
 */
export const append = deferP0(_append);
