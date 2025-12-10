import { deferP0 } from "ts-functional-pipe";
import { _aggregate } from "./aggregate";

/**
 * Calculates the arithmetic sum of all numbers in the source iterable.
 *
 * @param src - Source iterable yielding numeric values to accumulate.
 * @returns Total of all elements in `src`, or `0` when the iterable is empty.
 *
 * @example
 * ```ts
 * const total = _sum([1, 2, 3, 4]);
 * console.log(total); // 10
 * ```
 *
 * or using the curried version:
 * ```ts
 * const total = pipeInto([1, 2, 3, 4], sum());
 * console.log(total); // 10
 * ```
 */
export function _sum(src: Iterable<number>): number {
  return _aggregate(src, 0, (acc, val) => acc + val);
}

/**
 * Curried version of {@link _sum}.
 */
export const sum = deferP0(_sum);
