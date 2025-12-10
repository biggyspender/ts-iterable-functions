import { deferP0 } from "ts-functional-pipe";
import { _skipWhile } from "./skipWhile";

/**
 * Skips the specified number of elements from the beginning of the source iterable.
 *
 * @typeParam T - Element type produced by the source iterable.
 * @param src - Source iterable evaluated from which elements may be skipped.
 * @param numItems - Number of leading elements to discard; non-positive values return the source unchanged.
 * @returns A deferred iterable yielding the elements of `src` after the skipped prefix.
 *
 * @example
 * ```ts
 * const remaining = [..._skip([1, 2, 3, 4], 2)];
 * console.log(remaining); // [3, 4]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const remaining = [
 *   ...pipeInto(
 *     [1, 2, 3, 4],
 *     skip(2)
 *   ),
 * ];
 * console.log(remaining); // [3, 4]
 * ```
 */
export function _skip<T>(src: Iterable<T>, numItems: number): Iterable<T> {
  return _skipWhile(src, (_, i) => i < numItems);
}

/**
 * Curried version of {@link _skip}.
 */
export const skip = deferP0(_skip);
