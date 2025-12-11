import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * Returns an iterable that yields the source items or `undefined` when the source is empty.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable whose contents are forwarded to the result when available.
 * @returns A deferred iterable producing the original sequence or a single `undefined` when no elements exist.
 *
 * @example
 * ```ts
 * const values = [..._defaultIfEmpty([1, 2, 3])];
 * console.log(values); // [1, 2, 3]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const values = [...pipeInto([], defaultIfEmpty<number>())];
 * console.log(values); // [undefined]
 * ```
 */
export function _defaultIfEmpty<T>(src: Iterable<T>): Iterable<T | undefined> {
  return toIterable<T | undefined, () => IterableIterator<T | undefined>>(
    function* () {
      let yielded = false;
      for (const x of src) {
        yield x;
        yielded = true;
      }
      if (!yielded) {
        yield undefined;
      }
    },
  );
}

/**
 * Curried version of {@link _defaultIfEmpty}.
 */
export const defaultIfEmpty = deferP0(_defaultIfEmpty);
