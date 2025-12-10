import { Comparer, defaultComparer } from "ts-comparer-builder";
import { deferP0 } from "ts-functional-pipe";
import { IndexedSelector } from "../types/IndexedSelector";
import { _minMaxByImpl } from "./helpers/minMaxByImpl";

/**
 * Selects the elements whose key value is maximal according to the comparer.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @typeParam TKey - Key type produced by the selector and consumed by the comparer.
 * @param src - Source iterable to evaluate.
 * @param selector - Selector receiving each element and its index, producing the key used for comparison.
 * @param comparer - Comparer determining ordering between keys; defaults to {@link defaultComparer}.
 * @returns An iterable containing every element sharing the maximal key, or an empty iterable when the source is empty.
 * @throws Error Rethrows any error thrown by `selector` or `comparer`.
 *
 * @example
 * ```ts
 * const players = [
 *   { name: "Ada", score: 18 },
 *   { name: "Tess", score: 24 },
 *   { name: "Ian", score: 24 },
 * ];
 * const topPlayers = [..._maxBy(players, (player) => player.score)];
 * console.log(topPlayers);
 * // [ { name: "Tess", score: 24 }, { name: "Ian", score: 24 } ]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const topPlayers = [
 *   ...pipeInto(
 *     [
 *       { name: "Ada", score: 18 },
 *       { name: "Tess", score: 24 },
 *       { name: "Ian", score: 24 },
 *     ],
 *     maxBy((player) => player.score)
 *   ),
 * ];
 * console.log(topPlayers);
 * // [ { name: "Tess", score: 24 }, { name: "Ian", score: 24 } ]
 * ```
 */
export function _maxBy<T, TKey>(
  src: Iterable<T>,
  selector: IndexedSelector<T, TKey>,
  comparer: Comparer<TKey> = defaultComparer
): Iterable<T> {
  return _minMaxByImpl(src, selector, (a, b) => comparer(a, b));
}

/**
 * Curried version of {@link _maxBy}.
 */
export const maxBy = deferP0(_maxBy);
