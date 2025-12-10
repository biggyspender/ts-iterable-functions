import { Comparer, defaultComparer } from "ts-comparer-builder";
import { deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { _minMaxByImpl } from "./helpers/minMaxByImpl";

/**
 * Selects the elements whose key value is minimal according to the comparer.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TKey - Key type produced by the selector and consumed by the comparer.
 * @param src - Source iterable to evaluate.
 * @param selector - Selector receiving each element and its index, producing the key used for comparison.
 * @param comparer - Comparer determining ordering between keys; defaults to {@link defaultComparer}.
 * @returns An iterable containing every element sharing the minimal key, or an empty iterable when the source is empty.
 * @throws Error Rethrows any error thrown by `selector` or `comparer`.
 *
 * @example
 * ```ts
 * const tasks = [
 *   { id: 1, duration: 12 },
 *   { id: 2, duration: 5 },
 *   { id: 3, duration: 5 },
 * ];
 * const quickest = [..._minBy(tasks, (task) => task.duration)];
 * console.log(quickest);
 * // [ { id: 2, duration: 5 }, { id: 3, duration: 5 } ]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const quickest = [
 *   ...pipeInto(
 *     [
 *       { id: 1, duration: 12 },
 *       { id: 2, duration: 5 },
 *       { id: 3, duration: 5 },
 *     ],
 *     minBy((task) => task.duration)
 *   ),
 * ];
 * console.log(quickest);
 * // [ { id: 2, duration: 5 }, { id: 3, duration: 5 } ]
 * ```
 */
export function _minBy<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  comparer: Comparer<TKey> = defaultComparer
): Iterable<T> {
  return _minMaxByImpl(src, selector, (a, b) => -comparer(a, b));
}

/**
 * Curried version of {@link _minBy}.
 */
export const minBy = deferP0(_minBy);
