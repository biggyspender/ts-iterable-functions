import { pipeInto as pp, deferP0 } from "ts-functional-pipe";
import { SetFactory } from "../types/SetFactory";
import { concat } from "./concat";
import { distinct } from "./distinct";

/**
 * Produces the union of two iterables, preserving the first occurrence of each distinct element.
 *
 * @typeParam T - Element type produced by the source and additional iterables.
 * @param src - Primary iterable whose elements appear first in the result.
 * @param seq - Secondary iterable whose unique elements extend the union.
 * @param setFactory - Optional factory creating the set instance used for uniqueness tracking.
 * @returns A deferred iterable yielding distinct elements from `src` followed by unseen items from `seq`.
 * @throws Error Rethrows any error thrown by `setFactory` or during enumeration of the inputs.
 *
 * @example
 * ```ts
 * const left = [1, 2, 3];
 * const right = [3, 4, 5];
 * const merged = [..._union(left, right)];
 * console.log(merged); // [1, 2, 3, 4, 5]
 * ```
 *
 * or using the curried version:
 * ```ts
 * const merged = [
 *   ...pipeInto(
 *     [1, 2, 3],
 *     union([3, 4, 5])
 *   ),
 * ];
 * console.log(merged); // [1, 2, 3, 4, 5]
 * ```
 */
export function _union<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory?: SetFactory<T>,
): Iterable<T> {
  return pp(src, concat(seq), distinct(setFactory));
}

/**
 * Curried version of {@link _union}.
 */
export const union = deferP0(_union);
