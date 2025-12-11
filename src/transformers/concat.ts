import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * Concatenates the source iterable with any number of additional iterables in the order provided.
 *
 * @typeParam T - Element type yielded by each iterable.
 * @param src - Source iterable to enumerate first.
 * @param sequences - Additional iterables appended sequentially after the source.
 * @returns A deferred iterable that yields all items from `src` followed by each iterable in `sequences`.
 *
 * @example
 * ```ts
 * const combined = _concat([1, 2], [3], [4, 5]);
 * console.log([...combined]); // [1, 2, 3, 4, 5]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const combined = pipeInto([1, 2], concat([3], [4, 5]));
 * console.log([...combined]); // [1, 2, 3, 4, 5]
 * ```
 */
export function _concat<T>(
  src: Iterable<T>,
  ...sequences: Iterable<T>[]
): Iterable<T> {
  return toIterable(function* () {
    for (const item of src) {
      yield item;
    }
    for (const seq of sequences) {
      for (const item of seq) {
        yield item;
      }
    }
  });
}

/**
 * Curried version of {@link _concat}.
 */
export const concat = deferP0(_concat);
