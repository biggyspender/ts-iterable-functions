import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";

/**
 * Combines two iterables by applying a selector to aligned pairs until either source is exhausted.
 *
 * @typeParam T - Element type produced by the first iterable.
 * @typeParam TOther - Element type produced by the second iterable.
 * @typeParam TOut - Element type yielded by the selector.
 * @param src - Primary iterable providing the first element of each pair.
 * @param seq - Secondary iterable providing the second element of each pair.
 * @param selector - Function mapping a pair of elements to the emitted value.
 * @returns A deferred iterable yielding the selector results for each aligned pair.
 * @throws Error Rethrows any error thrown by `selector`.
 *
 * @example
 * ```ts
 * const result = _zip(
 *   [1, 2],
 *   ["a", "b"],
 *   (value, label) => `${value}${label}`
 * );
 * console.log([...result]); // ["1a", "2b"]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = [
 *   ...pipeInto(
 *     [1, 2],
 *     zip(
 *       ["a", "b"],
 *       (value, label) => `${value}${label}`
 *     )
 *   ),
 * ];
 * console.log(result); // ["1a", "2b"]
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

/**
 * Curried version of {@link _zip}.
 */
export const zip = deferP0(_zip);
