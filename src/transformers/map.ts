import { deferP0 } from "ts-functional-pipe";
import { toIterable } from "../helpers/toIterable";
import { IndexedSelector } from "../types/IndexedSelector";

/**
 * Projects each element of the source iterable into a new form.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TOut - Element type produced by the selector.
 * @param src - Source iterable to transform.
 * @param selector - Selector receiving each element and its index, producing the projected value.
 * @returns A deferred iterable yielding the selector results for each source element.
 * @throws Error Rethrows any error thrown by `selector`.
 *
 * @example
 * ```ts
 * const squares = [..._map([1, 2, 3], (value) => value * value)];
 * console.log(squares); // [1, 4, 9]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const squares = [
 *   ...pipeInto(
 *     [1, 2, 3],
 *     map((value) => value * value)
 *   ),
 * ];
 * console.log(squares); // [1, 4, 9]
 * ```
 */
export function _map<T, TOut>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TOut>
): Iterable<TOut> {
  return toIterable(function* () {
    let c = 0;
    for (const x of src) {
      yield selector(x, c++);
    }
  });
}

/**
 * Curried version of {@link _map}.
 */
export const map = deferP0(_map);
