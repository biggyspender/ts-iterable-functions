import { deferP0 } from "ts-functional-pipe";
import { Indexed } from "../types/Indexed";
import { _map } from "./map";

/**
 * Pairs each element from the source iterable with its zero-based index.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to enumerate with index positions.
 * @returns A deferred iterable yielding `[item, index]` tuples for every element.
 *
 * @example
 * ```ts
 * const pairs = [..._indexed(["a", "b", "c"])];
 * console.log(pairs); // [["a", 0], ["b", 1], ["c", 2]]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const pairs = [
 *   ...pipeInto(
 *     ["a", "b", "c"],
 *     indexed()
 *   ),
 * ];
 * console.log(pairs); // [["a", 0], ["b", 1], ["c", 2]]
 * ```
 */
export function _indexed<T>(src: Iterable<T>): Iterable<Indexed<T>> {
  return _map(src, (x, i) => [x, i] as const);
}

/**
 * Curried version of {@link _indexed}.
 */
export const indexed = deferP0(_indexed);
