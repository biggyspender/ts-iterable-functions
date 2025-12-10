import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * Creates a new iterable by pairing consecutive elements from two source iterables
 * and transforming each pair through the provided selector function.
 *
 * Iteration stops as soon as either source iterable is exhausted.
 *
 * @typeParam T - The element type of the first iterable.
 * @typeParam TOther - The element type of the second iterable.
 * @typeParam TOut - The element type produced by the selector function.
 * @param src - The first iterable to zip.
 * @param seq - The second iterable to zip.
 * @param selector - A function that combines each pair of elements into an output value.
 * @returns An iterable yielding the transformed results for each pair of elements.
 *
 * @example
 * ```ts
 * const result = _zip([1, 2], ['a', 'b'], (n, s) => `${n}${s}`);
 * console.log([...result]); // ["1a", "2b"]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = pipeInto(
 *   [1, 2],
 *   zip(['a', 'b'], (n, s) => `${n}${s}`)
 * );
 * console.log([...result]); // ["1a", "2b"]
 * ```
 */
export function _zip<T, TOther, TOut>(
  src: Iterable<T>,
  seq: Iterable<TOther>,
  selector: (item1: T, item2: TOther) => TOut
): Iterable<TOut> {
  return toIterable(function* () {
    const it1 = src[Symbol.iterator]();
    const it2 = seq[Symbol.iterator]();

    for (;;) {
      const it1Result = it1.next();
      const it2Result = it2.next();

      if (it1Result.done || it2Result.done) {
        break;
      }
      yield selector(it1Result.value, it2Result.value);
    }
  });
}

export const zip = deferP0(_zip);
