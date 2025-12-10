import { deferP0 } from "ts-functional-pipe";

/**
 * Materializes the source iterable into a concrete array.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable to expand.
 * @returns An array containing every element yielded by `src` in iteration order.
 *
 * @example
 * ```ts
 * const snapshot = _toArray(new Set([1, 2, 3]));
 * console.log(snapshot); // [1, 2, 3]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const snapshot = pipeInto(new Set([1, 2, 3]), toArray());
 * console.log(snapshot); // [1, 2, 3]
 * ```
 */
export function _toArray<T>(src: Iterable<T>): T[] {
  return [...src];
}

/**
 * Curried version of {@link _toArray}.
 */
export const toArray = deferP0(_toArray);
