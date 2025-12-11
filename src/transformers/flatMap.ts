import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedSelector } from "../types/IndexedSelector";

/**
 * Maps each element to an iterable and yields every item from the flattened results in source order.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TOut - Element type emitted by the projected iterables.
 * @param src - Source iterable enumerated to supply values to `selector`.
 * @param selector - Projection invoked with the current value and index to produce an iterable of results.
 * @returns A deferred iterable yielding items from each projected iterable sequentially.
 *
 * @example
 * ```ts
 * const values = [..._flatMap([1, 2], (n) => [n, n * 10])];
 * console.log(values); // [1, 10, 2, 20]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const values = pipeInto(
 *   ["a", "b"],
 *   flatMap((value, index) => [`${value}${index}`, `${value.toUpperCase()}${index}`])
 * );
 * console.log([...values]); // ["a0", "A0", "b1", "B1"]
 * ```
 */
export function _flatMap<T, TOut>(
  src: Iterable<T>,
  selector: IndexedSelector<T, Iterable<TOut>>,
): Iterable<TOut> {
  return toIterable(function* () {
    let i = 0;
    for (const seq of src) {
      for (const item of selector(seq, i++)) {
        yield item;
      }
    }
  });
}

/**
 * Curried version of {@link _flatMap}.
 */
export const flatMap = deferP0(_flatMap);
