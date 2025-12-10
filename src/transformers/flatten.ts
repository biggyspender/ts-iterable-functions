import { deferP0 } from "ts-functional-pipe";
import { _flatMap } from "./flatMap";

/**
 * Flattens a single level of nested iterables into a lazy iterable of their elements.
 *
 * @typeParam T - Element type produced by each inner iterable.
 * @param src - Source iterable whose items are themselves iterables that will be flattened.
 * @returns A deferred iterable yielding every element from each inner iterable in order.
 *
 * @example
 * ```ts
 * const values = [..._flatten([[1, 2], [3, 4]])];
 * console.log(values); // [1, 2, 3, 4]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const values = pipeInto(
 *   [["a"], ["b", "c"]],
 *   flatten()
 * );
 * console.log([...values]); // ["a", "b", "c"]
 * ```
 */
export function _flatten<T>(src: Iterable<Iterable<T>>): Iterable<T> {
  return _flatMap(src, (x) => x);
}

/**
 * Curried version of {@link _flatten}.
 */
export const flatten = deferP0(_flatten);
