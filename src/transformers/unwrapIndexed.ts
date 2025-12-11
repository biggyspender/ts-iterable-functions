import { deferP0, pipeInto as pp } from "ts-functional-pipe";
import { Indexed } from "../types/Indexed";
import { map } from "./map";
import { orderBy } from "./orderBy";

/**
 * Restores the original sequence order from an iterable of value-index tuples.
 *
 * @typeParam T - Element type contained in each indexed entry.
 * @param src - Iterable of value/index pairs to reorder and unwrap.
 * @returns A deferred iterable yielding the values ordered by their stored indices.
 *
 * @example
 * ```ts
 * const indexed: Indexed<string>[] = [
 *   ["two", 1],
 *   ["zero", 0],
 *   ["one", 2],
 * ];
 * const values = [..._unwrapIndexed(indexed)];
 * console.log(values); // ["zero", "two", "one"]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const values = [
 *   ...pipeInto(
 *     [
 *       ["two", 1],
 *       ["zero", 0],
 *       ["one", 2],
 *     ] as Indexed<string>[],
 *     unwrapIndexed()
 *   ),
 * ];
 * console.log(values); // ["zero", "two", "one"]
 * ```
 */
export function _unwrapIndexed<T>(src: Iterable<Indexed<T>>): Iterable<T> {
  return pp(
    src,
    orderBy(([, idx]) => idx),
    map(([value]) => value),
  );
}

/**
 * Curried version of {@link _unwrapIndexed}.
 */
export const unwrapIndexed = deferP0(_unwrapIndexed);
