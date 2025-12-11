import { deferP0 } from "ts-functional-pipe";
import { SetFactory } from "../types/SetFactory";
import { _every } from "./every";

/**
 * Determines whether every element of the source iterable exists in the comparison sequence.
 *
 * @typeParam T - Element type produced by both iterables.
 * @param src - Source iterable whose membership is being tested.
 * @param seq - Iterable that must contain all values from `src`.
 * @param setFactory - Optional factory supplying the set used for membership checks.
 * @returns `true` when `src` is a subset of `seq`, otherwise `false`.
 * @throws Error Rethrows any error thrown by `setFactory`.
 *
 * @example
 * ```ts
 * const result = _isSubsetOf([1, 2], [1, 2, 3]);
 * console.log(result); // true
 * ```
 *
 * or using the curried version:
 * ```ts
 * const result = pipeInto(
 *   [1, 2],
 *   isSubsetOf([1, 2, 3])
 * );
 * console.log(result); // true
 * ```
 */
export function _isSubsetOf<T>(
  src: Iterable<T>,
  seq: Iterable<T>,
  setFactory: SetFactory<T> = { createSet: () => new Set() },
): boolean {
  const set = setFactory.createSet();
  for (const x of seq) {
    set.add(x);
  }
  return _every(src, (x) => set.has(x));
}

/**
 * Curried version of {@link _isSubsetOf}.
 */
export const isSubsetOf = deferP0(_isSubsetOf);
